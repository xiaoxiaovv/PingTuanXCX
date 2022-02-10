const app = getApp()

// const config = require('./../../config/index.js'); 
const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');
 
Page({ 
  data: {   
    load:true,
    vedioPaly: false,//播放按钮   
    activityId:0,//活动ID
    showPlayIco:false,
    remind:"当前网络在非WIFI环境"
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    var that = this;
    //判断网络和加载中
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        networkType === 'none' ? networkType = true : networkType = false
        if (networkType == true) {
          that.data.load = false; //无网络不显示加载中
          that.setData({
            load: that.data.load
          })
        }
        that.setData({
          networkType
        })
      }
    })   
    var activityId = options.activityId; 
    this.setData({activityId})     
    this.networkstatus(); //启动网络的监控 
    this.getVideoData(activityId) //获取视频页面的数据   
  },

  //判断网络类型
  isNetwork: function(network,v) {
    //console.log(this.data.VChange)
   // console.log("this.data.VChange")

    var that = this;
    let  videoContext = wx.createVideoContext('myVideo')   
    //console.log(network)  
    if (network == 'wifi') {
      videoContext.play();  
      this.setData({ vedioPaly: true, ControlsShow: "controls_hidden" })
    }
    else if (network == 'none') {  
      videoContext.pause();   
      videoContext.showStatusBar()
      wx.showToast({
        title: '当前暂无可用网络',
        icon: 'none',
        duration: 2000
      }) 
      this.setData({ vedioPaly: false}) 

      if (this.data.showPlayIco) {
        this.setData({ ControlsShow: "controls_show" })
      }  
    }
    else {       
      wx.showToast({
        title: '正在使用非WIFI网络，播放将产生流量费用',
        icon: 'none',
        duration: 2000
      }) 

      videoContext.pause(); 
      videoContext.showStatusBar();    
       this.setData({ vedioPaly: false})
      if (this.data.showPlayIco) {
        this.setData({ ControlsShow: "controls_show" })
      }    
    }
  },
  ResumeVedio:function(){   
     wx.createVideoContext('myVideo').play();  
     this.setData({ vedioPaly: false, ControlsShow: "" })   
  },
  //通过网络类型控制视频播放 
  networkstatus: function() { 
    let that = this;      
    wx.getNetworkType({
      success: function(res) {       
        var networkType = res.networkType;
        that.isNetwork(networkType);
      }
    })
    wx.onNetworkStatusChange(function(res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType;
      
      
      that.setData({ showPlayIco: true}) 
      that.isNetwork(networkType);  
      
    })
  },
  //点击弹出层播放视频
  videoAuto: function() {    
   // this.videoContext.play();
    this.setData({
      isWIFI: true,
      bofang: true,
      zanting: true,
      flow_btn: true,
    })
  },
  // //点击视频事件
  // myVideo:function(){
  //   if (this.data.bofang==true){  //视频播放中
  //     this.zanting();
  //   }else{
  //     this.bofang();
  //   }
  // },
  // //视频全屏及退出全屏
  getBindfullscreenchange:function(){
    if (bindfull==false){
      this.videoContext.requestFullScreen();
    }else{
      
    }
   
  },
  //获取视频播放进度
  getBindtime:function(res){    
    var currentTime = res.detail.currentTime;   //播放进度时间
    currentTime = parseInt(currentTime);  //取整
    var sec = currentTime;  //秒数
    var min = parseInt(sec / 60);   //分钟
    if (sec<10){
      sec = '0' + sec;
    } else if (sec >= 10 && sec<60){
      sec = sec;
    }else{
      sec = sec - parseInt(sec/60)*60;
    }

    if(min<10){
      min='0'+min;
    }

    this.setData({
      sec:sec,
      min:min,
    })
  },
  //播放视频 
  PalyVedio: function() { 
    this.videoContext.play()    
  }, 
  getVideoData: function() {
    var that = this;

    http(URL.videoUrl, {
      activityId: this.data.activityId
    }).then((res) => {
      if (res.success) {
        let data = res.data;
        let productName = data.activityName;
        let imageUrl = data.imageUrl;
        let num = data.num;
        let boughtNum = data.boughtNum;
        let singleBuyPrice = data.singleBuyPrice;
        let groupBuyPrice = data.groupBuyPrice;
        let videoUrl = data.videoUrl;
        let videoSnapshotUrl = data.videoSnapshotUrl;
        let shengPrice = singleBuyPrice - groupBuyPrice;
        that.setData({
          productName: productName,
          imageUrl: imageUrl,
          num: num,
          boughtNum: boughtNum,
          singleBuyPrice: singleBuyPrice.toFixed(2),
          groupBuyPrice: groupBuyPrice.toFixed(2),
          videoUrl: videoUrl,
          videoSnapshotUrl: videoSnapshotUrl,
          shengPrice: shengPrice.toFixed(2)
        })
        
      }
    }).catch((err) => {
      console.log(err);
    })
  },
  bindPause: function () {
    this.setData({ ControlsShow: "controls_show" })

  },
  bindPlay: function () {
    this.setData({ ControlsShow: "controls_hidden" })

  },
  bindEnded: function () {
    this.setData({ ControlsShow: "controls_hidden" })
  },
  //详情跳转
  detail: function() {
    wx.navigateTo({
      url: '/pages/Details/index/index?activityId=' + this.data.activityId,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.data.load = false;
    that.setData({
      load: that.data.load
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let videoContext = wx.createVideoContext('myVideo')
    videoContext.pause(); 
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let videoContext = wx.createVideoContext('myVideo')
    videoContext.pause(); 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      //来自页面的转发
      console.log('res.target====' + res.target)
    }
    return {
      title: `看视频,买好货 | ${this.data.productName}`,
      path: `/pages/Details/Vedio/Vedio?activityId=${this.data.activityId}&promotionCode=${app.globalData.mid}`,
      imageUrl: this.data.videoSnapshotUrl
    }
    }
})