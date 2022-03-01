const mongoose = require('mongoose')

const guideSchema = new mongoose.Schema({
    guideTitle: {
        type: String,
        require: true,
    },
    guideImage: {
        type: String,
        require: true,
    },
    guideContent: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model('Guide', guideSchema)