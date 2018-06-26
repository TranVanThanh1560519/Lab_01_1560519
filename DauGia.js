// ------------------------class xử lí trang đấu giá
class DauGia extends React.Component {
  constructor(props) {
    super(props);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.Loaddata = this.Loaddata.bind(this);
    this.Loaddsdaugia = this.Loaddsdaugia.bind(this);
    this.Loadhinhanh = this.Loadhinhanh.bind(this);
    this.getDsDauGia = this.getDsDauGia.bind(this);
    //this.handleImgChange = this.handleImgChange.bind(this);
    this.handleComboboxChange = this.handleComboboxChange.bind(this);
    this.handleButtonChange = this.handleButtonChange.bind(this);
    this.handleCountTimeChange = this.handleCountTimeChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      phien: null,
      dsdaugia: [],
      dshinh: [],
      nguoithang: '',
      giatoithieu: 0,
      giainput: 0,
      buocnhaygia: 0,
      Imgs: [],
      timeserver: 0
    };
  }
  
  componentWillMount() {
    // lấy mã sản phẩn từ props và gọi lên server để lấy dữ liệu
     var maphien = this.props.maphien;
    // goi lên server lấy thông tin của phiên đấu giá này
    axios.get('http://localhost:777/daugia/' + maphien).then(result => {
      this.setState({
        phien: result.data.chitiet,
        giahientai: result.data.chitiet.giahientai,
        buocnhaygia: result.data.chitiet.chitietsanpham.buocnhaygia,
        giainput: result.data.chitiet.giahientai+result.data.chitiet.chitietsanpham.buocnhaygia, 
        timeserver: result.data.timeserver
      });
      
    }).then(() => {
      // tạo script hiệu ứng zoom ảnh khi dữ liệu đã sẵn sàng render thành công
      // khi render thành công thì đoạn script add thêm vào mới chạy được
      const script = document.createElement("script");
      script.src = "./script/imgzoom.js";
      script.async = true;
      document.body.appendChild(script);
      }
    )
    
    // gọi hàm lấy danh sách những người đấu giá sau mỗi 1s
    this.TimerID = setInterval(() => this.getDsDauGia(), 1000);
    // hàm đếm ngược thời gian đấu giá
    this.TimerID2 = setInterval(() => this.handleCountTimeChange(), 1000);
  }
  // hàm hiển thị thời gian đếm ngược
  handleTimeChange = (tgbatdau, tgdau) =>{
    var x = this.state.timeserver;
     var tgconlai = tgdau*1000 - (x - tgbatdau);
     if(tgconlai <= 0){
      clearInterval(this.TimerID2);
      return("...ending");
     }  
     var gio = Math.floor(tgconlai/(60*60*1000)) % 24;
     var phut = Math.floor(tgconlai/(60*1000)) % 60;
     var giay = Math.floor(tgconlai/(1000)) % 60;
     
    return(gio+":"+phut+":"+giay);
  }
  // hàm đồng bộ thời gian với server
  handleCountTimeChange = () =>{
    this.setState({
      timeserver: this.state.timeserver + 1000
    });
  }
  //  hàm khi ấn nút quay lại trang chủ
  handleLinkChange() {
    ReactDOM.render(<App />, document.getElementById('app'));
  }
