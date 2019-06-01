var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String, 
    author_id: String,
    type: String, // loại part có 14 loại
    content: {
        type: String,
        default: "Reading Part Content", 
    }, // Đề bài 
    explaination: String, // HD làm bài 
    questionlist: [String], // Danh sách câu hỏi và đáp án tương ứng hoặc 1 short và cả đống đáp án
    answerlist: [String], 
    selectlist:[String]
}, {
    collection : "part"
});
module.exports = mongoose.model('part', PartSchema);