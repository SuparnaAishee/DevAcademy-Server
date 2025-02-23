import { Model } from 'mongoose';
import { USER_ROLE } from '../constant/user.constant';

export interface TUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  address: string;
  role: 'admin' | 'user';
profilePhoto :string;
}
export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  // myStaticMethod():number;
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
