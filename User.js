var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
exports.login = function(username, pass, remb, callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbo = db.db("DBWEB2");
        dbo.collection("TaiKhoan").findOne({Username: username, Password: pass},{Kind: 1}, function(err, result){
            if(err) throw err;
            if(result == null)
                callback(null);
            else
                callback(result.Kind);
            db.close();
        });
    });
};
