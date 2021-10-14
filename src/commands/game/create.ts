import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Game } from "../../structures/game/Game";
import { Embed } from "../..";
import { TextChannel } from "discord.js";

export default class CreateGame extends Command {
  public constructor() {
    super("create-game", {
      aliases: [ "create", "create-game" ],
      description: {
        content: "Creates a new game."
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
    if (this.client.games.has(message.guild!.id))   
      return message.util!.send(Embed("There's already a game created."));

    const data = await this.client.db.ensure(message.guild.id);
    if (!data.configured) 
      return message.util!.send(Embed("You have to configure the bot before starting a game."));

    const game = new Game(this.client, message.guild!.id);
    game.setupChannels(channel => <TextChannel> message.guild.channels.get(data.channels[channel]));
    
    this.client.games.set(game.guild, game);
    
    return message.util!.send(Embed("Started a game! For players use `m!join` to join the lobby!"))
  }
}