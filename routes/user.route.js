import express from 'express'
import { protect, superAdmin } from '../middleware/authMiddleware.js'
import * as userController from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const router = express.Router()

router.post('/register', userController.registerUser)
router.post('/reset-password', userController.passwordReset)
router.post('/request-password', userController.requestPasswordReset)
router.post('/login', userController.loginUser)
router.put('/update/:id', protect, userController.userUpdateRole)
router.put('/profile-update', protect,  userController.userProfileUpdate)
router.put('/avatar', protect, upload.single('avatar'),userController.updateUserAvatar)
router.delete('/delete/:id', userController.userDelete)
router.route('/profile').get(protect, userController.getUserProfile)
// router.route('/all-users').get(protect,superAdmin, userController.getAllUsers)
router.route('/all-users').get(protect, userController.getAllUsers);



export default router
