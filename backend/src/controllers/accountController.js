import {Account} from "../models/Account.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

// Joi schema for input validation
const accountCreationSchema = Joi.object({
  type: Joi.string().valid("savings", "current").required(),
});

const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

// @route POST /api/accounts
// @desc Create a new account for the authenticated user
// @access Private
export const createAccount = async (req, res) => {
  try {
    const { error } = accountCreationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "Authenticated user not found." });
    }

    const newAccount = new Account({
      ...req.body,
      userId: req.user.userId,
      accountNumber: uuidv4(),
    });

    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ error: "Failed to create account: " + err.message });
  }
};

// @route GET /api/accounts
// @desc Get all accounts for the authenticated user
// @access Private
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.userId });
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accounts: " + err.message });
  }
};

// @route POST /api/accounts/:id/deposit
// @desc Deposit funds into an account
// @access Private (Owner only)
export const deposit = async (req, res) => {
  try {
    const { error } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    if (account.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this account." });
    }

    account.balance += req.body.amount;
    account.transactions.push({
      txnId: uuidv4(),
      type: "deposit",
      amount: req.body.amount,
    });
    await account.save();

    res.status(200).json({ message: "Deposit successful.", account });
  } catch (err) {
    res.status(500).json({ error: "Failed to process deposit: " + err.message });
  }
};