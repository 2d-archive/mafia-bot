import { PrefixSupplier } from "discord-akairo";
import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Embed } from "../..";
import { Message } from "discord.js";

export default class HelpCommand extends Command {

  public constructor() {
    super("help", {
      aliases: ["help", "halp", "❓", "commands"],
      args: [{
        id: "command",
        type: "commandAlias"
      }],
      description: {
        content: "Displays the current commands, or info for a specific command.",
        usage: "[ command ]",
        examples: [
          "help ping",
          "help"
        ]
      },
      category: "misc"
    });
  }

  public async exec(message: Message, { command }: { command: Command }) {
    const prefix = this.handler.prefix[0];
    if (!command) {
      const help = Embed("Mafia-Bot allows you to play Mafia (or werewolf) in your discord server!")
      for (const [id, category] of this.handler.categories)
        help.addField(
          `• ${id.replace(/(\b\w)/gi, lc => lc.toUpperCase())}`,
          category
            .filter(cmd => cmd.aliases.length > 0)
            .map(cmd => cmd.aliases[0])
            .join(", ")
        );
      return message.util!.send(help);
    }

    const embed = Embed(command.description.content)
      .setTitle(`${prefix}${command.aliases[0]}${` ${command.description.usage || ""}` || ""}`)

    if (command.aliases.length > 1) embed.addField("• Aliases", `\`${command.aliases.join("`, `")}\``, true)
    if (command.description.examples && command.description.examples.length)
      embed.addField(
        `• Examples`,
        `\`${command.description.examples.join("`\n`")}\``,
        true
      );

    return message.util!.send(embed)
  }
}