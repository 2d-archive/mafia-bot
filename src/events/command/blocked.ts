import { Listener } from "discord-akairo";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Embed } from "../..";

export default class CommandBlocked extends Listener {
  public constructor() {
    super("command-blocked", {
      emitter: "commands",
      event: "commandBlocked",
      category: "command"
    });
  }
  
  public async exec(message: Message, command: Command, reason) {
    switch (reason) {
      case "guild":
        message.util!.send(Embed(`Sorry, the command **${command.id}** can only be used in a guild.`));
        break;
    }
  }
}