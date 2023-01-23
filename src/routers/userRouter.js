import express from "express";
import { ERROR, SUCCESS } from "../constant.js";
import { comparePassword, hashPassword } from "../helpers/BrcyptHelper.js";
const router = express.Router();
import {
  createUser,
  getAnyUser,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../models/userModel/UserModel.js";

router.get("/", (req, res, next) => {
  try {
    res.json({
      status: SUCCESS,
      message: "todo get user",
    });
  } catch (error) {
    next(error);
  }
});

// create new user
router.post("/", async (req, res, next) => {
  // try {
  //   const result = await createUser(req.body)

  //   result?._id
  //     ? res.json({
  //         status: SUCCESS,
  //         message: "User has been created successfully, You may login now",
  //       })
  //     : res.json({
  //         status: ERROR,
  //         message: "User has been created successfully, You may login now",
  //       })
  // } catch (error) {
  //   if (error.message.includes("E11000 duplicate key")) {
  //     error.message = "There is another user exist with this email"
  //     error.errorCode = 200
  //   }

  //   next(error)
  // }

  try {
    const { email } = req.body;

    const userExists = await getUserByEmail(email);
    if (userExists) {
      return res.json({
        status: "error",
        message: "User already exists. Please log in!",
      });
    }

    // hash password
    const hashPass = hashPassword(req.body.password);

    if (hashPass) {
      req.body.password = hashPass;
      const result = await createUser(req.body);

      if (result?._id) {
        return res.json({
          status: SUCCESS,
          message: "User has been created successfully. You may now log in!",
        });
      }
      return res.json({
        status: ERROR,
        message: "User not created. Please try again later!",
      });
    }
  } catch (error) {
    next(error);
  }
});

// login user
router.post("/login", async (req, res, next) => {
  // try {
  //   const { email, password } = req.body
  //   const user = await getAnyUser({ email })

  //   if (user?._id) {
  //     if (user.password !== password) {
  //       return res.json({
  //         status: ERROR,
  //         message: "Inavalid Login Details",
  //       })
  //     }
  //     user.password = undefined
  //     return res.json({ status: "success", message: "Login Successful!", user })
  //   }

  //   res.json({ status: "error", message: "User not found!" })
  // } catch (error) {
  //   next(error)
  // }

  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    if (user?._id) {
      // Check if password is valid
      const isPassMatch = comparePassword(req.body.password, user.password);
      if (isPassMatch) {
        user.password = undefined;
        return res.json({
          status: SUCCESS,
          message: "Login successful",
          user,
        });
      }
      res.json({
        status: ERROR,
        message: "Invalid password",
      });
    } else {
      res.json({
        status: ERROR,
        message: "User not found!",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/password-update", async (req, res, next) => {
  try {
    const user = await getUserById(req.headers.authorization);
    const { currentPassword } = req.body;
    const passMatched = comparePassword(currentPassword, user?.password);
    console.log(passMatched);
    if (passMatched) {
      const hashedPass = hashPassword(req.body.password);
      if (hashedPass) {
        const updatedPassword = await updateUserById(user._id, {
          password: hashedPass,
        });
        if (updatedPassword?._id) {
          return res.json({
            status: "success",
            message: "password updated successfuly",
          });
        }
        return res.json({
          status: "error",
          message: "unable to update password",
        });
      }
    }
    return res.json({
      status: "error",
      message: "please enter correct password",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
