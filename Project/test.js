- Bước 1: Require các thư viện và framework : Express và MongoClient, 
        require router 
        require model: VD: const User = require('../models/User');
- Bước 2: Định nghĩa router: 
router.[method](Đường dẫn, funtion(req, res, next ) {
    // Xử lý 
    
}) ;

- Lấy dữ liệu 
User.find({chuỗi đk } , function (error, result) {
    - result là 1 mảng đối tượng tìm được thỏa mãn ddk trong database ; 
})

Cách viết chuỗi đk: {
    tên trường 1: giá trị cần tìm, 
    tên trường 2: giá trị cần tìm, ...         
}

3 loại kq trả về: 
res.render(tên file ejs sử dụng,{các đối tượng cần gửi lên giao diện })
    var abc = {user: result, name: "vux le hoang "} ;
    -> VD: res.render('index',abc); 
res.redirect(url) ; 
res.status(200).json({code: "da lam xong, ok "});  
