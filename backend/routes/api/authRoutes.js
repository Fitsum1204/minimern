import {Router } from 'express';
import User from '../../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import {verifyToken} from '../../middleware/verifyToken.js';
import {check, validationResult} from 'express-validator';

const auth = Router();
// @route GET api/auth
// @desc Get logged in user
// @access public
auth.get('/',[verifyToken], async (req, res) => {  
    try {
        const user = await User.findByIdAndDelete(req.user.id).select('-password');
        res.json(user);
    
} catch (error) {
    console.error(error);
    res.status(500).json({msg: 'Server Error'});
    
} })

// @route POST api/auth
// @desc Auth user & get token
// @access public
auth.post('/login', [
    
    check('email').isEmail().withMessage('Please include a valid email'), 
    check('password').exists().withMessage('Password is required')
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email,password} = req.body
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'Invalid Credentials'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid Credentials'})
        }
        const payload = {
            user:{id:user.id,role: user.role}
        }
        jwt.sign(payload,process.env.SECRET,{
            expiresIn: 360000
        },(err,token)=>{
            if(err) throw err;
            res.json({token});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Server Error'});
        
    }
})
export default auth