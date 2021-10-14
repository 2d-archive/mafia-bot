import { Provider } from 'discord-akairo';
import { Repository } from 'typeorm';
import { Guild } from './Guild';
import { Guild as DiscordGuild, Collection } from "discord.js"

export default class TypeORMProvider extends Provider {
  public ['constructor']: typeof TypeORMProvider;
  items: Collection<string, Guild>;

	public constructor(private readonly repo: Repository<Guild>) {
		super();
	}

	public async init() {
		const guilds = await this.repo.find();
		for (const guild of guilds) {
			this.items.set(guild.id, guild);
		}
	}

	public get<K extends keyof Guild, T = undefined>(
		guild: string | DiscordGuild,
		key: K,
		defaultValue?: T,
	): Guild[K] | T {
		const id = this.constructor.getGuildId(guild);
		if (this.items.has(id)) {
			const value = this.items.get(id)[key];
			return value === undefined ? defaultValue : value;
		}

		return defaultValue as T;
  }
  
  public async ensure(guild: string | DiscordGuild): Promise<Guild> {
    const id = this.constructor.getGuildId(guild)
    let data = this.items.get(id);
    if (!data) {
      data = new Guild(id);
      await data.save();
    }

    return data;
  }

  public async set<K extends keyof Guild>(
    guild: string | DiscordGuild, 
    key: K, value: Guild[K]
  ) {
		const id = this.constructor.getGuildId(guild);
		const data = await this.ensure(id);
		data[key] = value;
		this.items.set(id, data);

		return this.repo
			.createQueryBuilder()
			.insert()
			.into(Guild)
			.values({ id, ...data })
			.execute();
	}

	public async delete(guild: string | DiscordGuild, key: string) {
		const id = this.constructor.getGuildId(guild);
		const data = await this.ensure(id);
		delete data[key];

		return this.repo
			.createQueryBuilder()
			.insert()
			.into(Guild)
			.values({ id, ...data })
			.execute();
	}

	public async clear(guild: string | DiscordGuild) {
		const id = this.constructor.getGuildId(guild);
		this.items.delete(id);

		return this.repo.delete(id);
	}

	private static getGuildId(guild: string | DiscordGuild) {
		if (guild instanceof DiscordGuild) return guild.id;
		if (guild === 'global' || guild === null) return '0';
		if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
		throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
	}
}