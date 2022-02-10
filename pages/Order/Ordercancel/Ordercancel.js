// pages/Order/OrderDetail/OrderDetail.js
const app = getApp()

const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    newBorder:true,
    top: {
      hidden1: false,
      hidden2: true,
      topText1: '取消订单',
      imgUrl: '../../../imgs/quxiao.png',
    }
  },
  //查看物流
  chakan: function () {
    console.log("123")
    wx.navigateTo({
      url: '/pages/Order/OrderLogistics/OrderLogistics',
    })
  },
  //获取订单列表 
  getOrderData: function () {
    var that = this;
    //测试环境订单为空
    http(URL.orderDetailUrl, {
      cOrderId: this.data.orderProductId,
      cOrderSn: this.data.cOrderSn,
    }).then((data) => {
      var orderData = data.data;

      var totalPrice = (orderData.number * orderData.price).toFixed(2);
      this.setData({
        orderData: orderData,
        totalPrice: totalPrice,
      })
      console.log('address=======' + orderData.address);
      console.log('!!!!!!!!!!!!!!orderData', orderData);
    }).catch((err) => {
      console.log('订单详情接口调用失败')
    })
  },

  //再次购买
  shop:function(){
    wx.redirectTo({
      url: '/pages/Details/index/index',
    })
  },
  //复制
  onCopy: function () {
    var that = this;
    console.log("ok");
    wx.setClipboardData({
      data: that.data.wuliuInfo.orderSn,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderData()
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

  }
})