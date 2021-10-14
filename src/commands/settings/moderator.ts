import { Command } from "discord-akairo";
import { Embed } from "../..";
import { Message } from "discord.js";
import { Role } from "discord.js";

export default class ModeratorRole extends Command {
  public constructor() {
    super("moderator-role", {
      aliases: [ "moderatorRole", "setup-moderator-role" ],
      description: {
        content: "Sets the moderator role for the guild.",
        usage: "<mention|name|id>",
        examples: [ "m!moderatorRole Moderator", "m!moderatorRole @Moderator", "m!moderatorRole 655607092891353109" ]
      },
      args: [{
        id: "moderator",
        type: "role"
      }],
      channel: "guild",
      userPermissions: "MANAGE_GUILD"
    });
  }

  public async exec(message: Message, { moderator }: { moderator: Role }) {
    const guild = await this.client.db.ensure(message.guild);
    if (!moderator)
      return message.util!.send(Embed(guild.moderatorRole 
        ? `The current moderator role is **<@&${guild.moderatorRole}>**.` 
        : "There is no moderator role setup. Use `m!moderatorRole` to set it."));

    guild.moderatorRole = moderator.id;
    await guild.save()

    return message.util!.send(Embed(`Configured the moderator role to **<@&${moderator.id}>**.`));
  }
}