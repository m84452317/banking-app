import Loan from "../models/Loan.js";
import Repayment from "../models/Repayment.js";
import User from "../models/User.js"; // Import the User model

// @route POST /api/loans
// @desc User applies for a new loan
// @access Private (User only)
export const applyForLoan = async (req, res) => {
  try {
    const { loanType, amount, tenureMonths, interestRate } = req.body;
    const loan = await Loan.create({
      userId: req.user.userId, // Use userId from JWT token
      loanType,
      amount,
      tenureMonths,
      interestRate,
    });
    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @route GET /api/loans/user
// @desc Get all loans for the authenticated user
// @access Private (User only)
export const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.userId });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route GET /api/loans/:id
// @desc Get details of a single loan
// @access Private (Owner only)
export const getLoanDetails = async (req, res) => {
  try {
    // Find loan by ID AND userId to ensure ownership
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found or you do not have access." });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route PATCH /api/loans/:id/status
// @desc Admin updates loan status (approve/reject/close)
// @access Private (Admin only)
export const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loan = await Loan.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }
    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @route GET /api/loans/:id/repayments
// @desc Get repayment schedule for a loan
// @access Private (Owner only)
export const getRepaymentSchedule = async (req, res) => {
  try {
    // Find loan by ID and userId to ensure ownership before fetching repayments
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found or you do not have access." });
    }
    const repayments = await Repayment.find({ loanId: req.params.id });
    res.json(repayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};