import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // check if email exists in db
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }
  // create new user document in db
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("User not found");
  }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        userToken: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error("Users not found");
  }
});

const userUpdateRole = async (req, res) => {
  const role = req.body.data;
  const user = await User.findByIdAndUpdate(
    req?.params.id,
    { role: role },
    { new: true }
  ).select("-password");

  try {
    if (user) {
      res.status(200).json({
        massage: "Role Updated Successfully",
        user,
      });
    } else {
      res.status(404);
      throw new Error("User update failed");
    }
  } catch (error) {
    console.log(error);
  }
};

const userProfileUpdate = async (req, res) => {
  const { email } = req.query;
  const { name, old_password, new_password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await user.matchPassword(old_password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Update user's name and password
    user.name = name;
    user.password = new_password;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // You may choose to exclude other sensitive fields here
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarBuffer = req.file?.buffer; // Access file buffer directly

  if (!avatarBuffer) {
    throw new Error(400, "Avatar file is missing");
  }

  // Fetch the user to get the old image URL
  const user = await User.findById(req.user?._id).select("image");

  if (user.image) {
    await deleteFromCloudinary(user?.image);
  }

  const avatarUrl = await uploadOnCloudinary(avatarBuffer); // Await for the upload operation


  if (!avatarUrl) {
    throw new Error(400, "Error while uploading avatar");
  }
  const userFind = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        image: avatarUrl,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json({
    user: userFind,
    message: "Avatar updated successfully",
  });
});

const userDelete = asyncHandler(async (req, res) => {
 
  const user = await User.findByIdAndDelete(req?.params.id);

  if (user) {
    res.status(200).json({ message: "Data Deleted Successfully" });
  } else {
    res.status(404);
    throw new Error("User Delete failed");
  }
});


const passwordReset = asyncHandler(async (req, res) => {
  const { email, pin, password } = req.query;

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("user not found");
  }

  // Verify the PIN and check if it has expired
  if (pin !== user.resetPin || Date.now() > user.resetPinExpiration) {
    throw new Error("Invalid or expired PIN");
  }

  // Update the user's password
  user.password = password;
  // Reset the PIN and its expiration time
  user.resetPin = null;
  user.resetPinExpiration = null;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});



const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("user not found");
  }
  // Generate a random PIN
  const randomNumber = Math.floor(Math.random() * 10000);
  const pin = randomNumber.toString().padStart(4, "0"); // Ensure it's 4 digits long

  // Set PIN expiration time (e.g., 4 hours from now)
  const expirationTime = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours in milliseconds

  // Update user's resetPin and resetPinExpiration fields
  user.resetPin = pin;
  user.resetPinExpiration = expirationTime;
  await user.save();

  const mailSubject = "PASSWORD RESET BY SMART UNION";

  // Send email with PIN
  const response = await sendEmail({
    email: user.email,
    subject: mailSubject,
    html: `
      Dear User,
      You recently requested to reset your password. Your verification code is: ${pin}.
      If you did not request this change, please ignore this message.
      Best regards,
      Smart Union web
    `,
  });

  // Handle response
  const result = await response;
  res.status(200).json(result);
});

export {
  registerUser,
  passwordReset,
  loginUser,
  getUserProfile,
  getAllUsers,
  userUpdateRole,
  userDelete,
  userProfileUpdate,
  updateUserAvatar,
  requestPasswordReset,
};
