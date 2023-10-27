const express=require('express');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

const {isLoggedIn,isNotLoggedIn}=require('../middlewares');
const{
    renderMain,renderJoin,renderGood,createGood,renderAuction,bid, renderList
}=require('../controllers');

const router =express.Router();

router.use((req,res,next)=>{
    res.locals.user=req.user; //가지고 있는 유저 정보를 계속 유지 할 수 있도록 해준다.
    next();
});

router.get('/',renderMain); //메인페이지로 이동시
router.get('/join',isNotLoggedIn,renderJoin); // /join 페이지로 이동시
router.get('/good',isLoggedIn,renderGood); // /good 페이지로 이동시

try{
    fs.readdirSync('uploads'); //uploads 폴더를 읽어온다.
}catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); //폴더가 없을시 생성
}

const upload=multer({
    storage:multer.diskStorage({
        destination(req,file,cb){
            cb(null,'uploads/');
        },
        filename(req,file,cb){
            const ext=path.extname(file.originalname);
            cb(null,path.basename(file.originalname,ext)+new Date().valueOf() + ext);
        },
    }),
    limits:{fileSize:5*1024*1024}, //파일 사이즈 제한 걸기
});
router.post('/good', isLoggedIn, upload.single('img'), createGood);

router.get('/good/:id', isLoggedIn, renderAuction);

router.post('/good/:id/bid', isLoggedIn, bid);

router.get('/list', isLoggedIn, renderList);

module.exports = router;
