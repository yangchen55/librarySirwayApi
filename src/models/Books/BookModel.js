import BookSchema from "./BookSchema.js";

export const getBookByIsbn = (isbn) => {
  return BookSchema.findOne({ isbn });
};

export const addBook = (bookInfo) => {
  return BookSchema(bookInfo).save();
};

export const getAllBooks = () => {
  return BookSchema.find();
};

export const getBookById = (_id) => {
  return BookSchema.findById(_id);
};
// new true provide latest update
export const findByBookAndUpdate = (_id, obj) => {
  return BookSchema.findByIdAndUpdate(_id, obj, { new: true });
};

export const deleteBook = (_id) => {
  return BookSchema.findByIdAndDelete(_id);
};

export const getBorrowedBooks = (userId) => {
  return BookSchema.find({ borrowedBy: { $in: [userid] } });
};
