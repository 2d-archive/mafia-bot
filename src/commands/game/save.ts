import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Argument } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Embed } from "../..";

export default class InvestigateSomeone extends Command {
  public constructor() {
    super("save", {
      aliases: [ "save" ],
      description: {
        content: "Saves another player.",
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
        id: "person",
        type: Argument.validate("member", (message: Message, _, value: GuildMember) => {
          const game = this.client.games.get(message.guild.id), player = game.getPlayer(value.id);
          if (value.id === message.author.id && game.getPlayer(message.author.id).savedself) return false;
          if ((!player || player.killed)) return false;
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
  
  public async exec(message: Message, { person }: { person: GuildMember }) {
    const game = this.client.games.get(message.guild.id);
    if (!game)
      return message.util!.send(Embed("Use `m!create` to start a game of Mafia!").setColor("RED"));
    
    if (!game.started)
      return message.util!.send(Embed("You're not sly! Wait for the game to start.").setColor("RED"))

    const night = game.nights.last();
    if (night.saved) 
      return message.util!.send(Embed(`Sorry, you can't save more than 1 perspn`).setColor("RED"));

    await night.save(person.id);
    return message.util!.send(Embed(`**${person.user.tag}** is protected for tonight.`));
  }
}