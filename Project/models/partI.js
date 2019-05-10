const mongoose = require('mongoose');
var partI = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        id_exam:"number",
        PartI:{
            id_part:"number",
            audio_src:"string",
            bo_cau_hoi:[
                {id_cauhoi:"number",image_src:"string",sign:"string", a1:"number",explain:"string"}
               
            ]
        } 
    }



, { collection: "partI" });
module.exports = mongoose.model("partI", partI);