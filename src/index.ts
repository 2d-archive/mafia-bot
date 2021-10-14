import "reflect-metadata";
import { config } from "dotenv";
import MafiaClient from "./structures/Client";
import { join } from "path";
import { MessageEmbed } from "discord.js";

config({ path: join(process.cwd(), ".env") });
const mafia = new MafiaClient(process.env.TOKEN, {});

export const Embed = (_: string) => new MessageEmbed()
  .setAuthor(mafia.user.tag, mafia.user.avatarURL()).setDescription(_)
  .setColor("BLUE").setFooter("Mafia-Bot by MeLike2D").setTimestamp(new Date());

mafia.login();