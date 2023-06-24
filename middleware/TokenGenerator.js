const jwt = require("jsonwebtoken");

const jwt_accessToken = (id) =>{
try {
    const token = jwt.sign(
        { id },
        process.env.JWT_ACCESSSECRET,
        { expiresIn: "3600s" }
      );
      return token;
} catch (error) {
    return error;
}
}

const jwt_refreshToken = (id) =>{
  try {
      const token = jwt.sign(
          { id },
          process.env.JWT_REFRESHSECRET,
          { expiresIn: "1y" }
        );
        return token;
  } catch (error) {
      return error;
  }
  }

  module.exports = { jwt_accessToken, jwt_refreshToken }