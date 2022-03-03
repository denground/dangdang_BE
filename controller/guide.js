const Guide = require('../schemas/guide');

exports.guideMain = async (req, res) => {
  // 게시글 데이터 추가가 필요할 경우 사용
  // await Guide.create({
  //     guideTitle: '강아지와 훈련??',
  //     guideImage: 'https://t1.daumcdn.net/cfile/tistory/994C4B465E81F9A20A',
  //     guideContent: '댕댕이와 훈련 ???'
  // })

  // Guide 스키마에 있는 정보 추출
  const guide = await Guide.find({}, { guideContent: false });
  // for (let i = 0; i < guide.length; i++) {
  //     let title = guide[i].guideTitle
  //     let image = guide[i].guideImage
  //     console.log('title : ', title, 'image : ', image)
  // }
  res.status(200).json({
    guide,
  });
};

exports.guideDetail = async (req, res) => {
  // url 값 가져오기
  const _id = req.params.postNumber;
  console.log(_id);
  // 게시글 가져오기
  const article = await Guide.findOne({ _id });
  res.status(200).json({
    article,
  });
};
