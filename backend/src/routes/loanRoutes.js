import express from "express";
import {
  applyForLoan,
  getMyLoans,
  getLoanDetails,
  updateLoanStatus,
  getRepaymentSchedule,
} from "../controllers/loanController.js";
import {authMiddleware} from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyForLoan);
router.get("/myloans", authMiddleware, getMyLoans); // Corrected endpoint for security
router.get("/:id", authMiddleware, getLoanDetails);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateLoanStatus);
router.get("/:id/repayments", authMiddleware, getRepaymentSchedule);

export default router;