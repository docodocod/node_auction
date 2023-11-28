const express=require('express');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {login,join,logout}=require('../controllers/auth.js')

const router=express.Router();

router.post('/join',isNotLoggedIn,join); //controller에 있는 join 메서드로 이동
router.post('/login',isNotLoggedIn,login); //controller에 있는 login 메서드로 이동
router.get('/logout',isLoggedIn,logout); //controller에 있는 logout 메서드로 이동

module.exports=router;