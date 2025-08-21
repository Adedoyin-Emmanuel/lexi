import { User, UserModel } from "../../user";
import { Repository } from "../base/repository";
import { IUserRepository } from "./i-user-repository";

class UserRepository extends Repository<User> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({
      email,
    }).exec();
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return UserModel.findOne({
      googleId,
    }).exec();
  }
}

const userRepository = new UserRepository();

export default userRepository;
