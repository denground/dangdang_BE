const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const mapController = require('../controller/map');

//반려동물 사진 보내주기 (일시정지 클릭 시)
router.get('/maps/pause', authMiddleWare, mapController.showImage);

//산책 정보 저장 (산책종료 클릭 시)
router.post('/maps/info', authMiddleWare, mapController.saveMap);

//산책일지 불러오기 (메인)
router.get('/maps/info', authMiddleWare, mapController.showMap);

// 산책일지 불러오기 (상세)
router.get('/maps/info/:mapsId', authMiddleWare, mapController.detailMap);
module.exports = router;
