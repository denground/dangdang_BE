const { CodeGuruProfiler } = require('aws-sdk');
const Map = require('../schemas/map');
const Profile = require('../schemas/profile');
const oneprofile = require('../test/data/one-profile.json');
// description update, 반려동물 사진 보내주기, 산책 정보 저장 要

exports.updateMap = async (req, res, next) => {
  const { mapImage, description } = req.body;
  try {
    let updatedMap = await Map.findOneAndUpdate(
      { mapImage },
      { description },
      {
        new: true,
      }
    );
    if (updatedMap) {
      res.status(200).json({ success: '정보가 등록되었습니다.' });
    } else {
      res.status(400).json({ fail: '정보를 다시 확인해주세요.' });
    }
  } catch (error) {
    next(error);
  }
};

exports.showImage = async (req, res, next) => {
  try {
    const user = res.locals;
    const imgUrl = await Profile.findOne(
      { userID: user.userID },
      { petImage: true, _id: false }
    );
    res.status(200).json(imgUrl);
  } catch (error) {
    res.status(400).json({ fail: '알 수 없는 오류가 발생했습니다.' });
    next(error);
  }
};

exports.saveMap = async (req, res) => {
  const { time, distance } = req.body;
  const { user } = res.locals;
  try {
    await Map.create({
      mapImage: req.file.location,
      time,
      distance,
      userID: user.userID,
    });
    res.status(200).send({ success: '산책 정보가 저장되었습니다.' });
  } catch (error) {
    res.status(400).send({ fail: '정보 저장에 실패하였습니다.' });
    next(error);
  }
};
