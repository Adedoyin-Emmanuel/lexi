import { User } from "../../../models/user";
import { IRepository } from "../base/i-repository";

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
}
