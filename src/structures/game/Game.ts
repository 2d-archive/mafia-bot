import { Collection } from "discord.js";
import { Night } from "./Night";
import { Player } from "./Player";
import { Guild } from "../../database/Guild";
import MafiaClient from "../Client";
import { TextChannel } from "discord.js";
import { Embed } from "../..";

const Roles: Role[] = ["villager", "doctor", "detective", "mafia"];
export type Role = "villager" | "doctor" | "detective" | "mafia";
export type Channel =
  | "moderator"
  | "doctor"
  | "detective"
  | "mafia"
  | "daytime";

export class Game {
  public night: number = 0;
  public nights: Collection<number, Night>;
  public channels: Collection<Channel, TextChannel>;
  public sorted: Collection<Role, Player[]>;
  public started: boolean = false;
  public entry: Guild;

  public constructor(public client: MafiaClient, public guild: string) {
    let i = 0;
    this.nights = new Collection();
    this.channels = new Collection();
    this.sorted = new Collection(
      Array(4)
        .fill(null)
        .map(() => [Roles[i++], []])
    );
  }

  public get players(): Player[] {
    const players = [];
    for (const role of this.sorted.array()) players.push(...role);
    return players;
  }

  public setupChannels(channel: (role: Channel) => TextChannel): void {
    for (const ch of <Channel[]>["doctor", "detective", "mafia", "daytime"])
      this.channels.set(ch, channel(ch));
  }

  public addPlayer(id: string) {
    const _r = this.available[
        Math.floor(Math.random() * this.available.length)
      ],
      p = this.sorted.get(_r);

    const player = new Player(this, id, _r);
    return this.sorted.set(_r, [player, ...p]);
  }

  public getPlayer(id: string): Player {
    return this.players.find(p => p.id === id);
  }

  public async start() {
    if (!this.started) this.started = true;
    if (!this.entry) this.entry = await this.client.db.ensure(this.guild);

    const daytime = this.channels.get("daytime");
    this.night++;
    const night = new Night(this, this.night);

    this.sorted.forEach(async (p, r) => {
      const channel = this.channels.get(<Channel>r);
      p.forEach(async ({ id }) => {
        if (channel)
          await channel.updateOverwrite(id, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true
          });
        return this.client.users
          .get(id)
          .send(
            Embed(
              `You are a **${r === "mafia" ? "mafia member" : r}**, Good Luck!`
            )
          );
      });
    });

    this.nights.set(night.count, night);
    daytime.updateOverwrite(this.entry.playerRole, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: true
    });

    return daytime.send(
      Embed(`It's now **Night ${this.night}**, you cannot talk now.`)
    );
  }

  public async sleep(role?: "detective" | "doctor" | "mafia") {
    let channel = this.channels.get(role || "daytime"),
      daytime = this.channels.get("daytime");
    let overwrite = { SEND_MESSAGES: false, VIEW_CHANNEL: true };

    switch (role) {
      case "detective":
      case "doctor":
      case "mafia":
        this.sorted
          .get(role)
          .forEach(({ id }) => channel.createOverwrite(id, overwrite));
        daytime.send(
          Embed(`Sleep ${role.charAt(1).toUpperCase() + role.slice(1)}.`)
        );
        channel.send(Embed("Sleep!"));
        break;
      default:
        this.night++;
        this.nights.set(this.night, new Night(this, this.night));

        daytime.createOverwrite(this.entry.playerRole, overwrite);
        daytime.send(
          Embed(`It's now **Night ${this.night}**, you cannot talk now.`)
        );
        break;
    }
  }
  public async wake(role?: "detective" | "doctor" | "mafia") {
    let channel = this.channels.get(role || "daytime"),
      daytime = this.channels.get("daytime");
    let overwrite = { SEND_MESSAGES: true, VIEW_CHANNEL: true };

    switch (role) {
      case "detective":
      case "doctor":
      case "mafia":
        this.sorted
          .get(role)
          .forEach(({ id }) => channel.createOverwrite(id, overwrite));
        daytime.send(
          Embed(`Wakeup ${role.charAt(1).toUpperCase() + role.slice(1)}.`)
        );
        channel.send(Embed("Wake Up!"), { content: "@here" });
        break;
      default:
        daytime.createOverwrite(this.entry.playerRole, overwrite);
        const wakeup = [
          "🎵 *Rise and Shine!!* 🎵",
          "Good Morning Players!",
          "WAKE UP!!!!"
        ];
        daytime.send(Embed(wakeup[Math.floor(Math.random() * wakeup.length)]), {
          content: "@here"
        });
        break;
    }
  }

  public toJSON() {
    return {
      nights: this.nights.map(n => n.toJSON()),
      sorted: this.sorted.map(r => r.map(p => p.toJSON())),
      channels: this.channels.toJSON(),
      guild: this.guild
    };
  }

  private get available(): Role[] {
    const _ = [
      ["mafia", this.entry.mafiaLimit],
      ["villager", this.entry.villagerLimit],
      ["detective", this.entry.detectiveLimit],
      ["doctor", this.entry.doctorLimit]
    ];

    return this.sorted.reduce(
      (a: Role[], v: Player[] | Player, k: Role) =>
        Array.isArray(v)
          ? _.some(r => r[0] === k)
            ? v.length < _.find(r => r[0] === k)[1]
              ? a.concat([k])
              : a
            : a
          : !v
          ? a.concat([k])
          : a,
      []
    );
  }
}
