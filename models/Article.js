const { Schema, model } = require('mongoose');

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: "default.png"
    },
});

module.exports = model('Article', articleSchema, "articles")
// el modelo  es - Article
// el Schema es  - articleSchema
// la collection es - articles