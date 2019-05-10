var q=require("q");
var db=require("../common/database");

var conn=db.getConnection();


function getAllPosts(){
    var defer=q.defer();
        var query=conn.query('SELECT * FROM posts',function(error,posts){
            if(error){
                defer.reject(error);
            }else{
                defer.resolve(posts);
            }
        });
    return defer.promise;
}

function getAllPartI(){
    var defer=q.defer();
        var query=conn.query('SELECT * FROM parti',function(error,dethi){
            if(error){
                defer.reject(error);
            }else{
                defer.resolve(dethi);
            }
        });
    return defer.promise;
}


function addPost(params){
    if(params){
        var defer=q.defer();
        var query = conn.query('INSERT INTO posts SET ?', params, function (error, results, fields) {
            if(error){
                defer.reject(error);
            }else{
                defer.resolve(results);
            }

        });
        return defer.promise;
            
    }
    return false;
}

function addPartI(params){
    if(params){
        var defer=q.defer();
        var query = conn.query('INSERT INTO parti SET ?', params, function (error, results, fields) {
            if(error){
                defer.reject(error);
            }else{
                defer.resolve(results);
            }

        });
        return defer.promise;
            
    }
    return false;
}

function getPostByID(id){
    if(id){
        var defer=q.defer();
        var query=conn.query('SELECT * FROM posts WHERE id=?',id,function(error,posts){
            if(error){
                defer.reject(error);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;

    }
    return false;
}

function getPartIByID(id){
    if(id){
        var defer=q.defer();
        var query=conn.query('SELECT * FROM parti WHERE id=?',id,function(error,posts){
            if(error){
                defer.reject(error);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;

    }
    return false;
}

function updatePost(params){
    if(params){
        var defer=q.defer();
        var query=conn.query('UPDATE posts SET title= ?, content= ? ,author= ? WHERE id=?',
        [params.title,params.content,params.author,params.id],
        function(error,posts){
            if(error){
                defer.reject(error);
                console.log("loi");
            }else{
                defer.resolve(posts);
                console.log("thanh cong");
            }
        });
        return defer.promise;
        

    }
    return false;
}


function deletePost(id){
    if(id){
        var defer=q.defer();
        var query=conn.query('DELETE * FROM posts WHERE id=?',id,function(error,posts){
            if(error){
                defer.reject(error);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;

    }
    return false;
}
module.exports={
    getAllPosts:getAllPosts,
    addPost:addPost,
    getPostByID:getPostByID,
    updatePost:updatePost,
    deletePost:deletePost,
    getAllPartI:getAllPartI,
    addPartI:addPartI,
    getPartIByID:getPartIByID
}