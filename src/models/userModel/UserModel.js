import UserSchema from "./UserSchema.js"

// user CRUD
//create user
export const createUser = (userData) => {
  return UserSchema(userData).save()
}

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email })
}

//get single user by user _id
export const getUserById = (_id) => {
  return UserSchema.findById(_id)
}
//get single user by filter, filter must be an objectw
export const getAnyUser = (filter) => {
  return UserSchema.findOne(filter)
}

// update user, @_id is string and @udpateData is an object
export const updateUserById = (_id, updateData) => {
  return UserSchema.findByIdAndUpdate(_id, updateData)
}

// delete user by _id.
export const deleteUserById = (_id) => {
  return UserSchema.findByIdAndDelete(_id)
}
