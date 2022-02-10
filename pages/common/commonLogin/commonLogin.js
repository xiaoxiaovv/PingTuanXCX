// pages/Order/PutOrder/PutOrder.js
var app = getApp();
const URL = require('../../../config/url.js');
const http = require('../../../config/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
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
    
  },

  bindGetUserInfo:function(e){
    console.log(e.detail.userInfo)
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log('点了确定')
      app.onLaunch({}, (e)=>{
        if (app.globalData.token && app.globalData.token.indexOf('#') > -1) {
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '获取token失败',
            icon: 'fail', // none 不展示icon
            duration: 1000
          })
        }
      });
      
    } else {
      //用户按了拒绝按钮
      console.log('点了拒绝')
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
    })
    }
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