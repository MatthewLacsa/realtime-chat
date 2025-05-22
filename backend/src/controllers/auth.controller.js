 import { generateToken } from "../lib/utils.js"
 import User from "../models/user.models.js"
 import bcrypt from "bcryptjs"
 import cloudinary from "../lib/cloudinary.js";
 export const signup = async (req, res) => {
    //form validation from information gathered at signup
    const{fullName, email, password} = req.body
    try {
      if(!fullName || !email || !password) {
        return res.status(400).json({message: "ts so james u gotta fill in all fields"});
      }
      //hashing password
      if (password.length < 6) {
        return res.status(400).json({message: "gurt: nah it posed to be 6 letters sybau"});
      }

      const user = await User.findOne({email});

      if (user) return res.status(400).json({ message: "ts email exsts </3"});
      //generating a salt for the received password, then hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullName,
        email,
        password: hashedPassword
      });

      if(newUser) {
        //generate the jwt token
        generateToken(newUser._id, res)
        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else { //if already made
        return res.status(400).json({ message: "ts invalid"});
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: "Internal Server Error"});

    }
 };

 export const login = async (req, res) => {
    const { email, password } = req.body;
    //find email then check for password by comparing email pass to given
    try {
      const user = await User.findOne({email})
      
      if(!user) {
        return res.status(400).json({message: "mannn invalid email :("});
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if(!isPasswordCorrect) {
        return res.status(400).json({message: "mannn invalid credentials :("});
      }
      //generate another token for the user
      generateToken(user._id, res);

      res.status(200).json({
       _id: user._id,
       fullName: user.fullName,
       email: user.email,
       profilePic: user.profilePic,

      })
    } catch(error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({ message: "Internal Server Error"});
    }
 };
 
 export const logout = (req, res) => {
    try {
      //clear the jwt stored
      res.cookie("jwt", "", {maxAge: 0 })
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal server error"});
    }
 };

 export const updateProfile = async(req, res) => {
  try {
    const {profilePic} = req.body;
    //take userId from protectRoute
    const userId = req.user._id;

    if(!profilePic) {
      return res.status(400).json({ message: "Profile picture is required"});
    }
    //send to cloudinary, bucket for images
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    //new true means it immediately changes the user picture
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})

    res.status(200).json(updatedUser)
  } catch(error) {
    console.log("Error in updating the profile: ", error);
    res.status(500).json({ message: "Internal server error"});
  }
 };
 //if protectRoute is successful get the user
 export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in each checkAuth controller ", error.message);
    res.status(500).json({ message: "Internal Server Error"});
  }
 }