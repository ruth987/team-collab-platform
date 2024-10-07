const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {jwtSecret, jwtExpiresIn} = require('../config/auth');
const auth = require('../config/auth');

const authController = {
    async register(req, res) {
        try {
            console.log("getting here babe");
            const {name, email, password} = req.body;
            const existingUser = await userModel.findByEmail(email);

            if (existingUser){
                return res.status(400).json({message: 'Email already in use'});
            }

            const user = await userModel.create(name, email, password);
            const token = jwt.sign({userId: user.id}, jwtSecret, {expiresIn: jwtExpiresIn});

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email, 
                    profilePicture: user.profilePicture, 
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                token
            })
            
        } catch (error) {
            res.status(500).json({message: 'Error registering user', error:error.message});
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            // console.log('Login attempt for email:', email);

            const user = await userModel.findByEmail(email);
            // console.log('User found:', user ? 'Yes' : 'No');

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            // console.log('Password valid:', isPasswordValid);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });
            // console.log('Token generated successfully');

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture, 
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                token
            });
            
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    },

    async getProfile(req, res) {
        try {
            const user = await userModel.findById(req.userId);
            if(!user) {
                return res.status(404).json({message: 'User not found'});

            }
            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profile_picture,
                    role: user.role,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at
                }
            })
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user profile', error: error.message });
        }
    }
}

module.exports = authController;

