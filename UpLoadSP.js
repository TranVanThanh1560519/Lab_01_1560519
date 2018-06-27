class UpLoadSP extends React.Component{
    constructor(props){
    super(props);
    // các sự kiện kiểm tra dữ liệu nhập
    this.state = {
        tensanpham: '',
        soluong: 0,
        loaisanpham: '',
        dacta: '',
        buocnhaythoigian: 0,
        buocnhaygia: 0,
        thoigianmoiphien: 0,
        ngaybatdau: new Date().toISOString().slice(0,10),
        ngayketthuc: new Date().toISOString().slice(0,10),
        giobatdau: 0,
        gioketthuc: 0,
        hinhanh: null,
        trangthai: '',
        hinhdaidien: '',
        danhsachhinh: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitChange = this.handleSubmitChange.bind(this);
    this.handleListimgChange = this.handleListimgChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);

}

handleInputChange(e){
    var name = e.target.name;
    switch(name){
        case "tensanpham":
            this.setState({
                tensanpham: e.target.value
            })
            break;
        case "soluong":
            var ck = /^[0-9]+$/;
            if(ck.test(e.target.value) == false)
                return;
            this.setState({
                soluong: e.target.value
            })
            break;
        case "loaisanpham":
            this.setState({
                loaisanpham: e.target.value
            })
            break;
        case "dacta":
            this.setState({
                dacta: e.target.value
            })
            break;
        case "buocnhaythoigian":
            var ck = /^[0-9]+$/;
            if(ck.test(e.target.value) == false)
                return;
            this.setState({
                buocnhaythoigian: e.target.value
            })
            break;
        case "buocnhaygia":
            var ck = /^[0-9]+$/;
            if(ck.test(e.target.value) == false)
                return;
            this.setState({
                buocnhaygia: e.target.value
            })
            break;
        case "giobatdau":
            var ck = /^[0-9]+$/;
            if(ck.test(e.target.value) == false)
                return;
            this.setState({
                giobatdau: e.target.value
            })
            break;
        case "gioketthuc":
            var ck = /^[0-9]+$/;
            if(ck.test(e.target.value) == false)
                return;
            this.setState({
                gioketthuc: e.target.value
            })
            break;
        case "ngaybatdau":
            this.setState({
                ngaybatdau: e.target.value
            })
            break;
        case "ngayketthuc":
            this.setState({
                ngayketthuc: e.target.value
            })
            break;
        case "trangthai":
            this.setState({
                trangthai: e.target.value
            })
            break;
        case "thoigianmoiphien":
            var ck = /^[0-9]+$/;
            if(ck.test(e.target.value) == false)
                return;
            this.setState({
                thoigianmoiphien: e.target.value
            })
            break;
        case "hinhanh":
            // hiển thị danh sách vào list và hình đại điện được chọn từ list này
            var dshinh = [];
            var evt = e.target.files
            if(evt.length < 1){
                e.target.files = this.state.hinhanh;
                break;
            }
            document.getElementById('hinhdaidien').innerHTML = ("Hình Đại Diện: " + evt[0].name);                      
            for(var i = 0; i < evt.length; i++){
                dshinh.push(evt[i].name);
             }
            this.setState({
                 hinhanh: evt,
                 danhsachhinh: dshinh,
                 hinhdaidien: evt[0].name
            });
            break;
    }
}
handleListimgChange(){
    var ds = this.state.danhsachhinh;
    if(ds.length == 0){
        return;
    }     
    var opt = [];
    for(var i = 0; i < ds.length; i++){
        var option = (<option  value={ds[i]}>{ds[i]}</option>);      
        opt.push(option);
    }
    return(
        <select onClick = {this.handleSelectChange}  className="form-control" multiple style={{height: '100px'}}>
            {opt}
        </select>
        )
}
handleSelectChange(e){
    var evt = e.target.value;
    if(evt == "")
        return;
    document.getElementById('hinhdaidien').innerHTML = ("Hình Đại Diện: "+ evt);
    this.setState({
        hinhdaidien: evt
    })  
}
handleSubmitChange(){
    var formData = new FormData();
    var imagefile = document.querySelector('#hinhanh');
    for(var i = 0; i < imagefile.files.length; i++){
        formData.append("hinhanh", imagefile.files[i]);
    }
    formData.append("masanpham", "001");
    axios.post('/UpImgs', formData).then((result) =>{
        alert(result.data);
    })
}
render(){
    return(
        <div>
    <h3>Thông Tin Chung</h3>
        <div className="row">
          <div className="col-md-6">
            <form >
              <div className="form-group">
                <label >Tên Sản Phẩm:</label>
                <input onChange={this.handleInputChange} name="tensanpham" type="text" className="form-control"value = {this.state.tensanpham} />
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Số Lượng</span>
                </div>
                <input pattern={[0-9]} title="input only number" onChange={this.handleInputChange} name="soluong" type="number" className="form-control" value ={this.state.soluong}/>
              </div>
              <div className="input-group form-group dropdown">
                <div className="input-group-prepend">
                  <span className="input-group-text">Loại Sản Phẩm</span>
                </div>
                <input onChange={this.handleInputChange} name="loaisanpham" className="form-control dropdown-toggle" data-toggle="dropdown" value={this.state.loaisanpham}/>
                <div className="dropdown-menu" style={{width: '80%'}}>
                {/* load danh sách các loại sản phẩm sẵn có tại đây */}
                  <select className="dropdown-item" multiple style={{height: '100px'}}>
                    <option  value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                    <option  value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-6">
            <form action="/action_page.php">
              <div className="form-group">
                <label >Thông Tin Chi Tiết</label>
                <textarea onChange={this.handleInputChange} name="dacta" className="form-control" value={this.state.dacta}></textarea> 
              </div>
            </form>
          </div>     
        </div>
        <h3>Thông Tin Đấu Giá</h3>
        <div className="row">
          <div className="col-md-6">
            <form >
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Bước Nhảy Thời Gian</span>
                </div>
                <input onChange={this.handleInputChange} name="buocnhaythoigian" type="number" className="form-control" value={this.state.buocnhaythoigian}/>
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Bước Nhảy Giá</span>
                </div>
                <input onChange={this.handleInputChange} name="buocnhaygia" type="number" className="form-control" value = {this.state.buocnhaygia}/>
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Ngày Lên Lên Sàn</span>
                </div>
                <input onChange={this.handleInputChange} name="ngaybatdau" type="date" className="form-control" value = {this.state.ngaybatdau} />
                <input onChange={this.handleInputChange} name="ngayketthuc" type="date" className="form-control" value = {this.state.ngayketthuc} />
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Khung giờ Lên Sàn</span>
                </div>
                <input onChange={this.handleInputChange} name="giobatdau" type="number"  className="form-control" placeholder="Bắt đầu" value = {this.state.giobatdau}/>
                <input onChange={this.handleInputChange} name="gioketthuc" type="number" className="form-control" placeholder="kết thúc" value = {this.state.gioketthuc}/>
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Thời Gian Mỗi Phiên</span>
                </div>
                <input onChange={this.handleInputChange} name="thoigianmoiphien" type="number" className="form-control" placeholder="Phút" value = {this.state.thoigianmoiphien}/>
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">Trạng Thái</span>
                </div>
                {/* load tất cả các trạng thái từ data vào đây */}
                <select onChange={this.handleInputChange} name="trangthai" className="form-control" value={this.state.trangthai}>
                    <option  value="volvo">Không sẵn sàng</option>
                    <option value="saab">Sẵn Sàng</option>
                    <option value="opel">...</option>
                    <option value="audi">...</option>
                  </select>
              </div>
              <div className = "form-group">
              <button onClick = {this.handleSubmitChange} type="button" className="btn btn-success btn-block">Đăng Sản Phẩm</button>
              </div>
            </form>
          </div> 
          <div className="col-md-6">
          <form>
             <div className="form-group">
             <label for="email">Chọn Ảnh:</label>           
             <input onChange={this.handleInputChange} name="hinhanh" files={this.state.hinhanh} type="file" className="form-control-file border" accept="image/*"  id="hinhanh"  multiple />  
            </div>
            <div>
            <label id="hinhdaidien"></label>
        </div>
        <div className="form-group" id = "danhsachhinh">  
            {this.handleListimgChange()}
        </div>
        </form>
         </div>  
        </div>
        </div>
            )
    }
    
}

