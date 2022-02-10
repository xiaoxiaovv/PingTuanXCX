const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    orderProductId: 37688398,
    ReturnGoods: {
      "data": {
        "describe": "",
        "orderWorkFlowList": [],
        "reason": "",
        "refundCode": "",
        "refundMoney": 0,
        "refundType": "",
        "shopName": ""
      },
      success: false,
    },
    orderWorkFlowList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  init: function (orderProductId){
    console.log('orderProductId', orderProductId)
    var that = this;
    http(URL.getOrderRefund, { orderProductId: orderProductId}, "GET")
      .then((res) => {
        console.log(res)
        if (res.success && res.data!=null){
          var arr = [], leftDate = '', leftTime = '', rightName = '', rightTime='';
          var hanzi = /[\u4e00-\u9fa5]/g;
          if (res.data.orderWorkFlowList.length!=0){
             var orderWorkFlowList = res.data.orderWorkFlowList;
                 arr = orderWorkFlowList.map((item) => {
                 leftDate = item.val.split(' ')[0];
                 leftTime = item.val.split(' ')[1];
                 
                   var str = item.name;
                 rightTime = str.split(':'); 
                 rightName = item.name.split(':')[0];
                 if(rightTime[1] &&rightTime[2]&&rightTime[3]){
                  rightTime = rightTime[1] +':'+rightTime[2]+':'+rightTime[3];
                 }else{
                  rightTime = rightTime[1];
                 }

                  return {
                    leftDate,
                    leftTime,
                    rightName,
                    rightTime
                  }
            })
          }
          console.log(arr)
          console.log(res.data.reason)
           that.setData({
             orderWorkFlowList: arr.reverse(),
             ReturnGoods: {
               "data": {
                 "describe": res.data.describe,
                // "orderWorkFlowList": arr,
                 "reason": res.data.reason,
                 "refundCode": res.data.refundCode,
                 "refundMoney": res.data.refundMoney,
                 "refundType": res.data.refundType,
                 "shopName": res.data.shopName,
               },
               success: res.success,
             }
           },()=>{
              
           })
        }else{
          wx.showToast({
            title: res.message,
            icon:'none',
            duration:1000
          })
        }
      })
  },
  onLoad: function (options) {
    var that = this;
    var orderProductId = options.orderProductId;
    console.log('!!!options!!', options)
    that.init(orderProductId);
  //  const orderWorkFlowList = that.data.ReturnGoods.data.orderWorkFlowList;
  //  console.log(that.data.ReturnGoods.data.orderWorkFlowList)
    // const arr = orderWorkFlowList.map((item) => {
    //   const leftDate = item.val.split(' ')[0]
    //   const leftTime = item.val.split(' ')[1]
    //   const rightName = item.name.split(':')[0]
    //   const rightTime = item.name.split(':')[1]
    //   return {
    //     leftDate,
    //     leftTime,
    //     rightName,
    //     rightTime
    //   }
    // })
    // that.setData({
    //   orderWorkFlowList: arr,
    //   success: that.data.ReturnGoods.success
    // })
    /*this.getReturnGoodsData()*/
  },
  // 退款详情页
  /*getReturnGoodsData:function () {
    const that = this
    http(URL.returnGoods, {
      orderProductId: that.data.orderProductId
    }).then((data) => {
      const res = data
      that.setData({
        'orderList': res
      })
      console.log(that.data.orderList)
    }).catch((err) => {
      console.log(err);
    })
  },*/
  

})