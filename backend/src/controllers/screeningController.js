import * as screeningService from "../services/screeningService.js";

export async function start(req, res) {
  const data = await screeningService.startScreening(req.user);
  res.status(201).json(data);
}

export async function answer(req, res) {
  const data = await screeningService.answerScreening(req.user.id, req.body);
  res.json(data);
}

export async function submit(req, res) {
  const data = await screeningService.submitScreening(req.user.id, req.body);
  res.json(data);
}

export async function getScreenings(req, res) {
  const data = await screeningService.getUserScreenings(req.user.id);
  res.json(data);
}

export async function getScreeningById(req, res) {
  const data = await screeningService.getScreeningById(req.user, req.params.id);
  res.json(data);
}
