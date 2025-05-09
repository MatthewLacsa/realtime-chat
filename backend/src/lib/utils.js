import jwt from "jsonwebtoken"
export const generateToken = (userId, res) => {
    //generates the token according to the userId
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //age
        httpOnly: true, //to prev cross site script atks
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
    
    return token;
};