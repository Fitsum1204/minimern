import { Router } from "express";
import User from "../../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { check, validationResult } from "express-validator";


const user = Router();
// @route POST api/users/signup
// @desc Register a user
// @access public

user.post('/signup',[
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')

], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password,role} = req.body;
    try {
      let user = await User.findOne({email})
        if(user){
            return res.status(400).json({msg:'User already exists'})
        }
        user = new User({
            name,
            email,
            password,
            role
        })  
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        const payload = {
                    user:{id:user.id,role: user.role}
                    
                }
                jwt.sign(payload,process.env.SECRET,{
                    expiresIn: 360000
                },(err,token)=>{
                    if(err) throw err;
                    res.json({token});
                });
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }})
export default user;