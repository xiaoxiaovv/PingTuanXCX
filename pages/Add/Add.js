// pages/Add/Add.js

const app = getApp()

const config = require('../../config/index.js');
const URL = require('./../../config/url.js');
const http = require('./../../config/http.js');

var nAdd = {};//存放新增地址
Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:true,
    //7.19
    type:"",
    //7.18
    regionName: "选择省市区街道",
    regionList: [],
    r_nav: "",
    regionLevel: 1,
    reg_show: "hide",
    mask: "hide",
    show: "",
    address:[],
    setMo: true,
    mo: 1
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //判断网络和加载中
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        networkType === 'none' ? networkType = true : networkType = false
        if (networkType == true) {
          that.data.load = false; //无网络不显示加载中
          that.setData({
            load: that.data.load
          })
        }
        that.setData({
          networkType
        })
      }
    })
    that.data.type = options.type;
    that.setData({
      type: that.data.type,
    })
    console.log(that.data.type)
  },
  //请求省市区县街道数据7.18日
  getTownship: function (id, nType) {
    var that = this;
    //请求线上的街道数据  
    http(URL.diquUrl, { parentId: id, type: nType }).then((data) => {
      // console.log(data.data)
      const regionList = data.data;
      that.setData({
        regionList
      })
      // console.log(that.data.regionList)
    })
  

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.load = false;
    this.setData({
      load: this.data.load
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  
  //7.18
  //弹出提示
  onToast:function(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  
  // 设置默认地址
  onSet:function(){
    this.data.setMo = !this.data.setMo;
    this.setData({
      setMo: this.data.setMo
    });
    if(this.data.setMo){
      // http(URL.defaultAddUrl,{m:})
      // this.data.mo = 1;
      this.setData({
        mo: 1
      })
    }else{
      // this.data.mo = 0;
      this.setData({
        mo: 0
      })
    }
    // this.setData({
    //   mo: this.data.mo
    // })
    
  },

  //7.18日
  CityChange: function (e) { //省市区点击事件       
    var name = e.target.dataset.name;
    var id = e.target.dataset.id;
    console.log(id,name)
    this.setData({
      cyCurrent: id
    })
    var level = this.data.regionLevel;
    var cityComplete = false;
    if (level == 1) {
      this.getTownship(id, 1);
      this.setData({
        provinceId: id,
        province: name,
        regionLevel: 2
      })
      nAdd.pi = this.data.provinceId; //省ID
    }
    else if (level == 2) {
      this.getTownship(id, 2);
      this.setData({
        cityId: id,
        city: name,
        regionLevel: 3
      })
      nAdd.ci = this.data.cityId; //市ID
    } 
    else if (level == 3) {
      this.getTownship(id, 3);
      this.setData({
        regionId: id,
        region: name,
        
        regionLevel: 4
      })
      nAdd.ri = this.data.regionId; //区县ID
    }
    else if (level == 4) {
      cityComplete = true;
      this.setData({
        streetId: id,
        street: name,
        
      })
      nAdd.si = this.data.streetId; //街道ID
    }
    this.setData({
      r_nav: this.data.province + " " + this.data.city + " " + this.data.region + " " + this.data.street
    })
    //街道加载完成，退出选择，绑定数据  
    if (cityComplete) {
      this.setData({
        c_black: "c_black",
        regionName: this.data.r_nav
      })
      //记录用户的省市区信息  
      wx.setStorageSync('location', {
        'region': this.data.r_nav,
        'provinceId': this.data.provinceId,
        'province': this.data.province,
        'cityId': this.data.cityId,
        'city': this.data.city,
        'districtId': this.data.regionId,
        'district': this.data.region,
        'townshipId': this.data.streetId,
        'street': this.data.street
      })
      //关闭区域选择
      this.r_close()
    }
  },

  //后退选择
  backRegion: function () { //后退选择 
    var level = this.data.regionLevel;
    var provinceId = this.data.provinceId;
    var cityId = this.data.cityId;
    
    if (level == 1) {
      this.getTownship(0, 0)
      this.setData({
        province: "",
        regionLevel: 1
      })
    }
    else if (level == 2) {
      this.getTownship(0, 0)
      this.setData({
        province: "",
        regionLevel: 1
      })
    }
    else if (level == 3) {
      this.getTownship(provinceId, 1)
      this.setData({
        city: "",
        regionLevel: 2
      })
    }
    else if (level == 4) {
      this.getTownship(cityId, 2)
      this.setData({
        region: "",
        street: "",
        regionLevel: 3
      })
    }
    this.setData({
      r_nav: this.data.province + " " + this.data.city + " " + this.data.region + " " + this.data.street,
      city: this.data.city
    })
  },
  //设置收货区域
  setRegion: function () { 
  var that = this;
    http(URL.diquUrl, { parentId: 0, type:0}).then((data) => {
      const regionList = data.data;
      that.setData({
        regionList
      })
    })
    that.setData({
      reg_show: "show",
      mask: "",
      regionList: that.data.regionList,
      regionLevel: 1,
      r_nav: "",
      province: "",
      city: "",
      region: "",
      street: "",
    })
    var _this = this;
    var animation = wx.createAnimation({
      duration: 300,
    })
    animation.bottom(0).step();//修改透明度,放大  
    this.setData({
      spreakingAnimation: animation.export()
    })
  },

  //关闭遮罩
  r_close: function () {
    var _this = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-in-out'
    })
    animation.bottom(-360).step();//修改透明度,放大  
    this.setData({
      spreakingAnimation: animation.export(),
      mask: "hide",
      reg_show: "hide"
    })
  },

  // 保存地址
  onSubmit: function (e) {
    var that = this;
    // 验证
    var param = e.detail.value;
    if (param.co == "") {
      that.onToast("收货人不能为空！")
      return;
    }
    if (param.mo == "") {
      that.onToast("手机号不能为空！")

      return;
    }
    var partten = /^0?(13[0-9]|15[0-9]|18[0-9]|17[0-9]|14[0-9])[0-9]{8}$/;
    if (!partten.test(param.mo.replace(/[ ]/g, ""))) {
      that.onToast("手机号码错误！");
      return false
    }

    if (param.regionName == "选择省市区街道" || param.regionName == "") {
      that.onToast("请选择省市区街道！")
      return;
    }
    if (param.ar == "") {
      that.onToast("详细地址不能为空！")
      return;
    }
    if (param.ar.length < 5) {
      that.onToast("详细地址不能少于5个字！")
      return;
    }

    nAdd.ar = e.detail.value.ar, //收货地址
    nAdd.co = e.detail.value.co,  //收货人
    nAdd.mo = e.detail.value.mo,  //手机号
    nAdd.regionName = e.detail.value.regionName,  //街道
    nAdd.moren = that.data.mo;  //是否默认

    console.log(nAdd)
    // 新增地址
    http(URL.newAddUrl,{
      ar: nAdd.ar, ci: nAdd.ci, co: nAdd.co, de: nAdd.moren, mo: nAdd.mo, ph: "", pi: nAdd.pi, ri: nAdd.ri,   rn: nAdd.regionName, si: nAdd.si, zc: "", 
    },'POST').then((data) => {
      console.log("dadadadadadaddadadad")
      console.log(data);
      if (that.data.type) {//从订单页过来跳转订单页
        wx.navigateBack({
          url: './../Order/PutOrder/PutOrder',
        })
        that.data.type = "";
        that.setData({
          type: that.data.type
        })
      } else {  //从收货地址列表页过来跳转收货地址页
        wx.redirectTo({
          url: './../Address/Address',
        })
      }
    })

    // wx.request({
    //   url: URL.newAddUrl,
    //   header:{
    //     'content-type': 'application/json',
    //     'TokenAuthorization': 'Bearer761e4836-37ad-4ae9-a7a5-bb5d8bbfdb00203#wbAL7Y/8Pys/RUZhz5ItIZhpTb//ftmFWQgkpx1sAak1DnkO39DMM90uhHT2bQ2i'
    //   },
    //   data: {
    //     ar: nAdd.ar, ci: nAdd.ci, ph: "", pi: nAdd.pi, ri: nAdd.ri, co: nAdd.co, mo: nAdd.mo, rn: nAdd.regionName, si: nAdd.si, zc: "", de: nAdd.moren 
    //   },
    //   method: 'post',
    //   success: function(res){
    //     console.log(res.data.data); 
    //     // 跳转
    //     if (that.data.type == "orderCommit") {//从订单页过来跳转订单页
    //       wx.navigateBack({
    //         url: './../Order/PutOrder/PutOrder',

    //       })
    //       that.data.type = "";
    //       that.setData({
    //         type: that.data.type
    //       })
    //     } else {  //从收货地址列表页过来跳转收货地址页
    //       wx.navigateTo({
    //         url: './../Address/Address',
    //       })
    //     }
    //   },
    //   fail: function(res){
    //     console.log(res.data.message)
    //   }
    // })
    

  }
})