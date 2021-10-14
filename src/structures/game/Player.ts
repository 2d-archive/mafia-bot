import { Game, Role } from "./Game";

export class Player {
  public killed: boolean = false;
  public savedself: boolean = false;
  public killedon: number;

  public constructor(public game: Game, public id: string, public role: Role) {}

  public toJSON() {
    return {
      killed: this.killed,
      killedon: this.killedon,
      id: this.id,
      role: this.role
    };
  }
}
