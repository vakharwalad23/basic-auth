const authroute = require('express').Router();
const { Signup, Signin, RefreshToken, ForgetPasswordOtp, ForgetPassword, ResetPassword, Logout } = require('../controllers/Auth.js');

authroute.post('/signup', Signup);
authroute.post('/signin', Signin);
authroute.post('/refreshtoken', RefreshToken);
authroute.post('/otpsend', ForgetPasswordOtp);
authroute.post('/forgetpassword', ForgetPassword);
authroute.post('/resetpassword', ResetPassword);
authroute.get('/logout', Logout);

module.exports = authroute;