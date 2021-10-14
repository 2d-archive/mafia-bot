import { Command } from "discord-akairo";
import { Embed } from "../..";
import { Message } from "discord.js";
import { Role } from "discord.js";

export default class PlayerRole extends Command {
  public constructor() {
    super("player-role", {
      aliases: [ "playerRole", "setup-player-role" ],
      description: {
        content: "Sets the player role for the guild.",
        usage: "<mention|name|id>",
        examples: [ "m!playerRole player", "m!playerRole @player", "m!playerRole 655607092891353109" ]
      },
      args: [{
        id: "player",
        type: "role"
      }],
      channel: "guild",
      userPermissions: "MANAGE_GUILD"
    });
  }

  public async exec(message: Message, { player }: { player: Role }) {
    const guild = await this.client.db.ensure(message.guild)
    if (!player)
    return message.util!.send(Embed(guild.playerRole 
      ? `The current player role is **<@&${guild.playerRole}>**.` 
      : "There is no player role setup. Use `m!playerRole` to set it."));
    guild.playerRole = player.id;
    await guild.save()

    return message.util!.send(Embed(`Configured the player role to **<@&${player.id}>**.`));
  }
}