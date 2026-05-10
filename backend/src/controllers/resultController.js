import * as resultService from "../services/resultService.js";

// GET - Ambil semua hasil screening
export async function getAllResults(req, res) {
  const data = await resultService.getAllResults();
  res.json({
    success: true,
    data,
    message: "Data hasil screening berhasil diambil",
  });
}

// GET - Ambil hasil screening by ID
export async function getResultById(req, res) {
  const { id } = req.params;
  const data = await resultService.getResultById(id);
  res.json({
    success: true,
    data,
    message: "Data hasil screening berhasil diambil",
  });
}

// POST - Buat hasil screening baru
export async function createResult(req, res) {
  const data = await resultService.createResult(req.body);
  res.status(201).json({
    success: true,
    data,
    message: "Data hasil screening berhasil dibuat",
  });
}
