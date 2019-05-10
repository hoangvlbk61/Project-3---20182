const mongoose = require('mongoose');
var user = new mongoose.Schema(
    { 
        email:"string",
        password:"string",
        first_name:"string",
        last_name:"string",
        entry_score:"number",
        target_score:"number",
        start_study:"Date" 
    }, 
    { 
        collection: "hocvien" 
    });
module.exports = mongoose.model("user", user);