// hàm nhấn các nút button tăng, giảm giá, đấu giá
  handleButtonChange(e){
    var name = e.target.name;
    switch(name){ 
      case "down":
          if(this.state.giainput == this.state.giahientai+this.state.buocnhaygia)
              break;
          this.state.giainput = this.state.giainput - this.state.buocnhaygia
          break;
      case "up":
          this.state.giainput = this.state.giainput + this.state.buocnhaygia
          break;
      case "daugia": 
          // gửi yêu cầu đấu giá lên server
          var giadau = this.state.giainput;
          if(giadau == "")
            return;
          axios.get('/daugiasanpham/'+giadau).then(result =>{
            if(result.data == "not yet login")
                  document.getElementById('id01').style.display='block';
          
             else{
               alert("đấu giá thành công !");
               //  cập nhập lại các thuộc tính và bảng danh sách đầu giá từ result
             }
              })
          break;
  }
}
  // hàm lấy các loại sản phẩm load vào combobox
  handleComboboxChange = () => {
    var dsloai = this.state.phien.chitietsanpham.danhsachloai;
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
    var maphien = this.state.phien.maphiendau;
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
 // hàm gọi khi React bị gỡ khỏi DOM
componentWillUnmount() {
  clearInterval(this.timerID);
  clearInterval(this.timerID2);
}
// hàm xử lý nhập giá đấu
handleInputChange = (e) =>{
    // var textinput = e.target.value;
    // if(!textinput.match(/[0-9]/))
    //     return;
    // var textinputlast;
    // var wait = setInterval(() =>{
    //   //textinput = e.target.value;
    //   this.setState({
    //     giainput: textinput
    //   });
    // }, 1000);
    // clearInterval(wait);
    
    
    //alert(textinput);
    
}
//hàm load danh sách hình
  Loadhinhanh = () => {
     var dshinh = this.state.phien.danhsachhinh.hinh;
     if(dshinh == null || dshinh.length == 0)
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
        <div className={activeone} style = {{height: '60px'}}>
        <div className="col-xs-4 col-sm-4 col-md-4 multerimg">
        <img  src = {dshinh[i]} />
        </div>
        <div className="col-xs-4 col-sm-4 col-md-4 multerimg">
        <img  src = {dshinh[i+1]} />
        </div>
        <div className="col-xs-4 col-sm-4 col-md-4 multerimg">
        <img  src = {dshinh[i+2]}  />
        </div>
      </div>
      );
      ds.push(hinh);
      activeone = "carousel-item";
    }
    return ds;
  }
  // hàm load thông tin sản phẩm
  Loaddata = () => {
    var phien = this.state.phien;
    if (phien != null){
      
      return (
        <div className="col-md-12" style={{ border: '1px solid' }}>
          <div className="row" style={{ borderBottom: '1px solid' }}>
            <h1>{phien.chitietsanpham.tensanpham}</h1>
          </div>
          <div className="row" style={{ marginTop: '5px' }}>
            <div className="col-md-4">
            {/* {phien.chitietsanpham.hinhdaidien} */}
              <img width="100%" height="300px" id="zoom_05" src = {phien.chitietsanpham.hinhdaidien}  data-zoom-image = {phien.chitietsanpham.hinhdaidien} />
            </div>
            <div className="col-md-4">
              Kết thúc trong:
              <h2 id="tgDauGia">{this.handleTimeChange(this.state.phien.thoigianbatdau, this.state.phien.thoigiandau)}</h2>
              <label for="sel1">chọn kích cỡ/màu sắc:</label>
              <select className="form-control" id="sel1" style={{ width: '60%' }}>
              {/* chỉnh sửa lại chỗ phát sinh danh sách loại sp */}
              {this.handleComboboxChange()}
              </select>
            </div>
            <div className="col-md-4">
              Giá thầu hiện tại:
            <h3>{phien.giahientai}k</h3>
              <div className="input-group">
                <div>
                  <button onClick = {this.handleButtonChange} className="btn btn-outline-secondary" type="button" name = "down">-</button>
                </div>
                <input id = "giathau" type="text" className="form-control input-number" onChange = {this.handleInputChange} value = {this.state.giainput+"K"}/>
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
                <Link className="nav-link" data-toggle="tab" href="#menu1">FQA</Link>
              </li>
            </ul>

            <div className="tab-content">
              <div id="home" className="container tab-pane active"><br />
                <h3>HOME</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div id="menu1" className="container tab-pane fade"><br />
                <h3>FQA</h3>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <h3>Các sản phẩm cùng loại</h3>
          </div>
        </div>)
    }
  }
  render() {
    return (
      <div style={{ padding: '0px 100px' }}>
        <Link onClick={this.handleLinkChange} className="text-primary">&lt;&lt; Quay lại đấu giá các sản phẩm khác</Link>
        {this.Loaddata()}
      </div>
      
    );
  }
}






















// phân tích đoạn text này
// class DauGia extends React.Component {
//   constructor(props) {
//   super(props);
//   this.handleChange = this.handleChange.bind(this);
//    this.state = {
//      phien: null
//    };
//   }
//     componentDidMount() {
//     // lấy mã sản phẩn từ props và gọi lên server để lấy dữ liệu
//       var maphien = 1;
//     // // goi lên server lấy thông tin của phiên đấu giá này
//     axios.get('http://localhost:777/daugia/' + maphien).then(result => {
//       alert("Didmount" + "   "+result.data.chitiet.chitietsanpham.tensanpham);
//       this.setState({
//         phien: result.data.chitiet
//         //dshinh: result.data.chitiet.danhsachhinh.hinh,
//         // giahientai: result.data.chitiet.giahientai,
//         // buocnhaygia: result.data.chitiet.chitietsanpham.buocnhaygia,
//         // giainput: result.data.chitiet.giahientai+result.data.chitiet.chitietsanpham.buocnhaygia, 
//         // timeserver: result.data.timeserver
//       });
//     })
    
    
//     //alert(this.state.phien.chitietsanpham.hinhdaidien);
//   }
//   handleChange = () =>{
//      var x = this.state.phien;
//      alert(x);
//      if(x != null){
//       const script = document.createElement("script");
//       script.src = "./script/imgzoom.js";
//       script.async = true;
//       document.body.appendChild(script);
//     x = "./img/1/iphonex.jpg";
//     return(
//       <div className = "row">
//       <div className = "col-3">
//       <img width="100%" id="zoom_05" src = {x} data-zoom-image = "./img/1/iphonex.jpg" />
//       </div>
//       </div>
//     );
//   }
//   }
//   render(){
//     //var x = this.state.phien;
//      //if(x != null){
     
//    //  }
//     // else
//          //alert("render null");
//          return(
//     <div>
//       {this.handleChange()}
//     </div>
//          );
//   }
// }
