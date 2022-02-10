
const app = getApp()

const config = require('./../../../config/index.js');
const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOnly:false,
    canRepairTxt:'申请退款',
    activityId: 0,
    tui: true,
    orderDetail_box: true,
    dan_du: true,
    pin_tuan: true,
    // orderPindingText:'',   //‘确认收货’/‘已签收’
    // orderPindingNum: '',     //‘确认收货’/‘已签收’标志
    isbtn: false,
    orderSn: '',
    orderDetail_box: true,
    dan_du: true,
    pin_tuan: true,
    detailsBox: '',
    orderDetail: true,
    orderPinding: true,
    orderPayable: true,
    orderCancel: true,
    top: {},
    wuliuInfo: {},
    address: '',
    rederBottom: false, //‘确认收货’/‘已签收’显示隐藏
    rederAgain: false,
    noBottom: true, //'再次购买'显示隐藏
    footerClass: app.globalData.isIphoneX ? 'footerClass' : '',
  },
  //时间戳转换成时间
  myTime: function (timestamp) {   //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var date,str;
    if (!isNaN(parseInt(timestamp))&&(timestamp.toString().length == 10 || timestamp.toString().length == 13)){
      if (timestamp.toString().length == 10) {
        date = new Date(timestamp * 1000);
      } else  {
        date = new Date(timestamp);
      }
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      str = Y + M + D + h + m + s;
    } else if (timestamp==null){
      str = '';
    }else{
      str = timestamp;
    }
    return str;
  },
  //调取物流接口
  getOrderTrack: function () {
    var that = this;
    http(URL.orderTrackUrl, {
      orderSn: that.data.orderSn,
    }).then((data) => {
      console.log(data)
      var wuliuInfo = data.data;
      that.setData({
        wuliuInfo: wuliuInfo,
      })
    }).catch((err) => {
      console.log('物流接口调用失败')
    })
  },
  goShop:function(){
    wx.redirectTo({
      url: '/pages/Details/index/index?productId=' + this.data.productId,
    })
  },
  //获取订单详情 
  getOrderData: function () {
    var that = this;

    console.log(that.data.cOrderId)
   
      http(URL.orderDetailUrl, {
        cOrderId: this.data.cOrderId,
        cOrderSn: this.data.cOrderSn,
      }).then((data) => {
        var orderData = data.data;
        var price = (orderData.number * orderData.price).toFixed(2); //总价格
        var lessShipTime = this.myTime(orderData.lessShipTime);   //发货时间
        var payTime = this.myTime(orderData.payTime);    //拼单时间
        that.setData({
          canRepairTxt:'申请退款',
          activityId:orderData.productId,
          orderData: orderData,
          orderProductId: orderData.orderProductId,
          orderSn: orderData.orderSn, //订单号
          orderShowStatus: orderData.orderShowStatus, //订单状态
          orderId: orderData.orderId, //订单id
          address: orderData.regionName + ' ' + orderData.address,
          price: price,
          canConfirm: orderData.canConfirm, //是否可确认收货
          canClickConfirm: orderData.canClickConfirm,    //是否可点击确认收货
          orderRepairs: orderData.orderRepairs, //是否已经退货
          productId: orderData.productId,    //商品ID
          payTime: payTime,  //拼单时间
          lessShipTime: lessShipTime,  //发货时间  
          phoneNumber: orderData.phoneNumber,  //商家电话 
          orderRepairHandleStatus: orderData.orderRepairHandleStatus,  //退款处理状态（用于用户展示）
          isbtn: true,
          status: orderData.groupbuyStatus
        }, () => {
          that.getOrderTrack();
          that.check()
          console.log("打印打印打印打印打印打印打印打印")
          console.log(that.data.status)
        })
        console.log('this.data.payTime======' + this.data.payTime)
        var str = that.data.orderData.groupbuyStatus; //0:初始 1:待拼团 2:拼团成功 3:拼团失败
        //8.1
        
        switch (this.data.orderShowStatus) {
          //1 待付款，2 已取消，3 待发货，4 待收货，5 已完成(已签收)，6 退款申请中
          case 1:
            that.setData({
              orderPayable: false,
              orderno: true,
              top: {
                hidden1: true,
                hidden2: false,
                topText3: '待付款',
                imgUrl: '../../../imgs/daifukuan.png'
              },
            })
            // this.getInterval();
            break;
          case 2:
            that.setData({
              orderCancel: false,
              orderno: true,
              newBorder: true,
              top: {
                hidden1: false,
                hidden2: true,
                topText1: '订单已取消',
                imgUrl: '../../../imgs/quxiao.png',
              },
            })
            // this.getInterval();
            break;
          case 3:
            that.setData({
              orderDetail: false,
              orderno: true,
              top: {
                hidden1: false,
                hidden2: true,
                topText1: '待发货',
                topText2: '拼团成功,预计48小时内发货',
                imgUrl: '../../../imgs/daifahuo.png',
              },
            })
            if (str == 3) { //拼团失败
              that.setData({
                orderDetail: false,
                orderno: true,
                'top.topText2': '等待拼团，快邀请小伙伴参团吧',
                pin_tuan: true,
                dan_du: true,
              })
            }
           else if (str != 0 && str != 1 && str != 2 && str != 3) { //单独购买
              that.setData({
                'top.topText2': '预计48小时内发货',
                orderDetail_box: true,
                pin_tuan: true,
                dan_du: false,
                isOnly: false,
              })
              if(that.data.orderData.orderRepairs){
                  that.setData({isOnly: true,})
              }
              
              console.log(this.data)
            } else if (str == 1) { //待拼团
              that.setData({
                'top.topText2': '等待拼团，快邀请小伙伴参团吧',
                orderDetail_box: false,
                pin_tuan: false,
                dan_du: true,
                isOnly: false,
                tui: true,
              })
              console.log(this.data)
            }
            else {
              that.setData({
                orderDetail_box: false,
                pin_tuan: false,
                dan_du: true,
              })
            }
            
            console.log('orderDetail_box=====' + this.data.orderDetail_box)
            console.log('str=====' + str)
            break;
          case 4:
          that.setData({
            newBorder: false,
            orderPinding: false,
            top: {
              hidden1: false,
              hidden2: true,
              topText1: '待收货',
              topText2: '物流运输中，请耐心等待',
              topText_2: '',
              imgUrl: '../../../imgs/daishouhuo.png',
              topText3: '正在签收订单',
            },
            detailsBox: false,
            rederBottom: false,
            rederAgain:true,
            noBottom: true,
          })
          if(that.data.canClickConfirm == false){
            that.setData({
              'top.hidden1': true,
              'top.hidden2': false,
              rederBottom: false,
              rederAgain:true,
              noBottom: false,
            })
          }
            break;
          case 5:
          //  if (this.data.canConfirm == false && this.data.canClickConfirm == false) {
            that.setData({
              orderPinding: false,
              top: {
                hidden1: false,
                hidden2: true,
                topText1: '已签收',
                topText2: '感谢您的签收，祝您生活愉快！',
                topText_2: '',
                imgUrl: '../../../imgs/shop_ok.png',
                topText3: '',
              },
              newBorder: false,
              rederBottom: true,
              rederAgain:false,
              noBottom: false,
              detailsBox: false,
            })
            console.log('5555555')
          //  }
            break;
          case 6:
            var strTxt = '';
            switch(that.data.orderRepairHandleStatus){
              case 1:
              strTxt = '审核中';
              break;
              case 2:
              strTxt = '进行中';
              break;
              case 3:
              strTxt = '受理完成';
              break;
              case 4:
              strTxt = '已完结';
              break;
              case 5:
              strTxt = '已驳回';
              break;
              case 6:
              strTxt = '已终止';
              break;
              case 7:
              strTxt = '线下已退款';
              break;
              case 8:
              strTxt = '等待确认终止';
              break;
            }
            that.setData({
              orderPinding: false,
              top: {
                hidden1: true,
                hidden2: false,
                topText1: '',
                topText2: '',
                topText_2: '',
                imgUrl: '../../../imgs/daishouhuo.png',
                topText3: strTxt,
              },
              dan_du:true,
              pin_tuan:false,
              newBorder: true,
              rederBottom: true,
              rederAgain:true,
              noBottom: true,
              detailsBox: true,
              isOnly:false,
            })
            console.log(that.data)
            console.log('zai dai ')
            // if (this.data.orderRepairs) { //退款完成
            //   this.setData({
            //     'top.hidden1': true,
            //     'top.hidden2': false,
            //   })
            // }
            if (str != 0 && str != 1 && str != 2 && str != 3) { //单独购买
              that.setData({
                orderDetail_box: true,
                pin_tuan: true,
                dan_du: false,
                isOnly: true,
              })
            }
            break;
        }
        console.log('address=======' + orderData.address)
      }).catch((err) => {
        console.log('订单详情接口调用失败')
      })
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏转发
    var cOrderId = options.cOrderId;
    var cOrderSn = options.cOrderSn;
    this.setData({
      cOrderId: cOrderId,
      cOrderSn: cOrderSn,
    })
    // this.getOrderData();

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
    this.getOrderData();
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

  //确认收货
  confirmOrderProduct: function () {
    var that = this;
    wx.showModal({
      //title: '取消订单提示',
      content: '“确认收货”将代表您已收到所购商品！',
      success: function (res) {
        if (res.confirm) {
          http(URL.confirmOrderProduct, {
            cOrderSn: that.data.cOrderSn, //网单号
          }).then((res) => {
            that.setData({
              orderDetail: true,
              orderPinding: true,
              orderPayable: true,
              orderCancel: true,
              rederBottom: false,
              rederAgain:true,
              noBottom: false,
            }, () => {
              that.getOrderData();
            })
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  //倒计时
  getInterval: function () {
    var that = this;
    //补零函数
    function addZero(num) {
      return num < 10 ? '0' + num : num;
    }
    //倒计时
    var nTime = new Date();
    // sTime = new Date(that.data.tuaninfo.eTime);
    var ctime = 2559696; //2559696;时间差

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
      phoneNumber: this.data.phoneNumber,
    })
  },
  //申请退款
  tuiKuan: function () {
    var that = this;
    wx.navigateTo({
      //带商品单号去售后页面
      url: '/pages/Order/OrderAftersale/OrderAftersale?cOrderSn=' + that.data.cOrderSn+"&cOrderId="+that.data.cOrderId,
    })
  },
  //取消订单
  cancelOrder: function () {
    var that = this;
    http(URL.cancelOrder, {
      cancelFlag: 'mstroe', //取消标志
      orderId: this.data.orderId, //订单ID
      orderSn: this.data.orderSn, //订单号
    }).then((res) => {
      that.setData({
        orderDetail: true,
        orderPinding: true,
        orderPayable: true,
        orderCancel: true,
      },()=>{
        that.getOrderData();
      })
    })
   

  },
  //去支付
  goPay: function () {
    var orderMsg = {
      openid: app.globalData.openId,
      orderSn: this.data.orderSn,
    }
    var that = this;
    this.setData({ isbtn: false },()=>{
      http(URL.getOrderIsPayment, { orderSn: this.data.orderSn }, 'GET')
            .then((res) => {
              if (res.success && res.data) {
                // 微信支付
                http(URL.getWeChatPayment, orderMsg, 'GET')
                  .then((res) => {
                    console.log(res)

                    if (res.success && res.data != null) {

                      // 调微信支付
                      wx.requestPayment({
                        'appId': 'wx3d7103b9022e7938',
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.package,
                        'signType': res.data.signType,
                        'paySign': res.data.paySign,
                        'success': function (res) {
                          if (res.errMsg == 'requestPayment:ok') {
                            //跳转到开团成功
                            wx.showToast({
                              title: '支付成功',
                              icon: 'success', // none 不展示icon
                               duration: 1000
                            })
                            that.setData({ isbtn: true });
                            console.log(that.data.orderData)
                            if (that.data.orderData.groupbuyStatus == null) {
                              var num = 2;
                              wx.redirectTo({
                                url: '/pages/Order/MyOrder/MyOrder?index=' + num,
                              })
                            } else {
                              wx.redirectTo({
                                url: '/pages/Success/Success?orderSn=' + that.data.orderSn,
                              })
                            }

                          }

                        },
                        'fail': function (res) { // 1. 支付失败 requestPayment:fail (detail message) 
                          // 不跳转 给出提示

                          console.log(res)
                          var orderState = 0;
                          if (res.errMsg == 'requestPayment:fail cancel') { //取消支付
                            wx.showToast({
                              title: '取消支付',
                              icon: 'none', // none 不展示icon
                              duration: 1000
                            })
                            that.setData({ isbtn: true });
                          } else {
                            that.setData({ isbtn: false });
                            // 支付失败
                            wx.showModal({
                              title: '支付失败,请重新支付',
                              content: res.message,
                              showCancel: false,
                              confirmText: '确定',
                              success: function (res) {
                                if (res.confirm) {
                                  that.setData({ isbtn: true });
                                  console.log('用户点击了“确定”')
                                }
                              }
                            })
                          }
                        }
                      })
                    } else {
                      
                      that.setData({ isbtn: false });
                      wx.showModal({
                      // title: '提示',
                        content: res.message,
                        showCancel: false,
                        confirmText: '确定',
                        success: function (res) {
                          if (res.confirm) {
                            that.setData({ isbtn: true });
                            console.log('用户点击了“确定”')
                          }
                        }
                      })
                    }
                  })
              } else {
                that.setData({ isbtn: false });
                wx.showModal({
                //  title: '提示',
                  content: '此订单已经过期，请重新下单',
                  showCancel: false,
                  confirmText: '确定',
                  success: function (res) {
                    if (res.confirm) {
                      that.setData({ isbtn: true });
                      console.log('用户点击了“确定”')
                    }
                  }
                })
                
              }
            })
    });
  },
  //售后
  onSever: function () {
    var that = this;
    if(this.data.orderData.canSubmitRepaier == false ){
      wx.showModal({
        // title: '支付失败,请重新支付',
         content: '您已申请售后，等待商家处理，请耐心等待',
         showCancel: false,
         confirmText: '确定',
         success: function (res) {
           if (res.confirm) {
             that.setData({ isbtn: true });
             console.log('用户点击了“确定”')
           }
         }
       })
    }else{
      wx.navigateTo({
        //带商品单号去售后页面
        url: '/pages/Order/OrderAftersale/OrderAftersale?cOrderSn=' + that.data.cOrderSn,
      })
     
    }
   
  },
  //查看物流 
  chakan: function () {
    console.log("123")
    var orderSn = this.data.orderSn;
    console.log(orderSn)
    wx.navigateTo({
      url: '/pages/Order/OrderLogistics/OrderLogistics?orderSn=' + orderSn + '&address=' + this.data.address,
    })
  },
  //卖家处理详情
  sellerDetail: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/Order/Refunddetails/Refunddetails?orderProductId=' + that.data.orderProductId,
    })
  },
  goDetail:function(){
    var orderProductId = this.data.orderData.orderProductId?this.data.orderData.orderProductId:0;
    wx.navigateTo({
      url: '/pages/Order/Refunddetails/Refunddetails?orderProductId=' + orderProductId ,
    })
  },
  //再次购买
  shop: function () {
    wx.redirectTo({
      url: '/pages/Details/index/index?productId=' + this.data.productId,
    })
  },
  check: function () {
    var that = this;
    
   // this.data.orderShowStatus 3 代发货  that.data.orderData.groupbuyStatus 2拼团中
    //判断是否可退款 显示/隐藏申请退款按钮
    console.log(that.data.orderData)
    var orderData = that.data.orderData;
    console.log("判断是否可退款 显示/隐藏申请退款按钮")
    var orderRepairs = orderData.orderRepairs, //是否已退货
      canRepair = orderData.canRepair,  //是否可退货
      canSubmitRepaier = orderData.canSubmitRepaier;//是否可提交退货

    if (orderRepairs) {
      //已退货 不显示申请退款
      console.log("已退货 不显示申请退款")
      that.data.tui = false;
      that.setData({
        tui: that.data.tui,
        canRepairTxt: '退款详情'
      })
    } else if(canRepair && canSubmitRepaier){ //退货按钮 是否可点
      that.setData({
        tui: true
      })
       //可退货 可提交退货
      //校验订单是否可退款
      http(URL.checkTuiUrl, { cOrderSn: that.data.cOrderSn }).then((data) => {
        console.log("校验订单是否可退款")
        console.log(data)
        if(data.data==null){
          wx.showToast({
            title: '获取订单异常',
            icon: 'none'
          })
          that.data.tui = false;
          that.setData({
            tui: that.data.tui
          })
        }
        else if (data.data.state) {
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
    }
     else {
      //不可退
      that.data.tui = false;
      that.setData({
        tui: that.data.tui
      })
      console.log("不可退不可退不可退不可退不可退不可退不可退")
      console.log(that.data.tui)
    }
    // if(that.data.orderShowStatus == 3 && that.data.orderData.groupbuyStatus!=-1){ //单独购买
    //   that.setData({dan_du:false,pin_tuan:true,tui:false})
    // }
    // else if(that.data.orderShowStatus == 3 && that.data.orderData.groupbuyStatus==1){ //待拼团
    //   that.setData({dan_du:true,pin_tuan:false,tui:true})
    // }

  },
  // onDetail:function(){
  //   var that = this;

  // }
})
