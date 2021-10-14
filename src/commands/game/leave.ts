import { Command } from "discord-akairo";
import { Embed } from "../..";
import { Message } from "discord.js";

export default class leaveGame extends Command {
  public constructor() {
    super("leave", {
      aliases: [ "leave", "lave-game" ],
      description: {
        content: "Leave's the game you're in."
      },
      channel: "guild",
      category: "game"
    });
  }

  public async exec(message: Message) {
    const game = this.client.games.get(message.guild.id), 
      entry = await this.client.db.ensure(message.guild);
    if (!game)
      return message.util!.send(Embed("Use `m!create` to start a game of Mafia!").setColor("RED"));

    if (message.member.roles.has(entry.moderatorRole))
      return message.util!.send(Embed("Sorry... you're the moderator, you can't be in a lobby."))

    if (!game.getPlayer(message.author.id))
      return message.util!.send(Embed("You haven't joined, use `m!join` to join the lobby!"))
    await game.addPlayer(message.author.id);

    return message.util!.send(Embed("You have left the lobby."));
  }
}