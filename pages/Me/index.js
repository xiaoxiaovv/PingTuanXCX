// pages/Me/index.js
var app = getApp();
const URL = require('../../config/url.js');
const http = require('../../config/http.js');
Page({

  /**
   * 页面的初始数据 
   */ 
  data: { 
     load:true,
     view:{
      width: 30,
      height: 30,
     },
     isLogin:false,
     userInfo:{
       userName:'未登陆',
       userPhoto:'http://www.ehaier.com/mstatic/wd/v2/img/icons/ic_default_avatar.png',
       userGrade:'',
     },
     orderState:[
       
       {  
         'txt': '待付款', 
         'img': '/imgs/dfk.png',
         'id': '0',
         'num': 0,
       },{
         'txt': '待发货',
         'img':  '/imgs/dfh.png', 
         'id': '1',
         'num': 0,
       },{
         'txt': '待收货',
         'img': '/imgs/dsh.png',
         'id': '2',
         'num': 0,
       }
     ],
     myList:[
      // 我的收藏一期不做 二期开始放开 
      //  {
      //    'txt': '我的收藏',
      //    'img':  '../../../imgs/collection.png',
      //    'id': '0',
      //  },
       {
         'txt':  '退款/售后',
         'img':  '/imgs/maintenance.png',
         'id': '1',
       },{
         'txt': '地址管理',
         'img': '/imgs/address.png',
         'id': '2',
       }
       
     ],
     orderInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.token)
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
    
  },
  // 获取数量
  getOrderNum: function(){
     var that = this;
     http(URL.getUserMsg, {}, 'GET').then((res) => {
       if (res.success && res.data != null) {
         that.setData({
           userInfo: {
             imgUrl: res.data.avatarImageFileId,  //用户图像
             nickName: res.data.nickName,         //用户昵称
             userPhoto: res.data.userName,    //用户手机
             userGrade: '',
           },
           orderInfo: res.data.orderCount, 
         })
         if (res.data.orderCount){
           
           that.setData({
             orderState:[
               {
                 'txt': '待付款',
                 'img': '/imgs/dfk.png',
                 'id': '0',
                 num: res.data.orderCount.waitPay >= 999 ? '...' : res.data.orderCount.waitPay
               },
               {
                 'txt': '待发货',
                 'img': '/imgs/dfh.png',
                 'id': '1',
                 num: res.data.orderCount.waitShipping >= 999 ? '...' : res.data.orderCount.waitShipping
               }, {
                 'txt': '待收货',
                 'img': '/imgs/dsh.png',
                 'id': '2',
                 num: res.data.orderCount.waitReceipt >= 999 ? '...' : res.data.orderCount.waitReceipt
               }
             ]
           })
           for (var i = 0; i < that.data.orderState.length;i++){
             if (that.data.orderState[i].num<10){ //两位
               that.setData({
                 view:{width:30,height:30}
               })
               
             } else if (that.data.orderState[i].num >100){
               that.setData({
                 view: { width: 40, height: 40 }
               })
             } else if (that.data.orderState[i].num > 1000){
               that.setData({
                 view: { width: 50, height: 30 }
               })
             }
            }

         }
       }
     })
     console.log(that.data.orderState)
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
    var token = app.globalData.token;
    console.log(token)
    if (token && token.indexOf('#')>-1){
      that.setData({ isLogin : true});
      that.getOrderNum();
    }else{
      that.setData({ isLogin: false });
    }
   
  },
  goLogin:function(){
    wx.navigateTo({
      url: '/pages/common/commonLogin/commonLogin',
    })
  },
  // 收藏 售后 地址 客服

  goToDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var orderState = 5;
    var that = this;
    if (that.data.isLogin){
      if (id == 1) {
          wx.navigateTo({ // 售后退款
            url: '/pages/Order/Orderrefund/Orderrefund?orderState=' + orderState,
          })
        }else if(id == 2){
          wx.navigateTo({
            url: '/pages/Address/Address',
          })
        }
    }else{
      that.goLogin();
    }
   

  },
  // 待收货、待发货、待付款跳转
  goToOrderList:function(e){
    // 根据下标跳转页面
    var that = this;
    var orderState = e.currentTarget.dataset.index+1;
    if (that.data.isLogin){
        wx.navigateTo({
              url: '/pages/Order/MyOrder/MyOrder?index=' + orderState,
        });
    }else{
      that.goLogin();
    }
    
  },
  // 我的订单
  goMyOrder:function(){
    var orderState = 0;
    var that = this;
    if (that.data.isLogin){
      wx.navigateTo({
        url: '/pages/Order/MyOrder/MyOrder?index=' + orderState,
      })
    }else{
      that.goLogin();
    }
     
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

})