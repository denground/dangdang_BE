const express = require('express');
const router = express.Router();
const Map = require('../schemas/map');
const authMiddleware = require('../middlewares/auth-middleware');

// 산책일지 저장
try {
  router.post('/maps/diary', authMiddleware, async (req, res) => {
    const { mapImage, description } = req.body;
    await Map.findOneAndUpdate(
      { mapImage: mapImage },
      {
        $set: {
          description: description,
        },
      }
    );
    res.json({ success: '정보가 등록되었습니다.' });
  });
} catch (err) {
  console.log(err);
  res.json({ fail: '정보를 다시 확인해주세요.' });
}

module.exports = router;
