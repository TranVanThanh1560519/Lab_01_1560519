var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// lấy danh sách phiên đấu giá tăng dần theo thời gian đấu cho trang index
exports.dsPhienDau = function(callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbo = db.db("DBWEB2");
        dbo.collection("PhienDau").aggregate(
            [
                {
                    $project:
                    {
                        maphiendau: 1,
                        masanpham: 1,
                        thoigianbatdau: 1,
                        thoigiandau: 1,
                        giahientai: 1,
                        trangthai: 1,
                        thoigianketthuc: {$sum: ["$thoigiandau", "$thoigianbatdau"]}
                    }
                },
                {
                    $lookup:
                    {
                            from: "TrangThai",
                            localField: "trangthai",
                            foreignField: "matrangthai",
                            as: "chitiettrangthai"
                    }
                },
                {
                    $lookup:
                    {
                            from: "SanPham",
                            localField: "masanpham",
                            foreignField: "masanpham",
                            as: "chitietsanpham"
                    }
                },
                {
                    $unwind: "$chitiettrangthai"
                },
                {
                    $unwind: "$chitietsanpham"
                },
                {
                    $match:
                    {
                        thoigianketthuc: {$gt: Date.now()},
                        "chitiettrangthai.tentrangthai": 'active'
                    }
                }
            ]
        ).sort({thoigianketthuc: -1}).toArray(function(err, result){
            if(err) throw err;
            if(result == null)
                callback(null);
            else
                callback(result);
            db.close();
        });
    });
};

// lấy thông tin chi tiết của 1 phiên
exports.chiTietPhienDau = function(maphien, callback){
    MongoClient.connect(url, function(err, db){
        if(err) throw err;
        var dbo = db.db("DBWEB2");
        dbo.collection("PhienDau").aggregate(
            [
                {
                    $project:
                    {
                        maphiendau: 1,
                        masanpham: 1,
                        thoigianbatdau: 1,
                        thoigiandau: 1,
                        giahientai: 1,
                        trangthai: 1,
                        thoigianketthuc: {$sum: ["$thoigiandau", "$thoigianbatdau"]}
                    }
                },
                {
                    $lookup:
                    {
                            from: "TrangThai",
                            localField: "trangthai",
                            foreignField: "matrangthai",
                            as: "chitiettrangthai"
                    }
                },
                {
                    $lookup:
                    {
                            from: "SanPham",
                            localField: "masanpham",
                            foreignField: "masanpham",
                            as: "chitietsanpham"
                    }
                },
                {
                    $lookup:
                    {
                            from: "Hinh",
                            localField: "masanpham",
                            foreignField: "masanpham",
                            as: "danhsachhinh"
                    }
                },
                {
                    $unwind: "$chitiettrangthai"
                },
                {
                    $unwind: "$chitietsanpham"
                },
                {
                    $unwind: "$danhsachhinh"
                },
                {
                    $match:
                    {
                        maphiendau: maphien,
                        thoigianketthuc: {$gt: Date.now()},
                        "chitiettrangthai.tentrangthai": 'active'
                    }
                }
            ]
         ).toArray(function(err, result){
            if(err) throw err;
            if(result == null)
                callback(null);
            else
                callback(result[0]);
            db.close();
        });
    });
};
