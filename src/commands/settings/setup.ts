import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Embed } from "../..";

export default class SetupBot extends Command {
  public constructor() {
    super("channels", {
      aliases: [ "channels", "setup-channels" ],
      description: {
        content: "Configure the game channels.",
        usage: "<daytime> <detective> <doctor> <mafia>"
      },
      channel: "guild",
      userPermissions: "MANAGE_GUILD",
      args: [{
        id: "daytime",
        type: "textChannel",
        prompt: {
          start: Embed("Please provide the daytime talk channel."),
          cancel: Embed("Cancelled the request!")
        }
      }, {
        id: "detective",
        type: "textChannel",
        prompt: {
          start: Embed("Please provide the detective talk channel."),
          cancel: Embed("Cancelled the request!")
        }
      }, {
        id: "doctor",
        type: "textChannel",
        prompt: {
          start: Embed("Please provide the doctor talk channel."),
          cancel: Embed("Cancelled the request!")
        }
      }, {
        id: "mafia",
        type: "textChannel",
        prompt: {
          start: Embed("Please provide the mafia talk channel."),
          cancel: Embed("Cancelled the request!")
        }
      }]
    });
  }

  public async exec(message: Message, args) {
    try {
      const entry = await this.client.db.ensure(message.guild);
      await entry.setChannels(args);
      return message.util!.send(Embed("Configured the bot!"));
    } catch(e) {
      this.client.log.error(e);
      return message.util!.send(Embed("Sorry, I ran into an error...").setColor("RED"))
    } 
  }
}