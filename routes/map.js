const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const mapController = require('../controller/map');

// 산책일지 저장
router.post('/maps/diary', authMiddleWare, mapController.saveMap);

module.exports = router;
