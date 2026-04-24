import * as authService from "../services/authService.js";

export async function register(req, res) {
  const data = await authService.registerUser(req.body);
  res.status(201).json(data);
}

export async function login(req, res) {
  const data = await authService.loginUser(req.body);
  res.json(data);
}

export async function me(req, res) {
  const data = await authService.getCurrentUser(req.user.id);
  res.json(data);
}
