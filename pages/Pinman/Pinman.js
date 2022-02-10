// pages/Pinman/Pinman
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
    loading: false,
    tuaninfo: [],
    Tuan: true,
    other: [],
    hours: 0,
    minutes: 0,
    seconds: 0,
    ctime: 2559696
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getPinData()
  },
  getPinData:function(){
    var that = this;
    http(URL.pinStatusUrl, { groupId: 28 }).then((data) => {
      console.log(data.data);
      const tuaninfo = data.data;   //拼团商品、成员及时间
      const tuijian = data.data.activites;  //推荐
      const other = data.data.groups;   //别人的团
      that.setData({
        tuaninfo:that.fiterArr(tuaninfo),
        tuijian: that.fiterArr(tuijian),
        other
      })
    }).catch((err) => {
      console.log(err)
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
      if (ctime < 0) {
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
    var that = this;
    http(URL.pinStatusUrl, { groupId: 28 }).then((data) => {
      const tuijian = data.data.activites;  //推荐
      if(tuijian.length<=that.data.tuijian.length){
          //没有新数据
          that.setData({
            loading:false,
            already:true
          })
      }else{
        //有更新
        that.data.tuijian.push(tuijian)
        that.setData({
          tuijian:that.data.tuijian,
          loading: true,
          already: false
        })
      }
     
    })

  },
  onDetail: function (e) {
    var item = e.currentTarget.dataset.item;
    console.log(item);
    let videoUrl = item.videoUrl;
    let activityId = item.id;
    if (videoUrl != '' && videoUrl != null) {
      //如果有视频地址
      wx.navigateTo({
        url: '/pages/Details/Vedio/Vedio?activityId=' + activityId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/Details/index/index?activityId=' + activityId,
      })
    }
  },
  fiterArr: (list) => {
    if(list instanceof Array){
      let listArr = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let singleBuyPrice = item.singleBuyPrice.toFixed(2);
        let groupBuyPrice = item.groupBuyPrice.toFixed(2);
        let obj = Object.assign(item, { singleBuyPrice, groupBuyPrice });
        listArr.push(obj);
      }
      return listArr;
    }else{
      let singleBuyPrice = list.singleBuyPrice.toFixed(2);
      let groupBuyPrice = list.groupBuyPrice.toFixed(2);
      let obj = Object.assign(list, { singleBuyPrice, groupBuyPrice });
      return obj;
    }
    
  },
})