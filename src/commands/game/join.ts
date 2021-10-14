import { Command } from "discord-akairo";
import { Embed } from "../..";
import { Message } from "discord.js";

export default class JoinGame extends Command {
  public constructor() {
    super("join", {
      aliases: [ "join", "join-game" ],
      description: {
        content: "Joins a game that's waiting for players."
      },
      channel: "guild",
      category: "game"
    });
  }

  public async exec(message: Message) {
    const game = this.client.games.get(message.guild.id)
    if (!game)
      return message.util!.send(Embed("Use `m!create` to start a game of Mafia!").setColor("RED"));

    if (message.member.roles.has(game.entry.moderatorRole))
      return message.util!.send(Embed("Sorry... you're the moderator, you can't join the lobby."))
    if (game.getPlayer(message.author.id))
      return message.util!.send(Embed("You have already joined, use `m!leave` to leave the lobby."))

    await message.member.roles.add(game.entry.playerRole);
    await game.addPlayer(message.author.id);

    return message.util!.send(Embed("Added you to the player list, your role will be DMed when the game starts! Use `m!leave` to leave the lobby."));
  }
}