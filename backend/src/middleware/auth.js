import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // console.log("authMiddleware called for url:", req.url, "headers:", req.headers);
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token) {
    console.log('inside if (token) of auth.js' + token);
    
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  if (next) {
    next();
  }
};