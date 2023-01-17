import express from "express";
import { ERROR, SUCCESS } from "../constant.js";
import {
  getBookByIsbn,
  addBook,
  getAllBooks,
  getBookById,
  findByBookAndUpdate,
  deleteBook,
  getBorrowedBooks,
} from "../models/Books/BookModel.js";
import { getUserById } from "../models/userModel/UserModel.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const books = await getAllBooks();
    console.log(books);
    if (books) {
      return res.json({ books });
    }
    return;
  } catch (error) {
    next(error);
  }
});

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
    // console.log(book);

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

// borrow a book
router.post("/borrow", async (req, res, next) => {
  try {
    const bookId = req.body.bookId;
    const { authorization } = req.headers;

    const book = await getBookById(bookId);
    const user = await getUserById(authorization);
    if (book?._id && user?._id) {
      if (book?.borrowedBy.length) {
        return res.json({
          status: "error",
          message:
            "this book has been borrowes and willl be availanle it has been ",
        });
      }
      const updateBook = await findByBookAndUpdate(bookId, {
        $push: { borrowedBy: user._id },
      });
      return updateBook?._id
        ? res.json({
            status: "success",
            message: "you have borrowed this",
          })
        : res.json({
            status: "error",
            message: "please try again",
          });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const del = await deleteBook(req.body.bookId);
    del?._id
      ? res.json({
          status: "success",
          message: "book deleted successfully",
        })
      : res.json({
          status: "error",
          message: "unable to delete book",
        });
  } catch (error) {
    next(error);
  }
});

// get boorrowed by specific user
router.get("/borrowedBooks", async (req, res, next) => {
  try {
    const books = await getBorrowedBooks(req.headers.userId);
    return books;
  } catch (error) {}
});

router.patch("/return", async (req, res, next) => {
  try {
    const book = await getBookById(req.body.bookId);
    const user = await getUserById(req.headers.authorization);
    if (book?._id && user?._id) {
      const updateBook = await findByBookAndUpdate(book._id, {
        $pull: { borrowedBy: user._id },
      });
      return updateBook?._id
        ? res.json({
            status: "success",
            message: "you have returned this book",
          })
        : res.json({
            status: "success",
            message: "unable to retun",
          });
    }
  } catch (error) {
    next(error);
  }
});
export default router;
