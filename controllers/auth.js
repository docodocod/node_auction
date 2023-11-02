const bcrypt= require('bcrypt');
const User=require('../models/user');
const jwt=require("jsonwebtoken");

exports.join=async(req,res,next)=>{
    const {email, nick,password,money}=req.body;
    try{
        const exUser=await User.findOne({where: {email}});
        if(exUser){
            return res.redirect('/join?error=이미 가입된 이메일입니다.');
        }
        const salt = process.env.SALT;
        const iterations = parseInt(process.env.ITERATION);
        const keyLength = 64; // 출력 길이
        //비밀번호 암호화
        crypto.pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
            if (err) throw err;
            const hashedPassword = derivedKey.toString('hex');
            console.log('Hashed Password:', hashedPassword);
            User.create({
                email,
                nick,
                password: hashedPassword,
                salt
            });
            return res.redirect('/');
        });
    }catch(error){
        console.error(error);
        return next(error);
    };
}

exports.login=async(req,res,next)=> {
    const {email, password} = req.body;
    try {
        const exUser = await User.findOne({where: {email}});
        if (exUser) {
            const storedPw = exUser.password;
            const salt = process.env.SALT;
            const iterations = parseInt(process.env.ITERATION);
            const keyLength = 64; // 출력 길이

            crypto.pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
                if (err) throw err;
                const hashedPw = derivedKey.toString('hex');
                console.log('Hashed Password:', hashedPw);
                if (exUser.password = hashedPw) {
                    console.log("로그인 성공");
                    try {
                        const token = jwt.sign({email}, process.env.JWT_SECRET, {
                            expiresIn: "60m",
                            issuer: "dongja",
                        })
                        console.log("토큰이 발급 되었습니다.");
                        console.log("token: " + token);
                        req.session.user = exUser.nick;
                        console.log(req.session.user);
                        res.render('loginForm', {user: exUser});
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    res.status(200).send("비밀번호가 틀렸습니다.");
                }
            })
        }
    }catch(err){
        console.error(err);
        return next(err);
    }
}

exports.logout=(req,res,next)=>{
    req.logout();
    req.session.destroy;
    req.redirect("/");
}