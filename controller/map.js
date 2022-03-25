const Maps = require('../schemas/map');
const Profile = require('../schemas/profile');

exports.showImage = async (req, res, next) => {
    try {
        const { user } = res.locals;
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
    const { path, time, water, yellow, brown, danger, distance } = req.body;
    const { user } = res.locals;
    try {
        await Maps.create({
            path,
            time,
            water,
            yellow,
            brown,
            danger,
            distance,
            userID: user.userID,
        });
        res.status(200).json({
            path,
            time,
            water,
            yellow,
            brown,
            danger,
            distance,
            success: '산책 정보가 저장되었습니다.',
        });
    } catch (error) {
        res.status(400).json({ fail: '정보 저장에 실패하였습니다.' });
        next(error);
    }
};

exports.showData = async (req, res, next) => {
    const { user } = res.locals;
    try {
        const recentData = await Maps.findOne({ userID: user.userID }).sort({
            createdAt: -1,
        });
        const mypetName = await Profile.findOne(
            { userID: user.userID },
            { petName: true }
        );
        res.status(200).json({ recentData: recentData, petname: mypetName });
    } catch (error) {
        res.status(401).json({
            fail: '정보를 불러오지 못했습니다. 관리자에게 문의하세요.',
        });
        next(error);
    }
};

exports.showMap = async (req, res, next) => {
    const { user } = res.locals;
    try {
        const list = await Maps.find(
            { userID: user.userID },
            { _id: true, createdAt: true, distance: true, time: true }
        );
        const profileImage = await Profile.findOne(
            { userID: user.userID },
            { petImage: true }
        );
        if (!list) {
            res.status(200).json({ success: '산책 내역이 없어요' });
            return;
        }
        res.status(200).json({ profileImage, list });
    } catch (error) {
        res.status(400).json({ fail: '알 수 없는 오류가 발생했습니다.' });
        next(error);
    }
};

exports.detailMap = async (req, res, next) => {
    try {
        const detail = await Maps.findById(req.params.mapsId);
        res.status(200).json(detail);
    } catch (error) {
        res.status(400).json({ fail: '알 수 없는 오류가 발생했습니다.' });
        next(error);
    }
};

exports.deleteMap = async (req, res, next) => {
    try {
        await Maps.deleteOne({ _id: req.params.mapsId });
        res.status(200).json({ success: '산책일지가 삭제되었습니다.' });
    } catch (error) {
        res.status(400).json({ fail: '알 수 없는 오류가 발생했습니다.' });
        next(error);
    }
};
