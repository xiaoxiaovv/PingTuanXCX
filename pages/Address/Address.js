// pages/Address/Address.js

const app = getApp()

const config = require('../../config/index.js');
const URL = require('./../../config/url.js');
const http = require('./../../config/http.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodizhi: false,
    load:true,
    homeId: 0,
    zhe: false,
    moren: 1,
    address: [],
    type: ""
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
    that.getData();
    var type = options.type?options.type:'';
   that.data.type = type;
    that.setData({
      type: that.data.type
    })
  },
  getData:function(){
      var that = this;
      http(URL.addressUrl,{}).then((data) => {
        console.log(data.data)
        const address = data.data;
        if(address.length==0){
          console.log("暂时没有收货地址")
          that.setData({
            nodizhi: true
          })
          // wx.showToast({
          //   title: '暂时没有收货地址',
          //   icon: 'none',
          //   duration: 1500
          // })
          return false;
        }
        address.sort(function (a, b) {
          return b.de - a.de
        })
        that.setData({
          address: address,
        })
      }).catch((err) => {
        console.log(err)
      })

      
  },
  onEdit:function(e){
    var that = this;
    var index = e.currentTarget.dataset.id;
    var address2 = that.data.address[index];
    // console.log(address2)
   
    wx.navigateTo({
      url: '/pages/EditAdd/EditAdd?address=' + JSON.stringify(address2) + "&type=" + that.data.type,
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
    var that = this;
    that.data.load = false;
    that.setData({
      load: that.data.load
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
  onDel:function(e){
    var that = this;
    var homeId2 = e.currentTarget.dataset.id;
    // console.log(homeId2);
    that.data.zhe = !that.data.zhe;
    that.setData({
      zhe: that.data.zhe,
      homeId: homeId2
    }); 
    
  },
  onSure:function(){
    var that =this;
    var homeId = that.data.homeId;
    
    that.data.zhe = !that.data.zhe;
    console.log(that.data.address[homeId])
    var id = that.data.address[homeId].id;
    http(URL.delAddUrl+"?m="+id, {},'POST').then((data) => {
      
      if(data.data){
        console.log("删除成功")
        that.data.address.splice(homeId, 1);
          that.getData();
          that.setData({
            address: that.data.address,
            zhe: that.data.zhe
          });
      }
    }).catch((err) => {
      console.log(err)
    })

    
    
  },
  onQuxiao:function(){
    this.data.zhe = !this.data.zhe;
    this.setData({
      zhe: this.data.zhe
    }); 
  },
  onAdd:function(){
    var that = this;
    //如果从结算页过来
    if (that.data.type){
      wx.redirectTo({
        url: './../Add/Add',
      })
    }else{
      wx.redirectTo({
        url: './../Add/Add',
        success: function (res) {
          console.log("ok");
          console.log(res)
        },
        fail: function (res) {
          console.log("fail")
        },
        complete: function (res) { },
      })
    }
    
  },
  //修改默认地址
  onMoren:function(e){
    var that = this;
    var n = e.currentTarget.dataset.num;
    console.log(n)
    //判断是否是默认
    
    //设置默认收货地址
    var id = that.data.address[n].id;
    
    http(URL.defaultAddUrl, { m: id}).then((data) => {
      
      if(data.data){
        console.log("默认设置成功");
        that.getData()
      }
      // that.data.address.sort(function (a, b) {
      //   return b.de - a.de
      // })
      // that.setData({
      //   address: that.data.address,
      // })
    })
    
    // wx.request({
    //   url: URL.defaultAddUrl, 
    //   data: {},
    //   header: {
    //     'content-type': 'application/json',
    //     'TokenAuthorization': 'Bearer761e4836-37ad-4ae9-a7a5-bb5d8bbfdb00203#wbAL7Y/8Pys/RUZhz5ItIQvVTG7yGkahnXtPeREXfI2E7qmUMjXCA/dH4wF9Nq1G'
    //   },
    //   method: 'get',
    //   success: function(res) {
    //     console.log("默认设置成功");
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
      
    
  },
  onSelect:function(e){
    var that = this;
    that.onMoren(e);
    console.log(that.data.address)
    var n = e.currentTarget.dataset.num;
    var num = that.data.address[n].id;
    if(that.data.type){  //如果是订单页
      http(URL.changeAddUrl, { addressId: num }).then((data) => {
        if (data.data) {
          wx.navigateBack({
            url: '/pages/Order/PutOrder/PutOrder',
          })
        }
      }).catch((err) => {
        console.log(err)
      })

      // wx.request({
      //   url: URL.,
      //   header: {
      //     'content-type': 'application/json',
      //     'TokenAuthorization': 'Bearer761e4836-37ad-4ae9-a7a5-bb5d8bbfdb00203#wbAL7Y/8Pys/RUZhz5ItIQvVTG7yGkahnXtPeREXfI2E7qmUMjXCA/dH4wF9Nq1G'
      //   },
      //   data: { },
      //   method: 'get',
      //   success: function(res) {
      //     console.log(res.data.data)
      //     console.log(res.data.message)
      //     if(res.data.data){
      //       wx.navigateBack({
      //         url: '/pages/Order/PutOrder/PutOrder',
      //       })
      //     }
          
      //   },
      //   fail: function(res) {
      //     console.log(res.data.data)
      //     console.log(res.data.message)
      //   },
      //   complete: function(res) {},
      // })
      
      // that.setData({
      //   type: ""
      // })

    }else{  //其他页面过来
        
    }
  }
})