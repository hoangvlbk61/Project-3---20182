var User = require('../../models/User')

function checkPerm(req, res, next) {
    var id = req.session.user._id ; 
    User.findById(id, (err, data) => {
        if(err) 
            throw(err) ; 
        else if (data.is_admin) 
             next(); 
        else  {
            res.status(200).json({
                err: id,
                data: data
            })
            // res.redirect('/dasboard');
        }; 
    })
}

module.exports = checkPerm;