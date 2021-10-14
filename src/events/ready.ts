import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
      category: "client"
    });
  }

  public exec() {
    this.client.log.info("Mafia-Bot is now ready!");
    this.client.user.setActivity({
      name: "for m!create",
      type: "WATCHING"
    });
  }
}