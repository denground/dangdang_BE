const Guide = require('../schemas/guide');

exports.guideMain = async (req, res, next) => {
    try {
        // 게시글 데이터 추가가 필요할 경우 사용
        // await Guide.create({
        //     guideTitle: '강아지와 훈련??',
        //     guideImage: 'https://t1.daumcdn.net/cfile/tistory/994C4B465E81F9A20A',
        //     guideContent: '댕댕이와 훈련 ???'
        // })

        // Guide 스키마에 있는 정보 추출
        const guide = await Guide.find({guideTitle: true, guideTitleImage: true});
        // for (let i = 0; i < guide.length; i++) {
        //     let title = guide[i].guideTitle
        //     let image = guide[i].guideImage
        //     console.log('title : ', title, 'image : ', image)
        // }
        res.status(200).json(guide);
    } catch (error) {
        next(error);
    }
};

exports.guideDetail = async (req, res, next) => {
    try {
        const guide = await Guide.findById(req.params.postNumber, {guideTitleImage: false});
        res.status(200).json(guide);
    } catch (error) {
        next(error);
    }
};
