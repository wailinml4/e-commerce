import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUserDocument } from '../types/index.js'

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>
}

interface UserModel extends mongoose.Model<IUserDocument>, IUserMethods {}

const userSchema = new Schema<IUserDocument, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'] as const,
      default: 'customer',
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model<IUserDocument, UserModel>('User', userSchema)

export default User
export { IUserDocument }
