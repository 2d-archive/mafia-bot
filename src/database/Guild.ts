import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { TextChannel } from "discord.js";

@Entity('guilds')
export class Guild extends BaseEntity {
  @PrimaryColumn("text", { unique: true })
  public id: string;
  
  @Column() daytime: string = "";
  @Column() detective: string = "";
  @Column() doctor: string = "";
  @Column() mafia: string = "";

  @Column() detectiveLimit: number = 1;
  @Column() doctorLimit: number = 1;
  @Column() mafiaLimit: number = 2;
  @Column() villagerLimit: number = 3;

  @Column() playerRole: string = "";
  @Column() moderatorRole: string = "";

  public constructor(id: string) {
    super();

    this.id = id;
  }
  
  public get configured(): boolean {
    for (const key in this.channels)
      if (this.channels[key] === undefined) return false;
    if (!this.playerRole || !this.moderatorRole) return false;

    return true;
  }

  public setChannels(channels: { [x: string]: TextChannel }): Promise<this> {
    Object.keys(channels).forEach((k) => this[k] = channels[k].id);
    return this.save({ reload: true });
  }

  public get channels() {
    return {
      daytime: this.daytime,
      detective: this.detective,
      doctor: this.doctor,
      mafia: this.mafia
    }
  }
}