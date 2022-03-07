const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const upload = require('../modules/multer');
const mapController = require('../controller/map');

// 산책일지 저장 (description 추가 시)
router.post('/maps/diary', authMiddleWare, mapController.updateMap);

//반려동물 사진 보내주기 (일시정지 클릭 시)
router.get('/maps/pause', authMiddleWare, mapController.showImage);

//산책 정보 저장 (산책종료 클릭 시)
router.post('/maps/info', authMiddleWare, mapController.saveMap);

module.exports = router;
