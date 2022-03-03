const Profile = require('../schemas/profile');

exports.savedog = async (req, res) => {
  const { petName, petGender, petBirth, petBreed } = req.body;
  const { user } = res.locals;
  await Profile.create({
    petImage: req.file.location,
    petName,
    petGender,
    petBirth,
    petBreed,
    userID: user.userID,
  });
  res.status(200).send({ success: '정보가 등록되었습니다.' });
};

exports.mypageMain = async (req, res) => {
  const { user } = res.locals;
  const [userData] = await Profile.find({ userID: user.userID });
  console.log(user.nickname);
  console.log(userData);
  if (!userData) {
    res.status(401).send('데이터가 존재하지 않습니다.');
    return;
  }
  res.status(200).send(userData);
};
