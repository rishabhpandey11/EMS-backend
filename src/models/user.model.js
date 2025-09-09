import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 5,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
    //       agar optimize tarike se serach karjna h to index true,  kardo ye mongodb ke liye accha hai , soch ke rakho
  },
  password: {
    type: String,
    required: [true, 'Password is required'],  //custom message de sakte ho 
    minlength: 8
  },
  avatar: {
    type: String, //cloudinary url
    required: true,
  },
  coverImage: {
    type: String, // cloudinary url
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    default: 'employee'
  },
  refreshToken: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false
  },

}, { timestamps: true })

// password save hone se pehle hash kardo, mongodb  middleware ki help se 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // agar modified ho tabhi hash karo ya save karo 

  this.password = await bcrypt.hash(this.password, 10)
  next()
})


// jab user save karein to confirm karein if user is valid
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


// refreshtoken baar baarrefresh hota rehta h isliye sirf id lete h ismain
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema)   //model ka naam users, plural m save hota hai db m 