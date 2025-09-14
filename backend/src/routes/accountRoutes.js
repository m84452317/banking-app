import express from "express";
import {
  createAccount,
  getAccounts,
  deposit,
  withdraw,
  transfer,
} from "../controllers/accountController.js";
import { authMiddleware } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/", authMiddleware, createAccount);
router.get("/", authMiddleware, getAccounts);
router.post("/transfer", authMiddleware, transfer);       
router.post("/:id/deposit", authMiddleware, deposit);    
router.post("/:id/withdraw", authMiddleware, withdraw);  

export default router;