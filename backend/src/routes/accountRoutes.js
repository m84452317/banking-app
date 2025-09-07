import express from "express";
import {
  createAccount,
  getAccounts,
  deposit,
} from "../controllers/accountController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createAccount);
router.get("/", authMiddleware, getAccounts);
router.post("/:id/deposit", authMiddleware, deposit);

export default router;