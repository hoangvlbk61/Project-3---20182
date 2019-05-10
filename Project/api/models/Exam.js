var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var ExamSchema = new Schema({
    exam_id: {
        type: Number
    },
    examinee_id: {
        type: Number
    },
    time: {
        type: Date
    },
    reading: {
        type: Number
    },
    listening: {
        type: Number
    },
    speaking: {
        type: Number
    },
    writing: {
        type: Number
    },
    test_list: [
        {
            test_id: Number
        }
    ]
});
module.exports = mongoose.model('Exam', ExamSchema);