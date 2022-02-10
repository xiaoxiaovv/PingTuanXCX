// pages/Details/index/index.js
var paramObj = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isScroll: false,
    yixuan: "玫瑰红",
    yixuan_size: "23",
    active: 0,
    active2: 0,
    count: 1,

    sku: [
      {
        price: 59,
        kucun: 100,
        color: ["玫瑰红", "玫瑰金", "复古灰", "蓝色", "黄色", "红色", "经典蓝白", "经典浅蓝"],
        size: [23, 24, 25, 26]
      }
    ],

    videoUrl: 'http://yun.it7090.com/video/XHLaunchAd/video03.mp4',

    barList: [{
      imgUrl: '/imgs/homes.png',
      text: '首页',
      text2_color: '#2979FF',
      bar_backgroundColor: 'white',
      pageUrl: '/pages/Home/Home',
    },
    {
      imgUrl: '/imgs/kf@2x.png',
      text: '客服',
      text2_color: '#2979FF',
      bar_backgroundColor: 'white',
      pageUrl: '',
    },
    {
      price: 2599.00,
      text: '单独购买',
      text2_color: '#2979FF',
      bar_backgroundColor: 'white',
      text1_color: '#000000',
    },
    {
      price: 2566.00,
      text: '发起拼团',
      text2_color: '#FFFFFF',
      bar_backgroundColor: '#FF6026',
      text1_color: '#FFFFFF',
    }
    ]
  },
  //停止播放视频
  bindStop:function(){
    this.videoContext.pause();
  },
  //开始播放视频
  bindPlay:function(){
    this.videoContext.seek(0);
    this.videoContext.play();
  },
  bindchange:function(e){
    var current = e.detail.current;
    if (current!=0){
      this.bindStop();
      this.videoContext = wx.createVideoContext('myVideo');
    }else{
      this.bindPlay();
      this.videoContext = wx.createVideoContext('myVideo');
    }
  },
  tan: function () {
    this.data.isScroll = !this.data.isScroll;
    this.setData({
      isScroll: this.data.isScroll
    })
  },
  onX: function () {
    this.tan()
  },
  //底部页面跳转
  myPage: function (e) {

    //页面跳转
    var index = e.currentTarget.dataset.id;
    if (index == 0) {
      wx.switchTab({
        url: this.data.barList[index].pageUrl,
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: this.data.barList[index].pageUrl,
      })
    } else {
      this.tan();
    }
  },
  onColor: function (e) {
    // ev = e;
    // onActive(ev);
    var val = e.currentTarget.dataset.value;
    var id = e.currentTarget.dataset.id;
    this.data.yixuan = val;
    this.data.active = id;
    this.setData({
      yixuan: this.data.yixuan,
      active: this.data.active
    });

  },
  onSize: function (e) {
    var size = e.currentTarget.dataset.size;
    var id = e.currentTarget.dataset.id;
    this.data.yixuan_size = size;
    this.data.active2 = id;
    this.setData({
      yixuan_size: this.data.yixuan_size,
      active2: this.data.active2
    })
  },
  onAdd: function () {
    var count = this.data.count;
    count++;
    this.setData({
      count: count
    })
  },
  onJian: function () {
    var count = this.data.count;
    if (count > 1) {
      count--;
    }
    this.setData({
      count: count
    })
  },
  enter: function () {
    //关闭页面
    this.tan()
    //跳支付页
    wx.navigateTo({
      url: '',
    })
  },
  //去拼团跳转
  onCollage: function (e) {
    var index = e.currentTarget.dataset.index;
    //var collageId = this.data.banner[index].id;   //获取拼团活动对应的id
    wx.navigateTo({
      url: '/pages/Success/Success?id=' + index,
    })
  },

  //调取数据接口
  onProduct: function () {
    wx.request({
      url: '/wechat/groupbuy/product/{productId}.json',
      data: {
        productId: this.data.productId
      },
      method: 'GET',
      header: 'application/json',
      success: function (res) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.videoContext = wx.createVideoContext('myVideo');
    var bannerId = options.bannerId;
    console.log('bannerId=' + bannerId)
    this.setData({
      bannerId: bannerId,
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

  }
})