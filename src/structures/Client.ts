import Logger from "@ayana/logger";
import { AkairoClient, AkairoOptions, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { ClientOptions } from "discord.js";
import { join } from "path";
import { Connection, getRepository } from "typeorm";
import { Embed } from "..";
import { create } from "../database";
import { Guild } from "../database/Guild";
import TypeORMProvider from "../database/Provider";
import { Game } from "./game/Game";

declare module "discord-akairo" {
  interface AkairoClient {
    events: ListenerHandler;
    commands: CommandHandler;
    db: TypeORMProvider;
    connection: Connection;
    inhibitors: InhibitorHandler;
    log: Logger;
  }
}

export default class MafiaClient extends AkairoClient {
  public log: Logger = Logger.get("Mafia");
  public db: TypeORMProvider;
  public connection: Connection;
  public commands: CommandHandler;
  public inhibitors: InhibitorHandler;
  public games: Map<string, Game> = new Map();
  public events: ListenerHandler;

  public constructor(token: string, options: AkairoOptions & ClientOptions) {
    super(options);

    this.commands = new CommandHandler(this, {
      prefix: ["m!", "m ", "m>", "m."],
      directory: join(__dirname, "..", "commands"),
      defaultCooldown: 3000,
      commandUtil: true,
      aliasReplacement: /-/g,
      allowMention: true,
      automateCategories: true,
      argumentDefaults: {
        prompt: {
          modifyCancel: (_, text) => Embed(text),
          modifyEnded: (_, text) => Embed(text),
          modifyRetry: (_, text) => Embed(text),
          modifyStart: (_, text) => Embed(text),
          modifyTimeout: (_, text) => Embed(text),
          cancelWord: "cancel",
          retries: 3
        }
      }
    });

    this.events = new ListenerHandler(this, {
      directory: join(__dirname, "..", "events")
    });

    Object.defineProperty(this, "token", { value: token });
  }

  public async login(token?: string): Promise<string> {
    this.commands.useListenerHandler(this.events);
    this.events.setEmitters({
      process,
      commands: this.commands,
      events: this.events,
      client: this
    });

    this.commands.loadAll();
    this.events.loadAll();

    this.connection = await create();
    this.db = new TypeORMProvider(getRepository(Guild));
    this.db.init();

    return super.login(token);
  }
}
