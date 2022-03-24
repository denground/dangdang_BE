const Guide = require('../schemas/guide');

exports.guideMain = async (req, res, next) => {
    try {
        const guide = await Guide.find(
            {},
            { guideTitle: true, guideTitleImage: true }
        );
        res.status(200).json(guide);
    } catch (error) {
        next(error);
    }
};

exports.guideDetail = async (req, res, next) => {
    try {
        const guide = await Guide.findById(req.params.postNumber, {
            guideTitleImage: false,
        });
        res.status(200).json(guide);
    } catch (error) {
        next(error);
    }
};
