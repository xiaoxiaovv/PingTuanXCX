
const app = getApp()

// const config = require('./../../config/index.js');
const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderSn:'',
    address:'',
    defaultImageUrl: '',// 商品图片
    expressName: '',//物流公司
    orderSn: '',//订单号
    orderWorkFlowList: '',//物流信息列表
    contactmobile: '',//手机号
    success: '',//签收状态
    invoiceNumber:'',
  },
  // 复制
  copy: function () {
    wx.setClipboardData({
      data: this.data.orderSn, //复制的内容
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderSn = options.orderSn;
    var address = options.address;
    this.setData({ orderSn, address},()=>{
          that.getOrderLogisticsData();
    })
   
  },
  getOrderLogisticsData: function () {
    var that = this;
    var orderSn = this.data.orderSn;
    http(URL.orderTrackUrl, { orderSn: orderSn},'GET')
    .then((res)=>{
      console.log(res)
       if(res.success && res.data!=null){
         const newRes = res.data;
         const orderWorkFlowsViewA = newRes.orderWorkFlowsViewA[0];
         that.setData({
           defaultImageUrl: orderWorkFlowsViewA.defaultImageUrl,// 商品图片
           expressName: orderWorkFlowsViewA.expressName,//物流公司
           orderSn: newRes.orderSn,//订单号
           invoiceNumber:orderWorkFlowsViewA.invoiceNumber,
           orderWorkFlowList: orderWorkFlowsViewA.orderWorkFlowList,//物流信息列表
           contactmobile: res.data.mobile,//手机号
           success: res.success//签收状态
         })
         console.log(res)
       }else{
         wx.showToast({
           title: res.message,
           icon:'none',
           duration:2000
         })
       }
    })
 
  }
})
