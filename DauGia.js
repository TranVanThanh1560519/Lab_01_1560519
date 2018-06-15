// ------------------------class xử lí trang đấu giá
class DauGia extends React.Component {
  constructor(props) {
    super(props);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.Loaddata = this.Loaddata.bind(this);
    this.Loaddsdaugia = this.Loaddsdaugia.bind(this);
    this.Loadhinhanh = this.Loadhinhanh.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.getDsDauGia = this.getDsDauGia.bind(this);
    this.handleComboboxChange = this.handleComboboxChange.bind(this);
    this.handleButtonChange = this.handleButtonChange.bind(this);
    this.state = {
      phien: null,
      dsdaugia: [],
      dshinh: [],
      nguoithang: '',
      giatoithieu: 0,
      giainput: 0,
      buocnhaygia: 0
    };
  }
  componentDidMount() {
    // lấy mã sản phẩn từ props và gọi lên server để lấy dữ liệu
    var maphien = this.props.maphien;
    // goi lên server lấy thông tin của phiên đấu giá này
    fetch('http://localhost:777/daugia/' + maphien).then(result => {
      return result.json()
    }).then(data => {
      this.setState({
        phien: data,
        dshinh: data.dshinhanh,
        giatoithieu: parseInt(data.giathauthapnhat),
        buocnhaygia: parseInt(data.buocnhaygia),
        giainput: parseInt(data.giathauthapnhat)
      });
    })
    // gọi hàm lấy danh sách những người đấu giá sau mỗi 1s
    this.TimerID = setInterval(() => this.getDsDauGia(), 1000);
    // tạo script hiệu ứng zoom ảnh 
    const script = document.createElement("script");
    script.src = "./script/imgzoom.js";
    script.async = true;
    document.body.appendChild(script);
  }
  handleLinkChange() {
    ReactDOM.render(<App />, document.getElementById('app'));
  }
  handleImgChange(e){
      document.getElementById('zoom_05').src = e.target.src;
      document.getElementById('zoom_05').setAttribute("data-zoom-image", "./img/Noimg.png");
  }
  handleButtonChange(e){
    var name = e.target.name;
    switch(name){ 
      case "down":
          if(this.state.giainput == this.state.giatoithieu)
              break;
          this.state.giainput = this.state.giainput - this.state.buocnhaygia
          break;
      case "up":
          this.state.giainput = this.state.giainput + this.state.buocnhaygia
          break;
      case "daugia": 
          
          break;
    }
  }
  // hàm lấy các loại sản phẩm
  handleComboboxChange = () => {
    var dsloai = this.state.phien.dsloaisp;
    if(dsloai == null)
      return;
    let ds = [];
    for(var i = 0; i < dsloai.length; i++){
      var item = (<option>{dsloai[i]}</option>);
      ds.push(item);
    }
    return ds;
  }
  // hàm lấy danh sách những người đấu giá
  getDsDauGia = () =>{
    var maphien = this.state.phien.maphien;
    if(maphien != null){
      axios.get('http://localhost:777/danhsachdaugia/'+maphien).then(result => {
        // lấy danh sách mới từ result
        var x = result.data;
        if(x==null || x=="")
          return;
        this.setState({
          dsdaugia: result.data
        });
    })
    } 
  }
  Loaddsdaugia = () => {
    // kiểm tra dữ liệu
    var ds = this.state.dsdaugia;
    if(ds == null || ds.length == 0)
      return;
    let tble = [];
    ds.forEach(el => {
      var item = (<tr>
        <td>{el.username}</td>
        <td>{el.giathau}k</td>
        <td>{el.thoigianthau}</td>
      </tr>);
      tble.push(item);
    });
    // hiển thị người thắng hiện tại
    var name = "người thắng hiện tại là "+ ds[0].username + " !";
    if(name != this.state.nguoithang){
      this.setState({
        nguoithang: name
      });
    }
    
    // return ra cấu trúc bảng và trả về
    return tble;
  }
 
componentWillUnmount() {
  clearInterval(this.timerID);
}
  Loadhinhanh = () => {
     var dshinh = this.state.phien.dshinhanh;
     if(dshinh == null)
         return;
     let ds = [];
     var x = dshinh.length % 3;
     if(x != 0){
      var n = 3 - x;
      for(var i = 0; i < n; i++){
        dshinh.push('./img/Noimg.png');
      }
     }
    var activeone = "carousel-item active";
    for(var i = 0; i < dshinh.length; i+=3){
      var hinh = (
        <div className={activeone}>
        <div className="col-xs-4 col-sm-4 col-md-4 multerimg">
        <img src = {dshinh[i]} />
        </div>
        <div className="col-xs-4 col-sm-4 col-md-4 multerimg">
        <img src = {dshinh[i+1]} />
        </div>
        <div className="col-xs-4 col-sm-4 col-md-4 multerimg">
        <img src = {dshinh[i+2]}  />
        </div>
      </div>
      );
      ds.push(hinh);
      activeone = "carousel-item";
    }
    return ds;
  }
  Loaddata = () => {
    var phien = this.state.phien;
    if (phien != null)
      return (
        <div className="col-md-12" style={{ border: '1px solid' }}>
          <div className="row" style={{ borderBottom: '1px solid' }}>
            <h1>{phien.tensp}</h1>
          </div>
          <div className="row" style={{ marginTop: '5px' }}>
            <div className="col-md-4">
              <img width="100%" id="zoom_05" src = {phien.dshinhanh[0]} data-zoom-image = {phien.dshinhanh[0]} />
            </div>
            <div className="col-md-4">
              Kết thúc trong:
              <h2 id="tgDauGia">{phien.thoigianconlai}</h2>
              <label for="sel1">chọn kích cỡ/màu sắc:</label>
              <select className="form-control" id="sel1" style={{ width: '60%' }}>
              {/* chỉnh sửa lại chỗ phát sinh danh sách loại sp */}
              {this.handleComboboxChange()}
              </select>
            </div>
            <div className="col-md-4">
              Giá thầu hiện tại:
            <h3>{phien.giathauthapnhat}k</h3>
              <div className="input-group">
                <div>
                  <button onClick = {this.handleButtonChange} className="btn btn-outline-secondary" type="button" name = "down">-</button>
                </div>
                <input id = "giathau" type="text" className="form-control input-number" value = {this.state.giainput+"K"}/>
                <div>
                  <button onClick = {this.handleButtonChange} className="btn btn-outline-secondary" type="button" name = "up">+</button>
                </div>
              </div>
              <button onClick = {this.handleButtonChange} type="button" name = "daugia" className="btn btn-primary btn-block" style={{ marginTop: '5px' }}>Đấu Giá</button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 multerimg" style={{ margin: '10px' }}>
              <div id="demo" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner no-padding">
                {/* phát sinh danh sách hình và hiệu úng click chọn */}
                  {this.Loadhinhanh()}
                  <a className="carousel-control-prev" href="#demo" data-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                  </a>
                  <a className="carousel-control-next " href="#demo" data-slide="next" style={{ marginRight: '13px' }}>
                    <span className="carousel-control-next-icon"></span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-7 multerimg text-center">
              <h5>{this.state.nguoithang}</h5>
            </div>
          </div>
          <div className="row" style={{ margin: '5px' }}>
            <h4>Danh sách đấu giá</h4>
            <br />
            {/* chỉnh lại cách hiển thị danh sách những người đấu giá */}
            <table className="table table-bordered" style={{ width: '100%' }}>
              <tr>
                <th>Người đấu giá</th>
                <th>Giá dự thầu</th>
                <th>Thời gian đấu</th>
              </tr>
              {this.Loaddsdaugia()}
            </table>
          </div>
          <div className="row">
          {/* hiển thị các thông tin liên quan đến sản phẩm hay của nhà sản xuất */}
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <Link className="nav-link active" data-toggle="tab" href="#home">Chi Tiết</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" data-toggle="tab" href="#menu1">Menu 1</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" data-toggle="tab" href="#menu2">Menu 2</Link>
              </li>
            </ul>

            <div className="tab-content">
              <div id="home" className="container tab-pane active"><br />
                <h3>HOME</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div id="menu1" className="container tab-pane fade"><br />
                <h3>Menu 1</h3>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
              <div id="menu2" className="container tab-pane fade"><br />
                <h3>Menu 2</h3>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <h3>Các sản phẩm cùng loại</h3>
          </div>
        </div>)
  }
  render() {
    return (
      <div style={{ padding: '0px 100px' }}>
        <Link onClick={this.handleLinkChange} style={{ cursor: 'pointer' }} className="text-primary">&lt;&lt; Quay lại đấu giá các sản phẩm khác</Link>
        {this.Loaddata()}
      </div>
    );
  }
}
