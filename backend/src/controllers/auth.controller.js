import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req,res)=>{
    const {name,mobile,bio,password} = req.body;
    try {
        if (password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        const user =await User.findOne({mobile})
        if (user) return res.status(400).json({message:"Mobile number already registered"});

        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newuser = new User({
            name,mobile,bio,password:hashedPassword
        });

        if (newuser){
            generateToken(newuser._id,res);
            await newuser.save();
            res.status(201).json({_id:newuser._id,name:newuser.name,mobile:newuser.mobile,bio:newuser.bio,profilepic:newuser.profilepic});
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Server error"});
    }
};

export const login = async (req,res)=>{
    const {mobile,password} = req.body;
    try {
        const user = await User.findOne({mobile});
        if (!user) return res.status(400).json({message:"Invalid credentials"});

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) return res.status(400).json({message:"Invalid credentials"});

        generateToken(user._id,res);
        res.status(201).json({_id:user._id,name:user.name,mobile:user.mobile,bio:user.bio,profilepic:user.profilepic});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Server error"});
    }
};

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out succesfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Server error"});
    }
};

export const updateProfile = async (req,res)=>{
    try {
        const {profilepic} = req.body;
        const userId = req.user._id;
        if (!profilepic) return res.status(400).json({message:"profile pic is required"});
        const uploadResponse = await cloudinary.uploader.upload(profilepic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true});
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updating profile");
        res.status(500).json({message:"Internal server error"});
    }
}

export const checkAuth = async (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller");
        res.status(500).json({message:"Internal server error"});
    }
}

export const updateUserInfo = async (req,res)=>{
    try {
        const {name, bio} = req.body;
        const userId = req.user._id;

        // Validation
        if (!name && !bio) {
            return res.status(400).json({message:"Please provide name or bio to update"});
        }

        // Build update object - only allow updating name and bio
        const updateData = {};
        if (name && name.trim()) updateData.name = name.trim();
        if (bio && bio.trim()) updateData.bio = bio.trim();

        // Update user (mobile cannot be updated)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {new:true}
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updating user info", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}