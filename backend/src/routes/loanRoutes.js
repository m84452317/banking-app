import express from "express";
import {
  applyForLoan,
  getMyLoans,
  getLoanDetails,
  updateLoanStatus,
  getRepaymentSchedule,
  payLoanInstallment,
  getAllPendingLoans
} from "../controllers/loanController.js";
import {authMiddleware} from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

console.log('inside loan routes...');

const router = express.Router();

router.post("/apply", authMiddleware, applyForLoan);
router.get("/myloans", authMiddleware, getMyLoans);
router.get("/pending", authMiddleware, adminMiddleware, getAllPendingLoans);

router.get("/:id/repayments", authMiddleware, getRepaymentSchedule);
router.post("/:id/pay", authMiddleware, payLoanInstallment);
router.get("/:id", authMiddleware, getLoanDetails);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateLoanStatus);




export default router;