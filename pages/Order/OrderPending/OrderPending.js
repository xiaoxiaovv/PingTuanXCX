const app = getApp()

const config = require('../../../config/index.js');
const URL = require('../../../config/url.js');
const http = require('../../../config/http.js');

Page({  
 
  /**
   * 页面的初始数据  
   */
  data: {
    detailsBox:'',
    rederBottom:'',
    noBottom:'',
    footerClassName: app.globalData.isIphoneX ? 'footerClass' : '', //兼容iphonex
    wuliuInfo: {
      orderSn: ""
    },
    orderno:false,
    top: {
      hidden1: false,
      hidden2: true,
      topText1: '待收货',
      topText2: '物流运输中，请耐心等待',
      topText_2: '还剩余7天自动确认收货',
      imgUrl: '../../../imgs/daishouhuo.png',
      topText3: '已完成',
    }
  },
  //卖家处理详情
  sellerDetail:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/Order/Refunddetails/Refunddetails?orderProductId=' + thia.data.orderProductId,
    })
  },
  //再次购买
  shop:function(){
    wx.redirectTo({
      url: '/pages/Details/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var orderProductId = options.orderProductId;  //网单id
    var cOrderSn = options.cOrderSn;  //网单号 
    var cOrderId = options.cOrderId;  //拼团成功传参网单ID
    console.log("cOrderIdcOrderIdcOrderIdcOrderIdcOrderIdcOrderId")
    // console.log(options.cOrderId)
    this.setData({
      orderProductId: orderProductId,
      cOrderSn: cOrderSn,
      cOrderId: cOrderId
    })

    var id = options.id;
    if (id != null && id == 1) {  //已完成
      this.setData({
        'top.hidden1': true,
        'top.hidden2': false,
        newBorder: false,
        rederBottom:true,
        noBottom:false,
        detailsBox:false,
      })
    }else if(id!=null&&id==2){   //待退款
      this.setData({
        'top.hidden1': false,
        'top.hidden2': true,
        'top.topText1':'退款处理中',
        'top.topText2':'待卖家处理！',
        'top.topText_2': '',
        newBorder: true,
        rederBottom: true,
        noBottom:true,
        detailsBox: true,
      })
    }else {
      this.setData({
        'top.hidden1': false,
        'top.hidden2': true,
        newBorder: true,
        rederBottom:false,
        noBottom:true,
        detailsBox:false,
      })
    }
    this.getOrderData()
  },
  //确认收货
  confirmOrderProduct: function() {
    http(URL.confirmOrderProduct, {
      cOrderSn: this.data.cOrderSn,   //网单号
    }).then((data) => { 

    }).catch((err) => {

    })
    wx.redirectTo({
      url: '/pages/Order/OrderPending/OrderPending?id=1',
    })
  },
  //获取订单列表 
  getOrderData: function () {
    var that = this;
    //测试环境订单为空
    var cOrderId = 0;
    if (that.data.cOrderId){
      cOrderId = that.data.cOrderId
    }else{
      cOrderId = that.data.orderProductId
    }
    http(URL.orderDetailUrl, {
      cOrderId: cOrderId,
      // cOrderSn: this.data.cOrderSn,
    }).then((data) => {
      var orderData = data.data;
      this.setData({
        orderData: orderData,
        orderSn: orderData.orderSn,    //订单id
      })
      console.log('address=======' + orderData.address)
    }).catch((err) => {
      console.log('订单详情接口调用失败')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  //售后
  onSever: function() {
    var that = this;
    wx.navigateTo({
      //带商品单号去售后页面
      url: '/pages/Order/OrderAftersale/OrderAftersale?cOrderSn=' + that.data.wuliuInfo.cOrderSn,
    })
  },
  //查看物流
  chakan: function() { 
    console.log("123") 
    wx.navigateTo({
      url: '/pages/Order/OrderLogistics/OrderLogistics',
    })
  },
  //拼团详情
  pinDetail: function() {
    wx.navigateTo({
      url: '/pages/Success/Success?orderSn=' + this.data.orderSn,
    })
  },

  //复制
  onCopy: function() {
    var that = this;
    console.log("ok");
    wx.setClipboardData({
      data: that.data.wuliuInfo.orderSn,
    })
  },
  //打电话
  onTel: function() {
    wx.makePhoneCall({
      phoneNumber: this.orderData.phoneNumber,
    })
  }
})