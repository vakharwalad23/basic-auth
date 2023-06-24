const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  if(!req.session.user.accessToken)
    return res.status(401).json({ message: "Unauthrized access" });
    const authHeader = req.session.user.accessToken;
    console.log(authHeader);
    jwt.verify(authHeader, process.env.JWT_ACCESSSECRET, (error, payload)=> {
      if(error)
      return res.status(500).json({ message: "Something went on try again later" });
      req.payload = payload;
      next();
    })
};
const verifyRefrshToken = async (token) => {
  try {
    return await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_REFRESHSECRET, (error, payload) => {
        if (error) {
          reject(error);
        } else {
          const userId = payload;
          console.log(userId);
          resolve(userId);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyAccessToken, verifyRefrshToken };
