import e from "express";
import jwt from "jsonwebtoken";
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized access", success: false });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if(!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token", success: false });
    }   
    req.id = decoded.userId;
    next();
  } catch (error) {
     return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
      error: error.message,
    });
  }
}
export default isAuthenticated;
