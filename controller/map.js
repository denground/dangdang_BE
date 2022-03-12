const { count } = require("../schemas/map");
const Maps = require("../schemas/map");
const Profile = require("../schemas/profile");

exports.showImage = async (req, res, next) => {
    try {
        const { user } = res.locals;
        const imgUrl = await Profile.findOne(
            { userID: user.userID },
            { petImage: true, _id: false }
        );
        res.status(200).json(imgUrl);
    } catch (error) {
        res.status(400).json({ fail: "알 수 없는 오류가 발생했습니다." });
        next(error);
    }
};

exports.saveMap = async (req, res, next) => {
    const { path, time, marker, distance } = req.body;
    console.log("req body", req.body);
    const { user } = res.locals;
    console.log("req locals", res.locals);
    try {
        await Maps.create({
            path,
            time,
            marker,
            distance,
            userID: user.userID,
        });
        res.status(200).json({ success: "산책 정보가 저장되었습니다." });
    } catch (error) {
        res.status(400).send({ fail: "정보 저장에 실패하였습니다." });
        next(error);
    }
};

exports.showMap = async (req, res, next) => {
    const { user } = res.locals;
    try {
        const list = await Maps.find(
            { userID: user.userID },
            { _id: true, createdAt: true, distance: true, petImage: true }
        );
        if (!list) {
            res.status(200).json({ success: "산책 내역이 없어요" });
            return;
        }
        res.status(200).json(list);
    } catch (error) {
        console.log(error);
        res.status(400).json({ fail: "알 수 없는 오류가 발생했습니다." });
        next(error);
    }
};

exports.detailMap = async (req, res, next) => {
    try {
        const detail = await Maps.findById(req.params.mapsId);
        const waterCount = await detail.waterCount.length;
        const yellowCount = await detail.yellowCount.length;
        const brownCount = await detail.brownCount.length;
        const dangerCount = await detail.dangerCount.length;
        res.status(200).json(detail, {
            waterCount: waterCount,
            yellowCount: yellowCount,
            brownCount: brownCount,
            dangerCount: dangerCount,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ fail: "알 수 없는 오류가 발생했습니다." });
        next(error);
    }
};
