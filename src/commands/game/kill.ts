import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Embed } from "../..";

export default class InvestigateSomeone extends Command {
  public constructor() {
    super("kill", {
      aliases: [ "kill" ],
      description: {
        content: "Kills another player.",
        usage: "<player-id>"
      },
      userPermissions(message: Message) {
        const game = this.client.games.get(message.guild.id);
        if (game && game.getPlayer(message.author.id).role !== "mafia")
          return "Mafia";
        return;
      },
      ignorePermissions: ["396096412116320258"],
      channel: "guild",
      args: [{
        id: "suspect",
        type: Argument.validate("member", (message: Message, _, value: GuildMember) => {
          const game = this.client.games.get(message.guild.id), player = game.getPlayer(value.id);
          if (!game) return true;
          if (value.id !== message.author.id && (!player || player.killed)) return false;
          else return true;
        }),
        prompt: {
          start: "Provide someone that's alive and is apart of the game.",
          retry: "Please provide someone that's alive and is apart of the game."
        }
      }],
      category: "game"
    });
  }
  
  public async exec(message: Message, { suspect }: { suspect: GuildMember }) {
    const game = this.client.games.get(message.guild.id);
    if (!game)
      return message.util!.send(Embed("Use `m!create` to start a game of Mafia!").setColor("RED"));
    
    if (!game.started)
      return message.util!.send(Embed("You're not sly! Wait for the game to start.").setColor("RED"))

    const night = game.nights.last();
    if (night.killed) 
      return message.util!.send(Embed(`Sorry, you can't kill more than 1 person.`).setColor("RED"));

    await night.kill(suspect.id);
    return message.util!.send(Embed(`**${suspect.user.tag}** has a pending kill.`));
  }
}