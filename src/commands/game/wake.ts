import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Embed } from "../..";

export default class CreateGame extends Command {
  public constructor() {
    super("wake", {
      aliases: [ "wake" ],
      description: {
        content: "Wakes up stuff."
      },
      channel: "guild",
      userPermissions(message: Message) {
        const role = this.client.db.get(message.guild.id, "moderatorRole", "");
        if (!role || !message.member.roles.has(role)) return "Game Moderator";
        return;
      },
      category: "game"
    });
  }

  public async exec(message: Message) {
    const game = this.client.games.get(message.guild.id);
    if (!game)
      return message.util!.send(Embed("Use `m!create` to start a game of Mafia!").setColor("RED"));
    
    const role = 
      <"doctor" | "mafia" | "detective" | "daytime"> 
      game.channels.findKey(tc => tc.id === message.channel.id);
    return game.wake(role === "daytime" ? undefined : role);
  }
}