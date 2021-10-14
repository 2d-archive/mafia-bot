import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Game } from "../../structures/game/Game";
import { Embed } from "../..";
import { TextChannel } from "discord.js";
import { Night } from "../../structures/game/Night";

export default class CreateGame extends Command {
  public constructor() {
    super("sleep", {
      aliases: [ "sleep" ],
      description: {
        content: "Starts a new night."
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
    return game.sleep(role === "daytime" ? undefined : role);
  }
}