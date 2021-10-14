import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { Embed } from "../..";

export default class CommandCooldown extends Listener {
  public constructor() {
    super("cooldown", {
      emitter: "commands",
      event: "cooldown",
      category: "command"
    });
  }

  public async exec(message: Message, _command: Command, remaining: number) {
    return message.util!.send(Embed(`Sorry, you have *${Math.round(remaining / 1000)}s* left on your cooldown.`));
  }
}