const mongoose = require('mongoose')

const guideSchema = new mongoose.Schema({
    guideTitle: {
        type: String,
        require: true,
    },
    guideTitleImage: {
        type: String,
        require: true,
    },
    guideContentImage: {
        type: String,
        require: true,
    },
    guideContent: {
        type: Array,
        require: true,
    }
})

module.exports = mongoose.model('Guide', guideSchema)