/** @format */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as Interfaces from "../interfaces";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: { type: String, lowercase: true, trim: true },
    password: {
      type: String,
      set: function (value: string) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        return hashedPassword;
      },
    },
    salt: { type: String },
    role: { type: String, enum: ["USER", "ADMIN", "EXPERT"], default: "USER" },
    tokens: [
      {
        token: { type: String },
        expires: { type: Date },
        type: { type: String },
        blacklisted: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ["archived", "active", "inactive"],
      default: "active",
    },

    date_created: { type: Date, default: Date.now },
    date_created_utc: { type: Date },
    date_modified: { type: Date },
    date_modified_utc: { type: Date },
    meta_data: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

export const User: any = mongoose.model("User", userSchema);

User.prototype.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};
// User Actions

export const getUserByEmail = (email: string) =>
  User.findOne({
    email: email,
    role: "USER",
    status: { $ne: "archived" },
  }).lean();
export const getUserByToken = (token: string, currentDate: any) =>
  User.findOne({
    "tokens.token": token,
    "tokens.expires": { $gt: new Date(currentDate) },
  });
export const getUserById = (userId: string) =>
  User.findOne({
    _id: userId,
    role: "USER",
    status: "active",
  }).select(["name", "email", "tokens"]);

export const deleteUserById = (id: string) =>
  User.findOneAndDelete({ _id: id });
export const updateUserById = (
  userId: string,
  updateBody: Record<string, any>,
) => User.findOneAndUpdate({ _id: userId }, updateBody, { new: true });
export const updateUserByEmail = (
  email: string,
  updateBody: Record<string, any>,
) =>
  User.findOneAndUpdate({ email: email }, updateBody, {
    new: true,
    select: "name email tokens status",
  });

export const createUser = (data: Interfaces.SignupUser) => User.create(data);
