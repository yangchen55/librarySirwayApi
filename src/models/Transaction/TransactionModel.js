import TransactionSchema from "./TransactionSchema.js";

export const postTransaction = (obj) => {
  return TransactionSchema(obj).save();
};

export const getAllTransactions = () => {
  return TransactionSchema.find();
};

export const getAllTransactionsByQuery = (userId, isbn) => {
  return TransactionSchema.findOne({
    "borrowedBy.userId": { $in: userId },
    "borrowedBook.isbn": { $in: isbn },
  });
};

export const findTransactionAndUpdate = (_id, obj) => {
  return TransactionSchema.findByIdAndUpdate(_id, obj, { new: true });
};
