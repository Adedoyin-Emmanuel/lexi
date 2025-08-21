import { Request, Response } from "express";

import { response } from "./../../utils";
import { userRepository } from "./../../models/repositories";
import { onboardUserSchema, updateUserDetailsSchema } from "./user.dto";
export default class UserController {
  static async onboardUser(req: Request, res: Response) {
    const values = await onboardUserSchema.validateAsync(req.body);

    const currentUser = req.user;

    const user = await userRepository.findById(currentUser.userId as string);

    if (!user) {
      return response(res, 404, "User not found");
    }

    if (user.isOnboarded) {
      return response(res, 400, "Chief, you've been onboarded already");
    }

    const { displayName, userType, specialities } = values;

    user.isOnboarded = true;
    user.userType = userType;
    user.displayName = displayName;
    user.specialities = specialities;

    await userRepository.update(user._id, user);

    return response(res, 200, "Onboarding successful");
  }

  static async updateUserDetails(req: Request, res: Response) {
    const values = await updateUserDetailsSchema.validateAsync(req.body);

    const currentUser = req.user;

    const user = await userRepository.findById(currentUser.userId as string);

    if (!user) {
      return response(res, 404, "User not found");
    }

    if (!user.isOnboarded) {
      return response(res, 400, "Chief, you've not been onboarded yet");
    }

    const { displayName, userType, specialities } = values;

    user.userType = userType;
    user.displayName = displayName;
    user.specialities = specialities;

    await userRepository.update(user._id, user);

    return response(res, 200, "User details updated successfully");
  }

  static async getMe(req: Request, res: Response) {
    const currentUser = req.user;

    const user = await userRepository.findById(currentUser.userId.toString());

    if (!user) {
      return response(res, 404, "User not found");
    }

    const userDetails = {
      name: user.name,
      avatar: user.avatar,
      displayName: user.displayName,
      hasOnboarded: user.isOnboarded,
    };

    return response(res, 200, "User details fetched successfully", userDetails);
  }
}
