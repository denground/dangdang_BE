const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const upload = require('../modules/multer');
const mapController = require('../controller/map');

// 산책일지 저장
router.post('/maps/diary', authMiddleWare, mapController.updateMap);

//반려동물 사진 보내주기
router.get('/maps/pause', authMiddleWare, mapController.showImage);

//산책 정보 저장
router.post(
  '/maps/info',
  authMiddleWare,
  upload.single('mapImage'),
  mapController.saveMap
);

module.exports = router;
