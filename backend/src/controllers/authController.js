import User from '../models/User.js';

// Register a new user (basic version without hashing/OAuth)
export const register = async (req, res) => {
	try {
		const { name, email, password} = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Name, email, and password are required' });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: 'Email already in use' });
		}

		const user = await User.create({ name, email, password});
		return res.status(201).json({
			message: 'User registered successfully',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatarUrl: user.avatarUrl,
				role: user.role,
				provider: user.provider,
			},
		});
	} catch (error) {
		console.error('Register error:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Login with email/password (no hashing/token for now)
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		if (user.password !== password) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		return res.status(200).json({
			message: 'Login successful',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatarUrl: user.avatarUrl,
				role: user.role,
				provider: user.provider,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
