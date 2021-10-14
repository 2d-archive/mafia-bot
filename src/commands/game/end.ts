import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Embed } from "../..";
import { Player } from "../../structures/game/Player";

export default class EndGame extends Command {
  public constructor() {
    super("end-game", {
      aliases: [ "end", "snap-fingers", "end-game" ],
      description: {
        content: "Ends the game",
      },
      userPermissions(message: Message) {
        const role = this.client.db.get(message.guild.id, "moderatorRole", "");
        if (!role || !message.member.roles.has(role)) return "Game Moderator";
        return;
      },
      channel: "guild",
    });
  }

  public async exec(message: Message) {
    const game = this.client.games.get(message.guild.id);
    if (!game)
      return message.util!.send(Embed("Use `m!create` to start a game of Mafia!").setColor("RED")); 

    game.channels.forEach(channel => {
      channel.permissionOverwrites.filter((p) => p.type === "member")
        .forEach(p => {
          channel.updateOverwrite(p.id, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
          });
        });
    });

    this.client.games.delete(message.guild.id);
    if (!game.started)
      return message.util!.send(Embed("Ended the game."))

    const winner = (): ["villagers"|"mafia", Player[]] => {
      const mafiaAlive = game.sorted.get("mafia").filter(player => !player.killed);
      const villagerAlive = [
        ...game.sorted.get("detective"),
        ...game.sorted.get("doctor"),
        ...game.sorted.get("villager"),
      ].filter(player => !player.killed)

      if (mafiaAlive.length > villagerAlive.length) return ["mafia", mafiaAlive];
      else return ["villagers", villagerAlive];
    }

    const wins = winner();
    return message.util!.send(Embed(`The **${wins[0]}** wons!!\n Congrats ${wins[1].map((p) => `**<@${p.id}>**`).join(" ")}`));
  }
}