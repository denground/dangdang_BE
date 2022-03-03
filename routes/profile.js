const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile');
const upload = require('../modules/multer');
const auth = require('../middlewares/auth-middleware');

// 견종 등록
router.post(
  '/profiles',
  auth,
  upload.single('petImage'),
  profileController.savedog
);

// 마이페이지 메인
router.get('/profiles', auth, profileController.mypageMain);

module.exports = router;
