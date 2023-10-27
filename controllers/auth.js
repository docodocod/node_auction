const bcrypt= require('bcrypt');
const User=require('../models/user');

exports.join=async(req,res,next)=>{
    const {email, nick,password,money}=req.body;
    try{
        const exUser=await User.findOne({where: {email} });
        if(exUser){
            return res.redirect('/join?error=이미 가입된 이메일입니다.');
        }
        const newUser=await User.create({
            email,
            nick,
            password:hash,
            money,
        });
        return res.redirect('/');
    }catch(error){
        console.error(error);
        return next(error);
    }
}

exports.login=(req,res,next)=>{
    const {email,password}=req.body;

}