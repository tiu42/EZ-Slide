import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Register
export const register = async (req, res) => {
	const {name, email, password} = req.body;
	try {
		if(!name || !email || !password){
			return res.status(400).json({message: "Please fill all the fields"})
		}

		const userExist = await User.findOne({email});
		if(userExist){
			return res.status(409).json({message: "Email already used"})
		}
		
		const user = await User.create({name, email, password});

		const token = generateToken(user._id)
		return res.status(201).json({
			id: user._id,
			name: user.name,
			email: user.email,
			token
		})
	}
	catch(err) {
		console.error("Register Error:", err);
		res.status(500).json({message: "Server error"});
	}
};

// Login
export const login = async (req, res) => {
	const {email, password} = req.body;
	try {
		if (!email || !password){
			return res.status(400).json({message: "Please fill all the fields"})
		}

		const user = await User.findOne({email});
		if (!user || !(await user.matchPassword(password))){
			return res.status(401).json({message: "Invalid credentials"});
		}

		const token = generateToken(user._id)
		return res.status(200).json({
			id: user._id,
			name: user.name,
			email: user.email,
			token
		})
	}
	catch (err){
		console.error("Login Error:", err);
		res.status(500).json({message: "Server error"});
	}
};

export const me = async (req,res) => {
	res.status(200).json(req.user)
}

const generateToken = (id) => {
	return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}