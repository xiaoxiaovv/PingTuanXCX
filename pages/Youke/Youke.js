// pages/Youke/Youke.js
//获取应用实例
const app = getApp()

//const config = require('./../../config/index.js');
const URL = require('./../../config/url.js');
const http = require('./../../config/http.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tuaninfo: [
    //   {
    //     url: "../../imgs/Bitmap4 Copy.png",
    //     title: "春秋褶皱围巾女丝巾薄款韩版发带小方巾夏季韩国百搭装饰头巾领头巾领头巾",
    //     pin: 2,
    //     yipin: 9999,
    //     price: 39.00,
    //     pinprice: 29.00
    //   }
    // ],
    // Tuan: true,
    // want: [
    //   {
    //     url: "../../imgs/footer.png",
    //     title: "春秋褶皱围巾女丝巾薄款韩版发带小方巾夏季韩国百搭装饰头巾领头巾领头巾",
    //     pin: 2,
    //     price: 39.00,
    //     pinprice: 29.00
    //   }
    // ],
    // hours: 0,
    // minutes: 0,
    // seconds: 0,
    // ctime: 2559696
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面加载时请求数据
    this.getYoukeData()
  },
  getYoukeData: function () {
    var that = this

    http(URL.youkeUrl, { groupId: 10, memberId:10}).then((data) => {
   
      that.setData({
        num2: data.data.num,
        groupBuyPrice2: data.data.groupBuyPrice,
        singleBuyPrice2: data.data.singleBuyPrice,
        productName2:data.data.productName,
        boughtNum: data.data.boughtNum,

        // 可能想拼
        imageUrl: data.data.activites[0].imageUrl,
        num: data.data.activites[0].num,
        productName: data.data.activites[0].productName,
        groupBuyPrice: data.data.activites[0].groupBuyPrice,
        singleBuyPrice: data.data.activites[0].singleBuyPrice,

      })
    }).catch((err) => {
      console.log(err);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //补零函数
    function addZero(num) {
      return num < 10 ? '0' + num : num;
    }
   var ctime = 2559696;//时间差
   var that = this;
    
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
      if(ctime<0){
        clearInterval(interval);
      }
    };
    downTime();
    var interval = setInterval(downTime, 1000);

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

  }
})