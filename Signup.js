
class Signup extends React.Component{
  render(){
    return(
      <div className="col-sm-4" style={{margin: 'auto'}}>
      <div className="form-group">
        <label for="usr">Họ Tên:</label>
        <input type="text" className="form-control" id="usr"/>
      </div>
      <div className="form-group">
        <label for="email">Email:</label>
        <input type="text" className="form-control" id="email"/>
      </div>
      <div className="form-group">
        <label for="sdt">SĐT:</label>
        <input type="text" className="form-control" id="sdt"/>
      </div>
      <div className="form-group">
        <label for="diachi">Địa Chỉ:</label>
        <input type="text" className="form-control" id="diachi"/>
      </div>
      <div className="form-group">
        <label for="tendangnhap">Tên Đăng Nhập:</label>
        <input type="text" className="form-control" id="tendangnhap"/>
      </div>
      <div className="form-group">
        <label for="pwd1">Password:</label>
        <input type="password" className="form-control" id="pwd1"/>
      </div>
      <div className="form-group">
        <label for="pwd2">Password:</label>
        <input type="password" className="form-control" id="pwd2"/>
      </div>
      <button type="button" className="btn btn-success buttonlogin">Sign Up</button>
    </div>
    );
  }
}

