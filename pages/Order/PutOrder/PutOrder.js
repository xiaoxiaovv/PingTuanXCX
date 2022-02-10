// pages/Order/PutOrder/PutOrder.js
var app = getApp();
const URL = require('../../../config/url.js');
const http = require('../../../config/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //height:0,
    groupId:0, //团id
    footerClass: app.globalData.isIphoneX ? 'bottom-content-phonex' : '',
    userInfo:{
      name: '',
      mobile:'',
      address:'',
      shopName:'',
      shopImg:'',
      shopTitle:'',
      shopParameter:'', //商品参数规格
      shopPrice: 0.00, // ¥ 商品单价
      shopNum: 0,
      totalNum: 0, // 共几件商品
      totalPrice: 0.00 // 商品总价
    },
    isSubmit:false,  // 避免重复提交
    orderMsg:{
      flag: -1,
      name: '',
      num: 0,
      productId: 0,
      sku: '',
      shareId: 28056363,
      streetId: 12024645 ,
      'type': -1, 
      id: 0
    },
    orderDetail:0,
    
  },
  // 新增地址
  goToAddress:function(){
    var type = 'orderCommit';
    wx.navigateTo({
      url: '/pages/Add/Add?type=' + type,
    })
  },
  // 选择地址列表
  goToAddressList:function(){
    var type = 'orderCommit';
    wx.navigateTo({
      url: '/pages/Address/Address?type=' + type,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var str = options.type;
    this.setData({ orderDetail:options.type})
    // if(str == 2){ //订单详情
    //   wx.getStorage({
    //     key: 'order-info',
    //     success: function(res) {
    //       console.log(res)
    //       that.setData({
    //         orderMsg: {
    //           flag: res.data.flag ,
    //           name: res.data.name.join(','),
    //           num: res.data.num,
    //           productId: res.data.productId,
    //           sku: res.data.sku,
    //           shareId: res.data.shareId,
    //           streetId: res.data.streetId,
    //           'type': res.data.type,
    //           id: res.data.id,
    //         }
    //       },()=>{
    //         that.init();
    //       })
    //     },
    //   })

    //   console.log(that.data.orderMsg)
     
    // }

      this.setData({
        orderMsg: {
          flag: options.flag * 1,
          name: options.name,
          num: options.num * 1,
          productId: options.proId * 1,
          sku: options.sku,
          shareId: 28056363,
          streetId: null,
          'type': options.type,
          id: options.id * 1,
        },
        isSubmit:true,
      });
   
      
    console.log(that.data.orderMsg)
   
  },
 
  init:function(){
    var that = this;
    var data = {
      flag: that.data.orderMsg.flag, // 是否是拼团 0单独 1是拼团
      proList: [{
        name: that.data.orderMsg.name, //商品属性名
        num: that.data.orderMsg.num, //商品数量
        proId: that.data.orderMsg.productId,//商品id
        sku: that.data.orderMsg.sku, //商品sku
      }],
      shareId: that.data.orderMsg.shareId, //分享人id  这个应该是memberid
      streetId: that.data.orderMsg.streetId, //街道id
    }

    http(URL.getOrderInit, data,'POST').then((res)=>{
      console.log(res)
      if (res.success && res.data!=null) {
        let common = res.data;
        var addrs = res.data.rn + common.addr; // 拼接地址
        var list = common.ops;
        
        that.setData({
          userInfo: {
            name: common.coN,
            mobile: common.mb,
            address: addrs,
            shopName: common.ops[0].osName,
            shopImg: common.ops[0].image,
            shopTitle: common.ops[0].proN,
            shopParameter: common.ops[0].an, //商品参数规格
            shopPrice: common.ops[0].price, // ¥ 商品单价
            shopNum: common.ops[0].num,
            totalNum: common.ops[0].num, // 共几件商品
            totalPrice: common.ops[0].opa,// 商品总价
          },
          isSubmit: true,
        });
      } else {
        // wx.showToast({
        //   title: res.message,
        //   icon: 'none', // none 不展示icon
        //   duration: 2000
        // })
        wx.showModal({
          title: '支付失败',
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
    if (this.data.orderDetail == 2){
      console.log('订单详情来的')
        return;
    }else{
      console.log('正常流程')
       this.init();
    }
   
  },
  
  // 立即支付
  goPayment: function(e){
    var that = this;
     // 上传 formId;
     let formId = e.detail.formId;
     // console.log(formId);
     http(URL.formIdUrl, { formId })
     
     // 1.单独购买 flag =0 单独购买 单独购买 data为空
     // 2.去拼团 传 团id 3. 发起拼团 传 活动id 互斥
     var  activityId = 0;
     var  groupId = 0;
     var url = '' ;
     if (this.data.orderMsg.type != -1 && this.data.orderMsg.type == 1 && this.data.orderMsg.flag==1) { //去拼团
       groupId = this.data.orderMsg.id;
       console.log("拼团成功！！！！！！！！！！" + groupId)
       url = URL.commitOrder + '?groupId=' + groupId + '&flag=' + '1';
     } else if (this.data.orderMsg.type != -1 && this.data.orderMsg.type == 6 && this.data.orderMsg.flag ==1){ // 发起拼团
       activityId = this.data.orderMsg.id;
       console.log("发起拼团成功！！！！！！！！！！" + activityId)
        url = URL.commitOrder + '?activityId=' + activityId +'&flag='+ '1';
     }else{ // 单独购买
       url = URL.commitOrder+'?flag=' + '0';
     }
    that.setData({isSubmit:false},()=>{
      http(url, {},'POST').then((res)=>{
            if (res.success && res.data!=null) {
              var orderMsg = {
                openid: app.globalData.openId,
                orderSn: res.data.os
              }
              that.setData({ groupId: res.data.gi});
            
                // 微信支付
                  http(URL.getWeChatPayment, orderMsg , 'GET')
                    .then((res) => {
                    
                      if (res.success && res.data!=null) {
                        
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
                              that.setData({isSubmit:true})
                              wx.showToast({
                                title: '支付成功',
                                icon: 'success', // none 不展示icon
                                duration: 1000
                              })
                              if (that.data.orderMsg.type == 9){
                                var num = 2;
                                wx.redirectTo({
                                  url: '/pages/Order/MyOrder/MyOrder?index=' + num,
                                })
                              }else{
                                console.log(that.data.groupId+"000000000000000000")
                                wx.redirectTo({
                                    url: '/pages/Success/Success?id=' + that.data.groupId,
                                  })
                              }
                            
                            }

                          },
                          'fail': function (res) { // 1. 支付失败 requestPayment:fail (detail message) 
                            // 不跳转 给出提示
                            var orderState = 1;
                            
                            console.log(res)
                            if (res.errMsg == 'requestPayment:fail cancel') { //取消支付
                              that.setData({isSubmit:true});
                              wx.redirectTo({
                                url: '/pages/Order/MyOrder/MyOrder?index=' + orderState,
                              })
                            } else if (res.errMsg == 'requestPayment:fail Error'){
                              that.setData({isSubmit:false});
                              wx.showModal({
                                title: '支付失败,请重新支付',
                                cancelText: '取消',
                                confirmText: '确认',
                                content: res.errMsg,
                                success: function (res) {
                                  if (res.confirm) {
                                    console.log('用户点击确定')
                                    that.setData({isSubmit:true});

                                  } else if (res.cancel) {
                                    // 跳转到订单详情
                                    console.log('用户点击取消')
                                    that.setData({isSubmit:true});
                                    wx.redirectTo({
                                      url: '/pages/Order/MyOrder/MyOrder?index=' + orderState,
                                    })
                                  }
                                }
                              })
                            }
                            else {
                              that.setData({isSubmit:false});
                              // 支付失败
                              wx.showModal({
                                title: '支付失败,请重新支付',
                                cancelText: '取消',
                                confirmText: '确认',
                                content: res.errMsg,
                                success: function (res) {
                                if (res.confirm) {
                                  console.log('用户点击确定')
                                  that.setData({isSubmit:true});
                                } else if (res.cancel) {
                                  // 跳转到订单详情
                                  that.setData({isSubmit:true});
                                  console.log('用户点击取消')
                                  wx.redirectTo({
                                    url: '/pages/Order/MyOrder/MyOrder?index=' + orderState,
                                  })
                                }
                              }
                            })

                            }
                          
                          },
                        
                        })
                      }
                      else {
                        wx.showToast({
                          title: res.message,
                          icon: 'none', // none 不展示icon
                          mask: true,
                          duration: 2000
                        })
                        that.setData({isSubmit:true})
                      }
                    })
          
            } else if(res.success==false && res.errorCode == -10){ 
              that.setData({isSubmit:false});
              // wx.showToast({
              //   title: res.message,
              //   icon: 'none', // none 不展示icon
              //   duration: 3000
              // })
              var cOrderId=res.data.cOrderId;     //网单id
              var cOrderSn=res.data.cOrderSn;     //网单号
              wx.showModal({
              // title: '错误信息',
                content: res.message,
                cancelText:'关闭',
                confirmText: '订单中心',
                success: function (res) {
                  if (res.confirm) {
                    that.setData({isSubmit:true})
                    
                      wx.redirectTo({
                        url: '/pages/Order/OrderPage/OrderPage?cOrderId=' + cOrderId + '&cOrderSn=' + cOrderSn,
                      })
                    
                    console.log('用户点击了“确定”')
                  }else if (res.cancel) {
                    that.setData({isSubmit:true})
                    console.log('用户点击取消')
                  }
                }
              })
              
            }
            else {
              
              wx.showToast({
                title: res.message,
                icon: 'none',
                mask: true,
                duration: 2000
              })
              that.setData({isSubmit:true})
            }
          })
    });
  
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