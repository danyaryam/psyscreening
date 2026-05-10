import * as adminService from "../services/adminService.js";

export async function getUsers(req, res) {
  const data = await adminService.getAdminUsers(req.user.id);
  res.json(data);
}

export async function getUserById(req, res) {
  const data = await adminService.getAdminUserById(req.params.id);
  res.json(data);
}

export async function getScreenings(req, res) {
  const data = await adminService.getAdminScreenings(req.user.id);
  res.json(data);
}

export async function getStats(req, res) {
  const data = await adminService.getAdminStats(req.user.id);
  res.json(data);
}

export async function getQuestions(req, res) {
  const data = await adminService.getAdminQuestions();
  res.json(data);
}

export async function createQuestion(req, res) {
  const data = await adminService.createAdminQuestion(req.user.id, req.body);
  res.status(201).json(data);
}

export async function updateQuestion(req, res) {
  const data = await adminService.updateAdminQuestion(
    req.user.id,
    req.params.id,
    req.body,
  );
  res.json(data);
}

export async function deleteQuestion(req, res) {
  const data = await adminService.deleteAdminQuestion(req.user.id, req.params.id);
  res.json(data);
}
