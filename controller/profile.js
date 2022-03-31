const Profile = require("../schemas/profile");
const MapModel = require("../schemas/map");

exports.savedog = async (req, res, next) => {
    const { petName, petGender, petBirth, petBreed } = req.body;
    const { user } = res.locals;
    try {
        await Profile.create({
            petImage: req.file.location,
            petName,
            petGender,
            petBirth,
            petBreed,
            userID: user.userID,
        });
        res.status(200).json({ success: "정보가 등록되었습니다." });
    } catch (error) {
        res.status(400).json({ fail: "정보를 다시 확인해주세요" });
        next(error);
    }
};

exports.mypageMain = async (req, res, next) => {
    const { user } = res.locals;
    try {
        const [userData] = await Profile.find({ userID: user.userID });
        const mapData = await MapModel.find({ userID: user.userID });
        if (!userData) {
            res.status(401).json({ fail: "데이터가 존재하지 않습니다." });
            return;
        }
        res.status(200).json({userData, mapData});
    } catch (error) {
        res.status(400).json({ fail: "알 수 없는 오류가 발생했습니다." });
        next(error);
    }
};

exports.modifyMypage = async (req, res, next) => {
    const { user } = res.locals;
    const { petName, petGender, petBirth, petBreed } = req.body;
    try {
        if (!req.file) {
            await Profile.updateOne(
                { userID: user.userID },
                { $set: { petName, petGender, petBirth, petBreed, } }
            );
        } else {
            await Profile.updateOne(
                { userID: user.userID },
                { $set: { petImage: req.file.location, petName, petGender, petBirth, petBreed, } }
            );
        }
        res.status(200).json({
            success: "정보가 수정되었습니다.",
        });
    } catch (error) {
        res.status(400).json({ fail: "정보를 다시 확인해주세요." });
        next(error);
    }
};
