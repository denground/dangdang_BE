const Maps = require('../schemas/map');
const Profile = require('../schemas/profile');

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

exports.saveMap = async (req, res, next) => {
    const { path, time, distance } = req.body;
    console.log(req.body);
    const { user } = res.locals;
    console.log(res.locals);
    try {
        await Maps.create({
            path,
            time,
            distance,
            userID: user.userID,
        });
        res.status(200).json({ success: '산책 정보가 저장되었습니다.' });
    } catch (error) {
        res.status(400).send({ fail: '정보 저장에 실패하였습니다.' });
        next(error);
    }
};
