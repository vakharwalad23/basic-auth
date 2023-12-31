const bcrypt = require("bcrypt");
const {
  jwt_accessToken,
  jwt_refreshToken,
} = require("../middleware/TokenGenerator.js");
const { verifyRefrshToken } = require("../middleware/VerifyToken.js");
const User = require("../model/Auth.js");
const OTP = require("../model/OTP.js");
const { Mailer } = require("../middleware/Mailer.js");

//Route 1 : For creating new user

const Signup = async (req, res) => {
  const { fname, lname, username, email, mobileno, password, confirmpassword } =
    req.body;
  try {
    const alreadyExsist = await User.findOne({ email });
    if (alreadyExsist)
      return res
        .status(400)
        .json({ message: "User with this mail already exsists." });
    if (password != confirmpassword)
      return res
        .status(400)
        .json({ message: "Both passwords are not matching." });
    const hashpass = await bcrypt.hash(password, 10);

    const response = await User.create({
      name: `${fname} ${lname}`,
      username,
      email,
      mobileno,
      password: hashpass,
    });

    const accessToken = jwt_accessToken(response._id);
    const refreshToken = jwt_refreshToken(response._id);
    req.session.user = {
      query: response.email,
      refreshToken,
      accessToken,
      isLoggedIn: true,
    };
    return res
      .status(200)
      .json({
        message: "User created Successfully",
        response,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong, Try again" });
  }
};

//Route 2 : For user signin

const Signin = async (req, res) => {
  try {
    const { query, password } = req.body;
    const user_exsist = await User.findOne().or([
      { email: query },
      { username: query },
    ]);
    if (!user_exsist)
      return res.status(400).json({ message: "User doesn't exsists." });
    const password_check = await bcrypt.compare(password, user_exsist.password);
    if (!password_check)
      return res.status(400).json({ message: "Wrong Credentials" });
    const accessToken = jwt_accessToken(user_exsist._id);
    const refreshToken = jwt_refreshToken(user_exsist._id);
    req.session.user = { query, refreshToken, accessToken, isLoggedIn: true };
    return res
      .status(200)
      .json({
        message: "User logged in Successfully",
        user_exsist,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong, Try again" });
  }
};
// Route Addon : Verifying and generating new access token and refresh token from old ones
const RefreshToken = async (req, res) => {
  try {
    const refToken = req.session.user.refreshToken;
    if (!refToken)
      return res
        .status(400)
        .json({ message: "Provide token or Please try after sometime" });
    const verifyToken = await verifyRefrshToken(refToken);
    console.log(verifyToken.id);
    const accessToken = jwt_accessToken(verifyToken.id);
    const refreshToken = jwt_refreshToken(verifyToken.id);
    req.session.user = { accessToken, refreshToken };

    return res
      .status(200)
      .json({
        message: "Token generated successfullt",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong, Try again" });
  }
};

//Route 3: Sending OTP to Forget Password
const ForgetPasswordOtp = async (req, res) => {
  try {
    const { query } = req.body;
    const user_exsist = await User.findOne().or([
      { email: query },
      { username: query },
    ]);
    if (!user_exsist)
      return res.status(400).json({ message: "User doesn't exsists." });
    const Otp = Math.floor(Math.random() * 900000) + 100000;
    const response = await OTP.create({
      Otp,
      query,
    });
    Mailer(user_exsist.email, Otp);
    return res.status(200).json({
      message: "User found Successfully and OTP sent",
      user_exsist,
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong, Try again" });
  }
};

//Route 4: Resetting the password

const ForgetPassword = async (req, res) => {
  try {
    const { Otp, password } = req.body;
    const response = await OTP.findOne({ Otp });
    if (!response)
      return res
        .status(400)
        .json({
          message: "Invalid OTP or OTP expired, Try Again after some time.",
        });
    const user = await User.findOne().or([
      { email: response.query },
      { username: response.query },
    ]);
    bcrypt.hash(password, 10).then((hash) => {
      user.password = hash;
      user.save();
    });
    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong, Try again" });
  }
};

//ROUTE 5: Reset Password

const ResetPassword = async (req, res) => {
  try {
    if (
      req.session?.user?.isLoggedIn === false ||
      req.session?.user?.isLoggedIn === undefined
    )
      return res.status(400).json({ message: "Please Signin First" });
    const { password, newPassword } = req.body;
    const user = await User.findOne().or([
      { email: req.session.user.query },
      { username: req.session.user.query },
    ]);
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.status(400).json({ message: "Wrong Password" });
    bcrypt.hash(newPassword, 10).then((hash) => {
      user.password = hash;
      user.save();
    });
    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong, Try again" });
  }
};

//Route 6: LOGOUT

const Logout = (req, res) => {
  try {
    req.session.destroy();
    return res.status(200).json({ message: "Session Destroyed Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong, Try again" });
  }
};

module.exports = {
  Signup,
  Signin,
  RefreshToken,
  ForgetPasswordOtp,
  ForgetPassword,
  ResetPassword,
  Logout,
};
