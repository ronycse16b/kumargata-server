import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // extract token from authHeader string
      token = authHeader.split(' ')[1]

      // verified token returns user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // find user's obj in db and assign to req.user
      req.user = await User.findById(decoded.id).select('-password');

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, invalid token')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token found')
  }
})

const superAdmin = asyncHandler(async (req, res, next) => {
  // Check if user is logged in and has superAdmin role
  if (req.user && req.user.role === 'superAdmin') {
    next(); // Allow access to the route if the user is a superAdmin
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized, only superAdmins allowed');
  }
});




export { protect,superAdmin }
