import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
    try {
      //check for token sent by cookies
      const token = req.cookies.jwt;
      if(!token) {
        return res.status(401).json({ message: "Unauthorized - No Token Provided"});
      }
      //verify with env secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if(!decoded) {
        return res.status(401).json({ message: "Unauthorized - Token is Invalid"});
      }
      //returned decoded is the user, get user id and select the info except password
      const user = await User.findById(decoded.userId).select("-password");

      if(!user) {
        return res.status(404).json({ message: "User Not Found"});
      }
      
      req.user = user

      next()

    } catch(error) {
      console.log("Error in protectRoute middleware: ", error.message);
      res.status(500).json({ message: "Internal server error"});
    }
}