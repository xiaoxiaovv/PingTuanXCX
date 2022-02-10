const app = getApp()

const config = require('./../../../config/index.js');
const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');

Page({
  data: {
    tui: true,
    tuiType: '类型',
    footerClass: app.globalData.isIphoneX ? 'bottom-content-phonex' : '',//iphonex
    num: 150,
    // selectStateData: {
    // },
    index2: 0,
    selectStateData2: {
      selectType: 'ReturnGoods',
      typeName: '收货状态',
      selectPerson: true,
      firstPerson: '未收到货',
      selectArea: false,
      list: ['未收到货', '不想要了', '退货退款']
    },
    index3: 0,
    selectStateData3: {
      selectType: 'refundReason',
      typeName: '退款原因',
      selectPerson: true,
      firstPerson: '请选择退款原因',
      selectArea: false,
      list: ['七天无理由', '大小尺寸', '颜色款式', '质量问题', '配送问题', '库存问题', '地址问题', '其他']
    },
    refundReason: '',
    refundType: '',
    ReturnGoods: ''
  },

  // 退货原因
  onRefundReasonChange: function (e) {
    var that = this;
    this.setData({
      index3: e.detail.value,
      refundReason: that.data.selectStateData3.list[e.detail.value]
    })
  },

  // 收货状态
  onReturnGoodsChange: function (e) {
    var that = this;
    this.setData({
      index2: e.detail.value,
      // ReturnGoods: that.data.selectStateData2.list[e.detail.value],
    })
  },

  myevent: function (e) {
    var that = this;
    const selectType = e.detail.selectType;
    // const tuiType = e.detail.firstPerson;

    // if (selectType === 'refundType') {
    //   this.setData({
    //     refundType: e.detail.firstPerson,
    //   })
    // }
    //退款状态
    if (selectType === 'ReturnGoods') {
      this.setData({
        ReturnGoods: e.detail.firstPerson
      })
    }
    //退款原因
    if (selectType === 'refundReason') {
      this.setData({
        refundReason: e.detail.firstPerson
      })
      console.log("退款原因退款原因退款原因")
      console.log(this.data.refundReason)
    }

    // if (tuiType == that.data.selectStateData3.list[0]){
    //   this.setData({
    //     id: 1
    //   })
    // }
    // if (tuiType == that.data.selectStateData3.list[1]) {
    //   this.setData({
    //     id: 2
    //   })
    // }
    // if (tuiType == that.data.selectStateData3.list[2]) {
    //   this.setData({
    //     id: 3
    //   })
    // }

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var cOrderSn = options.cOrderSn;  //获取网单号
    console.log(cOrderSn)
    that.setData({
      cOrderSn: cOrderSn
    })
    http(URL.tuiKuanUrl, { cOrderSn: that.data.cOrderSn }).then((data) => {
      console.log(data.data);
      var orderAmount = data.data.orderAmount;  //订单金额
      var orderType = data.data.orderType;    //退货类型
      that.setData({
        orderAmount: orderAmount,
        orderType: orderType
      })
    })
  },
  onShow: function () {
    var that = this;
    if (that.orderType == 2) {
      that.data.tuiType = '退货不退款';
      that.setData({
        tuiType: that.data.tuiType
      })
    } else {
      that.data.tuiType = '退款并退货';
      that.setData({
        tuiType: that.data.tuiType
      })
    }
  },
  //提交表单
  onSubmit: function (e) {
    var that = this;
    //校验订单
    if (!e.detail.value.evaContent) {
      wx.showToast({
        title: '请填写退款说明',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.refundReason) {
      wx.showToast({
        title: '请选择退款原因',
        icon: 'none',
        duration: 2000
      })
    }
    else {


      var cOrderSn = that.data.cOrderSn;
      http(URL.tuiSubUrl, { cOrderSn: cOrderSn, description: e.detail.value.evaContent, reason: that.data.refundReason, typeActual: that.data.orderType }).then((data) => {
        console.log(data.data)
        var state = data.data.state;
        var msg = data.data.message;
        var orderProductId = data.data.orderProductId;
        console.log(orderProductId + "orderProductIdorderProductIdorderProductIdorderProductId")
        if(state=="F"){
          //不可以申请售后
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          return false;
        }else{
          //可以申请售后
          wx.redirectTo({
            url: '/pages/Order/MyOrder/MyOrder',
          })
        }
        
      })

    }

  },
  onInput: function (e) {
    var that = this;
    // console.log(e.detail.cursor)
    var ynum = e.detail.cursor;
    that.data.num = 150 - ynum;
    that.setData({
      num: that.data.num
    })
    if (ynum == 150) {
      that.setData({
        num: 0
      })
    }
  }
});
