import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API Abstrax está funcionando!" });
});

export default router;
