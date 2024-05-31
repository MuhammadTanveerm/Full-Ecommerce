const User = require("../models/usermodel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require('../utils/jwtToken')
const catchAsyncError = require("../middleware/catchAsyncError");
const sendEmail = require('../utils/sendEmail.js')
const crypto = require('crypto')
exports.createUser= catchAsyncError(async (req, res, next) =>{
const {name , email, password} = req.body

const user = await User.create({
    name, email, password ,
    avtar:{
        public_id :"no pulib s",
        url:"no ulr"
    },
});
// User Token

sendToken(user , 201, res)
});
/// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // checking if user has given password and email both
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    // const token = user.getjwtToken();
    // res.status(200).json({
    //     success:true,
    //     token
    // })
   sendToken(user , 200, res)
  });


  // Logout User
  exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });

  exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    // console.log(`tokenis ${resetToken}`)
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
// console.log(` url is ${resetPasswordUrl}`)
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  // console.log(`messsage is : ${message}`)
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandler(error.message, 500));
    }
  }); 

  ///*resepassword/ updating the password */
  exports.resetPassword= catchAsyncError(async(req, res , next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
  
  })


  // userDetails

  exports.userDetail = catchAsyncError(async (req,res, next) => {
    const user = await User.findById(req.user.id)
res.status(200).json({
  success:true,
  user

})
  })


  // update user Password
  exports.updateUserPasswords = catchAsyncError(async (req,res, next) => {
    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatched =  await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
      return next (new ErrorHandler('oldPassword in invalid or incorrect ', 400))
    }
res.status(200).json({
  success:true,
  user

})
  })