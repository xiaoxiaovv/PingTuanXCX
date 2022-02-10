const app = getApp()

const config = require('./../../../config/index.js');
const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    orderno: true,
    top: {
      hidden1: true,
      hidden2: false,
      topText3: '待付款',
      imgUrl:'../../../imgs/daifukuan.png'
    }
  },
  //获取订单详情
  getOrderData: function () {
    var that = this;
    //测试环境订单为空
    http(URL.orderDetailUrl, {
      cOrderId: this.data.orderProductId,
      cOrderSn: this.data.cOrderSn,
    }).then((data) => {
      var orderData = data.data;
      this.setData({
        orderData: orderData,
      })
      console.log('address=======' + orderData.address)
    }).catch((err) => {
      console.log('订单详情接口调用失败')
    })
  },

  //取消订单
  cancelOrder: function () {
    http(URL.cancelOrder, {
      cancelFlag: this.data.cancelFlag,     //取消标志
      orderId: this.data.orderId,     //订单ID
    }).then((res) => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderProductId = options.orderProductId;
    var cOrderSn = options.cOrderSn;
    this.setData({
      orderProductId: orderProductId,
      cOrderSn: cOrderSn,
    })
    console.log('orderProductId=======' + orderProductId + '     cOrderSn========' + cOrderSn);
    this.getOrderData();
    var that = this;
    //补零函数
    function addZero(num) {
      return num < 10 ? '0' + num : num;
    }
    //倒计时
    var nTime = new Date();
      // sTime = new Date(that.data.tuaninfo.eTime);
    var ctime = 2559696;   //2559696;时间差

    if (ctime <= 0) {
      return 0;
      clearInterval(interval);

    }
    function downTime() {
      var hours1 = Math.floor(ctime / 1000 / 60 / 60),
        minutes1 = Math.floor(ctime / 1000 / 60),
        seconds1 = Math.floor(ctime / 1000 % 60);

      that.setData({
        hours: addZero(hours1),
        minutes: addZero(minutes1),
        seconds: addZero(seconds1)
      });
      ctime -= 1000;

    };
    downTime();
    var interval = setInterval(downTime, 1000);
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

  },

  //去支付
  goPay:function(){
    wx.navigateTo({
      url: '/pages/Order/PutOrder/PutOrder?orderProductId=' + this.data.orderProductId + '&cOrderSn=' + this.data.cOrderSn+'&type=2',
    })
  }
})