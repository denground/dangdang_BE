const Map = require('../schemas/map');

exports.saveMap = async (req, res) => {
  const { mapImage, description } = req.body;
  try {
    await Map.findOneAndUpdate(
      { mapImage: mapImage },
      {
        $set: {
          description: description,
        },
      }
    );
    res.json({ success: '정보가 등록되었습니다.' });
  } catch (err) {
    console.log(err);
    res.json({ fail: '정보를 다시 확인해주세요.' });
  }
};
