const express = require("express");
const router = express.Router();
const Profile = require("../schemas/profile");
const upload = require("../modules/multer");
const auth = require("../middlewares/auth-middleware");

// 견종 등록
router.post("/profiles", auth, async (req, res) => {
    const { petImage, petName, petGender, petBirth, petBreed } = req.body;
    await Profile.create({ petImage, petName, petGender, petBirth, petBreed });
    res.status(200).send({ success: "정보가 등록되었습니다." });
});

// 마이페이지 메인
router.get('/profiles', auth, async(req, res) => {
    const { user } = res.locals;
    const userData = await Profile.findOne({ userID: user.userID });
    res.status(200).send(userData);
})

module.exports = router;
