import express from "express";
import { ERROR, SUCCESS } from "../constant.js";
import { getBookByIsbn, addBook } from "../models/Books/BookModel.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { isbn } = req.body;
  try {
    const bookExists = await getBookByIsbn(isbn);
    if (bookExists?._id) {
      return res.json({
        status: Error,
        message: "book alreafy exist!",
      });
    }

    const book = await addBook(req.body);
    console.log(book);

    return book?._id
      ? res.json({
          status: SUCCESS,
          message: "book added successfully",
        })
      : res.json({
          status: ERROR,
          message: "unable to add",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
