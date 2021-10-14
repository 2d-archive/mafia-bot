import { Command } from "discord-akairo";
import { Embed } from "../..";
import { Message } from "discord.js";
import { Role } from "discord.js";

export default class ModeratorRole extends Command {
  public constructor() {
    super("role-limits", {
      aliases: [ "roleLimits", "setup-role-limits" ],
      description: {
        content: "Set the limit for different roles in the game.",
        usage: "<detectives> <doctors> <mafia> <villagers>",
      },
      args: [{
        id: "detective",
        type: "number"
      }, {
        id: "doctor",
        type: "number"
      }, {
        id: "mafia",
        type: "number"
      }, {
        id: "villager",
        type: "number"
      }],
      channel: "guild",
      userPermissions: "MANAGE_GUILD"
    });
  }

  public async exec(message: Message, args) {
    const guild = await this.client.db.ensure(message.guild)
    if (!args.detective) return message.util!.send(Embed(`The current limits are:\n**1.** Detective: ${guild.detectiveLimit}\n**2.** Doctor: ${guild.doctorLimit}\n**3.** Mafia: ${guild.mafiaLimit}\n**4.** Villager: ${guild.villagerLimit}\n`))

    Object.keys(args).forEach(k => guild[`${k}Limit`] = args[k]);
    await guild.save();

    return message.util!.send(Embed(`Configured the role limits.`));
  }
}