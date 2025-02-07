"use server";

import {
  deleteUserData,
  forgotUserPassword,
  register,
  resetUserPassword,
  updateUserData,
  updateUserPassword,
  updateUserProfile,
} from "@/backend/controllers/auth.controller";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  return await register(name, email, password);
}

export async function updateProfile({
  name,
  email,
  avatar,
  oldAvatar,
}: {
  name: string;
  email: string;
  avatar?: string;
  oldAvatar?: string;
}) {
  return await updateUserProfile({ name, userEmail: email, avatar, oldAvatar });
}

export async function updatePassword({
  newPassword,
  confirmPassword,
  userEmail,
}: {
  newPassword: string;
  confirmPassword: string;
  userEmail: string;
}) {
  return await updateUserPassword({ newPassword, confirmPassword, userEmail });
}

export async function forgotPassword(email: string) {
  return await forgotUserPassword(email);
}

export async function resetPassword(
  token: string,
  password: string,
  confirmPassword: string
) {
  return await resetUserPassword(token, password, confirmPassword);
}

export async function updateUser(
  userId: string,
  userData: {
    name: string;
    roles: string[];
  }
) {
  return await updateUserData(userId, userData);
}

export async function deleteUser(userId: string) {
  return await deleteUserData(userId);
}
