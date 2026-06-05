import * as userService from "../services/userService.js";

export async function getProfile(req, res) {
  const data = await userService.getUserProfile(req.user.id);
  res.json(data);
}

export async function updateProfile(req, res) {
  const data = await userService.updateUserProfile(req.user.id, req.body);
  res.json(data);
}

export async function getHistory(req, res) {
  const data = await userService.getUserHistory(req.user.id);
  res.json(data);
}
