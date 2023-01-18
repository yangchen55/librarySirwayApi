import express from "express";
import { getAllTransactions } from "../models/Transaction/TransactionModel.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const transaction = await getAllTransactions();
    return res.json(transaction);
  } catch (error) {
    next(error);
  }
});

export default router;
