import bcrypt from 'bcryptjs'
import { mongoose } from 'mongoose'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'pending',
    },
    image: {
      type: String,
      default: 'https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg',
    },
    resetPin: {
      type: String, // Store the PIN as a string
      default: null // Default value is null until a PIN is generated
    },
    resetPinExpiration: {
      type: Date, // Store the expiration time as a Date
      default: null // Default value is null until a PIN is generated
    }
  },
  {
    timestamps: true,
  }
)

// hash user's password with salt before saving document to db
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// extend matchPassword function unto userSchema
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
