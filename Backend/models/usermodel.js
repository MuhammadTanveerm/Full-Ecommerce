const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bycrpt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please Enter User Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more then 4 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please Enter Your E-Mail"],
      validate: [validator.isEmail, "Please enter valid e-mail "],
    },
    password: {
      type: String,
      required: [true, "Please Enter the Password"],
      mixLenght: [8, "Password should  be greater then 8 characters"],
      select: false,
    },
  
    avtar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
  
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  });
  // Hash Password
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bycrpt.hash(this.password, 10);
  });
// JWT Token
userSchema.methods.getjwtToken = function (){
  return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE,
  });
};
//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bycrpt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding resetPasswordToekn to userschme
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire= Date.now() + 15 * 60 *1000;
    return resetToken
};
  module.exports = mongoose.model("user", userSchema);