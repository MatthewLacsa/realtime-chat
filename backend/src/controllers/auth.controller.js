 import { generateToken } from "../lib/utils.js"
 import User from "../models/user.models.js"
 import bcrypt from "bcryptjs"
 
 export const signup = async (req, res) => {
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
      } else {
        return res.status(400).json({ message: "ts invalid"});
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: "Internal Server Error"});

    }
 };

 export const login= async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({email})
      
      if(!user) {
        return res.status(400).json({message: "mannn invalid credentials :("});
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if(!isPasswordCorrect) {
        return res.status(400).json({message: "mannn invalid credentials :("});
      }

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
    res.send("logout route");
 };