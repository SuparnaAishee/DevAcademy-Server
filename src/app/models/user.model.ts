import { Schema, model } from 'mongoose';


import bycrypt from 'bcrypt';
import config from '../config';
import { TUser, UserModel } from '../interface/user.interface';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      requred: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
   
   profilePhoto: {
      type: String,
      
      
    },
   
  },
  { versionKey: false },
);

//pre-hook
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bycrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email });
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bycrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
