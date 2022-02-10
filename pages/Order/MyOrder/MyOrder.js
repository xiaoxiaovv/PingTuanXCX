// pages/Order/Order.js

const app = getApp();

const config = require('./../../../config/index.js');
const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');
var canUseReachBottom = true;
Page({
 
  /**
   * 页面的初始数据 
   */
  
  data: {
    orderSn:'',
    groupId:0, 
    loading:false,
    scroll_top: 0,
    order_Status:0,
    isMore:false,
    'orderBar': ['全部', '待付款', '待发货', '待收货'],
    'pageIndex': 1,
    'pageSize': 10,
    'keyword': '',
    'orderFlag': 0,
    orderList: [],
    moreOrderList:[],
    'orderId': '', // 订单ID
    orderStatus:0,
    'orderProductSize': '',
    'networkType': '',
    totalNum : 0,
    orderTotal: 0,
    address:"",
    isloading:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();//隐藏转发
    var index=options.index;
    if(index!=null){
      this.setData({
        index: index,
        order_Status: index,
        orderStatus:index,
        // listId:index,
      })
    }else{
      this.setData({
        index: 0,
        order_Status: 0,
      })
    }

    /*判断是否有网络 */
    const that = this
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        networkType === 'none' ? networkType = true : networkType = false
        that.setData({
          networkType
        })
      }
    })
    
  },
  onShow:function(){
    /*调用订单列表数据请求 */
    this.getOrderData()
  },

  //订单的跳转
  orderItem: function (e) {
    var id = e.currentTarget.dataset.id;  //列表对应的index 
    console.log('id===' + id)
    var cOrderId=this.data.orderList[id].orderProducts[0].orderProductId;     //网单id
    var cOrderSn=this.data.orderList[id].orderProducts[0].cOrderSn;     //网单号
    this.setData({isloading:false});
    wx.navigateTo({
      url: '/pages/Order/OrderPage/OrderPage?cOrderId=' + cOrderId + '&cOrderSn=' + cOrderSn,
    })
  },

  /*获取订单状态 */
  orderBarchange: function (e) {
    var that = this;
    this.setData({
      order_Status: e.currentTarget.dataset.barindex,
      'pageIndex': 1,
      'pageSize': 10,
      orderTotal: 0,
      scroll_top:0,
      isloading:false
    },()=>{
      that.getOrderData()
    })
   
    console.log('order_Status===='+e.currentTarget.dataset.barindex)
  },
  //再次购买
  shop: function (e) {
    var index=e.currentTarget.dataset.index;
    wx.redirectTo({
      url: '/pages/Details/index/index?productId=' + this.data.orderList[index].orderProducts[0].productId,
    })
  },
  // 取消订单
  cancelOrder: function (e) {
    const that = this
    const orderId = e.target.dataset.orderid;
    const cOrderId = e.target.dataset.corderid;
    const cOrderSn = e.target.dataset.cordersn;
    const orderSn = e.currentTarget.dataset.ordersn;
    
    that.setData({
      orderId,
      cOrderSn,
      cOrderId,
      orderSn
    })
    console.log(e)
    wx.showModal({
     // title: '取消订单提示',
      content: '您确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          that.getCancelOrder()
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //去支付
  goPayment:function(e){
    var that = this;
    this.setData({isloading:true},()=>{
        // 上传 formId;
      let formId = e.detail.formId;
      // console.log(formId);
      http(URL.formIdUrl, { formId })

      var id = e.currentTarget.dataset.id;  //列表对应的index 
      console.log('id===' + id)
      var orderProductId = this.data.orderList[id].orderProducts[0].orderProductId;     //网单id
      var cOrderSn = this.data.orderList[id].orderProducts[0].cOrderSn;     //网单号
        var orderSn = e.currentTarget.dataset.ordersn;
        //  var pages/Order/PutOrder/ PutOrder
          var orderMsg = {
            openid: app.globalData.openId,
            orderSn: orderSn,
          }
       
          http(URL.getOrderIsPayment,{orderSn:orderMsg.orderSn},'GET')
            .then((res)=>{
              if(res.success && res.data){
                that.setData({isloading:false});
                // 微信支付
                  http(URL.getWeChatPayment, orderMsg, 'GET')
                    .then((res) => {
                      console.log(res)
                      that.setData({isloading:false});
                      if (res.success && res.data != null) {
                        that.setData({isloading:false});
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
                              that.setData({isloading:false});
                              //跳转到开团成功
                              wx.showToast({
                                title: '支付成功',
                                icon: 'success', // none 不展示icon
                                duration: 1000
                              })
                              var cOrderId=that.data.orderList[id].orderProducts[0].orderProductId;     //网单id
                              var cOrderSn=that.data.orderList[id].orderProducts[0].cOrderSn;     //网单号
                              wx.navigateTo({
                                url: '/pages/Order/OrderPage/OrderPage?cOrderId=' + cOrderId + '&cOrderSn=' + cOrderSn,
                              })
                            }

                          },
                          'fail': function (res) { // 1. 支付失败 requestPayment:fail (detail message) 
                            // 不跳转 给出提示
                            console.log(res)
                            that.setData({isloading:false});
                            var orderState = 0;
                            if (res.errMsg == 'requestPayment:fail cancel'){ //取消支付
                              // wx.showToast({
                              //   title: '取消支付',
                              //   icon: 'none', // none 不展示icon
                              //   duration: 2000
                              // })
                              console.log('取消支付')
                            }else{
                              // 支付失败
                              wx.showModal({
                                title: '支付失败,请重新支付',
                                content: res.errMsg,
                                showCancel: false,
                                confirmText: '确定',
                                success: function (res) {
                                  if (res.confirm) {
                                  
                                    console.log('用户点击了“确定”')
                                  }else if (res.cancel) {
                                    console.log('用户点击取消')
                                  }
                                }
                              })
                            }
                          }
                        })
                      } else {
                        
                        that.setData({isloading:false});
                        wx.showModal({
                          //title: '提示',
                          content: res.message,
                          showCancel: false,
                          confirmText: '确定',
                          success: function (res) {
                            if (res.confirm) {
                              console.log('用户点击了“确定”')
                            }
                          }
                        })
                      }
                    })
              }else{
                that.setData({isloading:false});
                wx.showModal({
                  // title: '支付失败',
                  content: '此订单已经过期，请重新下单',
                  showCancel: false,
                  confirmText: '确定',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击了“确定”')
                    }
                  }
                  })
              }
            }) 
    });
   
        
  },
  //取消订单请求
  getCancelOrder: function () {
    const that = this
    const cOrderSn = that.data.cOrderSn
    const cOrderId = that.data.cOrderId
    http(URL.cancelOrder, {
      cancelFlag: 'mstroe',
      orderId: that.data.orderId,
      orderSn: that.data.orderSn   //订单号

    }).then((data) => {
      if (data.success) {
        console.log('www')
        console.log(data)
        that.getOrderData();
      }
      
    }).catch((err) => {
      console.log(err);
    })
  },


  //查看物流
  chakan: function (e) {
    console.log("123")
    var orderSn = e.currentTarget.dataset.ordersn;
    var address = e.currentTarget.dataset.address;
    console.log(e)
    wx.navigateTo({
      url: '/pages/Order/OrderLogistics/OrderLogistics?orderSn=' + orderSn + '&address=' + address,
    })
  },
  /*订单列表数据请求 */
  getOrderData: function () {
    const that = this
    http(URL.myOrderUrl, {
      keyword: that.data.keyword,
      orderFlag: that.data.orderFlag,
      orderStatus: that.data.order_Status,  //订单状态
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize,
    
    }).then((data) => {
      wx.stopPullDownRefresh();
      console.log(data)
      var res = data.data.orders;
     
      that.setData({
        orderList: res,
        loading: false,
        totalNum: data.data.countResult,
        isMore: data.data.countResult > 10 ? true:false,
     
      })
     console.log(that.data.isMore)
      wx.hideLoading();
    
    }).catch((err) => {
      console.log(err);
      wx.hideLoading();
    })

  },
  loadMoreOrder: function(){
    const that = this;
    
    if (canUseReachBottom){
    return;
    }else{
        http(URL.myOrderUrl, {
        keyword: that.data.keyword,
        orderFlag: that.data.orderFlag,
        orderStatus: that.data.orderStatus,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize
      }).then((data) => {
        console.log(data)
        var res = data.data.orders;     
        
        var list = that.data.orderList;
        var arr = list.concat(res);
        
        console.log(arr)
        that.setData({
          orderList: arr,
          isMore: arr.length <= data.data.countResult ? true :false,
        },()=>{
          console.log('guan le')
          wx.hideLoading();
          canUseReachBottom = true;
         
        })
       if(arr.length == data.data.countResult){
          that.setData({isMore:false})
       }
      
        
      }).catch((err) => {
        console.log(err);
        that.setData({
          isMore:false
        })
        canUseReachBottom = false;
        wx.hideLoading();
      })
    }
   
  },
  // 刷新订单数据列表
  refresh: function () {
    var that = this;
    console.log('shauxin')
    that.setData({
      pageIndex: 1, // 每次触发下拉事件pageIndex=0
      scroll_top: 0,
      'pageSize': 10,
      isMore: true
    },()=>{
      that.getOrderData();
    }) 
  },
  // 刷新
  onPullDownRefresh: function (res) {
    console.log(res)
    console.log("下拉刷新")
    let that = this;
    that.setData({
      pageIndex: 1, // 每次触发下拉事件pageIndex=0
      scroll_top: 0,
      'pageSize': 10,
      isMore: true,
      totalNum : 0,
      orderTotal: 0,
    },()=>{
      that.getOrderData();
    }) 
  },
  // 加载更多
  loadMore :function(res){
    console.log(res)
    console.log('加载拉')

      var that = this;
      if (!canUseReachBottom) {
        return;
      } else{
        var pageSize = that.data.orderTotal;
          pageSize+=10;
          that.setData({ orderTotal: pageSize})  
          console.log(canUseReachBottom) 
        if (that.data.totalNum <= that.data.orderTotal) {
          console.log('都完了')
          that.setData({ isMore: false, }, () => {
            wx.hideLoading();
          });
          canUseReachBottom = true;
        } else {
            console.log('接着加载')
            wx.showLoading({
              title: '拼命加载中',
              mask: true
            });
            canUseReachBottom = false;
            var pageIndex = that.data.pageIndex;
            pageIndex++;
            that.setData({ pageIndex: pageIndex }, () => {
              that.loadMoreOrder();
            })
          } 
      }     
      // that.getOrderData();     
  },
})
  