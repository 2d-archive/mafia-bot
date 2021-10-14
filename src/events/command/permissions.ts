import { Listener } from "discord-akairo";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Embed } from "../..";

export default class MissingPermissions extends Listener {
  public constructor() {
    super("missing-permissions", {
      emitter: "commands",
      event: "missingPermissions",
      category: "command"
    });
  }

  public async exec(
    message: Message, 
    command: Command, 
    target: "client" | "user", 
    missing: string | string[]
  ) {
    switch(target) {
      case "client":
        message.util!.send(Embed(`Sorry, the bot is missing the following permissions:\n${Array.isArray(missing) 
          ? missing.map((m, i) => `**${i++}**. ${m}`).join("\n") 
          : `**1**. ${missing}`}`).setColor("RED"));
        break;
      case "user":
        message.util!.send(Embed(`Sorry, you're missing the following permissions:\n${Array.isArray(missing) 
          ? missing.map((m, i) => `**${i++}**. ${m}`).join("\n") 
          : `**1**. ${missing}`}`).setColor("RED"));
        break;
    }
  }
}