import { TUser } from "../interface/user.interface";
import { User } from "../models/user.model";


const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);

  return result;
};
const getUserByEmail = async (email: string) => {
  const result = await User.findOne({ email: email });
  return result;
};
export const UserServices = {
  createUserIntoDB,getUserByEmail
};
