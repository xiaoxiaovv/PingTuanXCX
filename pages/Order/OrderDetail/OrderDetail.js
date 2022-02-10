// pages/Order/OrderDetail/OrderDetail.js
var config = require('./../../../config/index.js');
var URL = require('./../../../config/url.js');
var http = require('./../../../config/http.js');
const app = getApp();
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    tui:true,
    wuliuInfo: {
      orderSn: ""
    },
    orderno:true,
    top:{ 
      hidden1: false,
      hidden2: true,
      topText1: '待发货',
      topText2: '拼团成功，预计 48小时内发货',
      imgUrl:'../../../imgs/daifahuo.png',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var orderPendingIndex = options.index;
    var orderProductId = options.orderProductId;  //网单id
    var cOrderSn = options.cOrderSn;  //网单号
    this.setData({
      orderProductId: orderProductId,
      cOrderSn: cOrderSn,
      // orderPendingIndex: orderPendingIndex,
    })
    this.getOrderData()
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
      var price = (orderData.number * orderData.price).toFixed(2);
      console.error('!!!!!!!!!', price);
      this.setData({
        orderData: orderData,
        orderSn: orderData.orderSn,    //订单id
        totalPrice: price,
      },()=>{
        that.check()
      })
      console.log('address=======' + orderData.address)
    }).catch((err) => {
      console.log('订单详情接口调用失败')
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


  //拼团详情
  pinDetail: function () {
    wx.navigateTo({
      url: '/pages/Success/Success?orderSn=' + this.data.orderSn

    })
  },

  //复制
  onCopy: function () {
    var that = this;
    console.log("ok");
    wx.setClipboardData({
      data: that.data.orderSn,
    })
  },
  //打电话
  onTel: function () {
    wx.makePhoneCall({
      phoneNumber: '1760001305',
    })
  },
  //申请退款
  tuiKuan:function(){
    var that = this;
    wx.navigateTo({
      //带商品单号去售后页面
      url: '/pages/Order/OrderAftersale/OrderAftersale?cOrderSn=' + that.data.cOrderSn,
    })
  },
  check: function () {
    var that = this;
    //判断是否可退款 显示/隐藏申请退款按钮
    console.log(that.data.orderData)
    var orderData = that.data.orderData;
    console.log("判断是否可退款 显示/隐藏申请退款按钮")
    var orderRepairs = orderData.orderRepairs, //是否已退货
      canRepair = orderData.canRepair,  //是否可退货
      canSubmitRepaier = orderData.canSubmitRepaier //是否可提交退货
    if (orderRepairs) {
      //已退货 不显示申请退款
      console.log("已退货 不显示申请退款")
      that.data.tui = false;
      that.setData({
        tui: that.data.tui
      })
      console.log(that.data.tui)
    } else if (canRepair && canSubmitRepaier) {
      console.log("可退货 可提交退货")
      //可退货 可提交退货
      //校验订单是否可退款
      http(URL.checkTuiUrl, { cOrderSn: that.data.cOrderSn }).then((data) => {
        console.log("校验订单是否可退款")
        console.log(data)
        if (data.data.state) {
          console.log("可退款  显示申请退款")
          console.log(that.data.tui)
          console.log(data.data.state)
          //可退款  显示申请退款
          that.data.tui = true;
          that.setData({
            tui: that.data.tui
          })
        }
      })

    } else {
      //不可退
      that.data.tui = false;
      that.setData({
        tui: that.data.tui
      })
      console.log("不可退不可退不可退不可退不可退不可退不可退")
      console.log(that.data.tui)
    }

  }
})