var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var browserHistory = window.ReactRouter.browserHistory;
var Link = window.ReactRouter.Link;


// ------------------------class hiển thị trang chủ
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.state = {
      mang: []
    };
  }
  // hàm này sẽ tự động được chạy mỗi khi class này được render
  componentDidMount() {
    fetch('http://localhost:777/items')
      .then(result => {
        // chuyển data nhận được sang kiểu json
        return result.json()
      }).then(data => {
        // lấy các dữ liệu bên trong json
        this.setState({
          mang: data.arr
        });
      })
  }
  handleLinkChange(){
    ReactDOM.render(<DauGia />, document.getElementById('app'));
  }
  render() {
    return (
      <div className="row">
      <div className="col-md-2" >
         <div className="card mb-2 box-shadow">
             <Link onClick = {this.handleLinkChange} > <img className="card-img-top" src="./iphonex.png" alt="Card image cap" /></Link>
            <div style={{ padding: '0px' }}>
               <span>Iphone X</span>
               <div>
              <span id="tgDauGia">20 minus</span>
                <span style={{ float: 'right' }}>100K</span>
              </div>
             <Link onClick = {this.handleLinkChange} className="btn btn-sm btn-outline-secondary btn-block">Đấu Giá</Link>
           </div>
         </div>
        </div>
        </div>
    );
  }
}

// ------------------------class hiển thị danh sách menu
class Menu extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e){
    var name = e.target.name;
    switch(name){
      case "home":
        ReactDOM.render(<App />, document.getElementById('app'));
        break;
      case "login":
        document.getElementById('id01').style.display='block';
        break;
      case "signup":
        ReactDOM.render(<Signup />, document.getElementById('app'));
        break;
    }
    
  }
  render(){
    return(
      <div className="collapse navbar-collapse">
                  <ul className="navbar-nav mr-auto" style={{width: '800px'}}>
                    <li className="nav-item active">
                      <Link onClick={this.handleChange} className="nav-link text-primary" name = "home">Home</Link>
                    </li>
                  </ul>
                  <ul className="navbar-nav mr-auto" style={{float: 'righg'}}>
                    <li className="nav-item">
                      <Link style={{cursor: 'pointer'}} className="nav-link" onClick={this.handleChange} name = "login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link onClick={this.handleChange}  style={{cursor: 'pointer'}} className="nav-link" name = "signup">Sign Up</Link>
                    </li>
                    <div id = "chucnang">
                    </div>
                    
                  </ul>
                </div>
    );
  }
}

//------------------------ danh sách chức năng
class Chucnang extends React.Component{
  constructor(props){
    super(props);
    this.renderMenu = this.renderMenu.bind(this);
    this.state = {
      user: ''
    };
  }
  // hỏi loại người dùng từ server
  componentDidMount() {
    axios.get('http://localhost:777/kinduser')
    .then(result => {
      this.setState({
        user: result.data
      });
    })
}
renderMenu(){
  var user = this.state.user;
  let dschucnang = [];
  if(user == "")
    return
    dschucnang = [<Link className="dropdown-item" href="LichSuDauGia.html">Lịch sử đấu giá</Link>,
    <Link className="dropdown-item" href="DonHang.html">Đơn hàng</Link>,
    <Link className="dropdown-item" href="ChinhSuaThongTinTaiKhoan.html">Chỉnh sửa thông tin</Link>,
    <Link className="dropdown-item" href="DonHang.html">Đăng Xuất</Link>];
  if(user == "admin"){
      dschucnang.push(<Link className="dropdown-item" href="#">Chức năng khác</Link>);
  }
 var menu = (<div className="nav-item dropdown" >
            <Link style={{cursor: 'pointer'}} className="nav-link dropdown-toggle" data-toggle="dropdown">Username</Link> 
            <div className="dropdown-menu">
            {dschucnang}
          </div>
          </div>
 );
  return menu
}
  render(){
    return(
      <div>
      {this.renderMenu()}
      </div>
    );
  }
}

// ------------------------form login
class Login extends React.Component {
  constructor(props) {
    super(props);
    // hàm xử lý khi bấm cancle
    this.loginout = this.loginout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginsubmit = this.loginsubmit.bind(this);
    const loginfalse = false;
    this.state = {
      username: '',
      pass: '',
      remember: false
    };
  }
  handleChange(e) {
    this.setState({ username: e.target.value })
  }
  handleInputChange(e) {
    this.setState({ remember: !this.state.remember })
  }
  handlePasswordChange(e) {
    this.setState({ pass: e.target.value })
  }
  // hàm submit form login
  loginsubmit() {
    axios.post('/login', {
      name: this.state.username,
      pass: this.state.pass,
      remember: this.state.remember
    })
      .then(function (result) {
        if (result.data == "login success") {
          // xử lí sau khi đăng nhập thành công
          document.getElementById("id01").style.display = 'none';
        }
        else
          // hiển thị thông báo false vào form đăng nhập
          document.getElementById("loginfalse").style.display = 'block';
      }).catch(function (error) {
        console.log(error);
      });
  }

  // khi ấn cancle trên form     
  loginout() {
    document.getElementById('id01').style.display = 'none';
    document.getElementById("loginfalse").style.display = 'none';
  }
  render() {
    return (
      <div>
        <form className="modal-content animate">
          <div style={{ padding: '5px' }}>
            <label for="uname"><b>Username</b></label>
            <input onChange={this.handleChange} value={this.state.username} className="inputlogin" type="text" placeholder="Enter Username" name="uname" required />
            <label for="psw"><b>Password</b></label>
            <input onChange={this.handlePasswordChange} value={this.state.pass} className="inputlogin" type="password" placeholder="Enter Password" name="psw" required />
            <label>
              <input onChange={this.handleInputChange} checked={this.state.remember} type="checkbox" /> Remember me
                    </label>
          </div>
          <div className="alert alert-danger" id = "loginfalse" style = {{display: 'none'}}>
            <strong>False!</strong> UserName or PassWord not correct.
          </div>
          <div style={{ background: '#f1f1f1', padding: '16px' }}>
            <button type="button" className="btn btn-danger" onClick={this.loginout}>Cancel</button>
            <button type="button" className="btn btn-success buttonlogin" onClick={this.loginsubmit}>Login</button>
          </div>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<Router history={browserHistory}>
  <Route component={App} exact path="/"></Route>
</Router>, document.getElementById('app'));

// render phần form login
ReactDOM.render(<Login />, document.getElementById('id01'));

ReactDOM.render(<Menu />, document.getElementById('menu'));
ReactDOM.render(<Chucnang />, document.getElementById('chucnang'));
