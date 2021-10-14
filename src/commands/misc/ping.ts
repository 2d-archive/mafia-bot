import { Command } from "discord-akairo";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: [ "ping", "pong", "latency" ],
      description: {
        content: "Shows the ping for stuff."
      }
    })
  }
}