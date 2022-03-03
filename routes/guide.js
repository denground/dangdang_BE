const express = require('express');
const router = express.Router();
const guideController = require('../controller/guide');

// 돌발 가이드 메인 페이지 API (돌발 가이드 버튼 누르면 나오는 페이지)
router.get('/guides', guideController.guideMain);

// 돌발 가이드 페이지 게시글 상세페이지 보는 API
router.get('/guides/:postNumber', guideController.guideDetail);

module.exports = router;
