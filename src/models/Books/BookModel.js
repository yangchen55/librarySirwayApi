import BookSchema from "./BookSchema.js";

export const getBookByIsbn = (isbn) => {
  return BookSchema.findOne({ isbn });
};

export const addBook = (bookInfo) => {
  return BookSchema(bookInfo).save();
};
