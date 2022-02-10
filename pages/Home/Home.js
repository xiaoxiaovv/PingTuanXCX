

// pages/Home/Home.js

const app = getApp()

const URL = require('./../../config/url.js');
const http = require('./../../config/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    load:true,
    scroll_top:0,
    listLength: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    pageIndex: 1,
    pageSize: 5,
    list: [],
    banner: [],
    loading: false,
    scrollTop: 0,
    authorize: true, //授权登录弹窗
    isLogin: false, //登录
    noLogin: false, //不登录
    pullUpState: false, // 上拉状态
    noListDataShow: false, //是否显示已拉到底部
    fristGetDateState: false, //是否第一次数据请求
  },


  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current // current 改变时会触发 change 事件
    })
  },

  onGotUserInfo: function (e) {
    console.log(e.detail.encryptedData.openId)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面加载时请求数据
    let that = this;
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
    that.getHomeData(that);
    // 全局请求

  },
  onShow:function(){
    var that=this;
    that.data.load = false;
    that.setData({
      load: that.data.load
    })
  },
  //登录 console.log('openid=' + res.data.openid)
  onGotUserInfo: function (e) {
    console.log(e.detail.encryptedData.openId)

  },
  //banner跳转
  bannerDetail: function (e) {
    var item = e.currentTarget.dataset.item;
    console.log(item);
    let hyperLinkType = item.hyperLinkType;
    let hyperLink = item.hyperLink;
    if (hyperLinkType == 5) {
      //如果有视频地址
      wx.navigateTo({
        url: '/pages/Details/index/index?activityId=' + hyperLink,
      })
    }
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
  goPingtuan: function (e) {
    var item = e.currentTarget.dataset.item;
    let activityId = item.id;
    wx.navigateTo({
      url: '/pages/Details/index/index?activityId=' + activityId,
    })

  },
  // 闲逛
  getHomeData: function (thiss) {
    let that = this;
    if (thiss) { that = thiss; }

    // 数据大于五条显示加载中
    if (that.data.list.length > 5) {
      that.setData({
        loading: true
      })
    }

    // 全局 URL 配置
    // console.log(URL.testUrl);
    // 全局请求
    http(URL.homeUrl, {
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize
    }).then((res) => {
      if (res.success) {
        let data = res.data;
        console.log(data);
        const list = data.list;
        const banner = data.banner;

        that.setData({
          list: that.fiterArr(list),
          banner: banner,
          loading: false,
          scroll_top:0,
        }, () => {
          setTimeout(()=>{
            wx.stopPullDownRefresh();
          },500)
          // console.log(that.data.list);
        });
 
        wx.stopPullDownRefresh() //停止下拉刷新
        if (!that.data.loading && that.data.pullUpState) { //上拉时才会出现已拉到底部
          that.setData({
            pullUpState: false
          },()=>{
            wx.stopPullDownRefresh();
          })
          if (that.data.list.length < that.data.pageSize) {
            // 当数据长度小于请求条数时候显示已拉到底部
            that.setData({
              noListDataShow: true,
            },()=>{
              wx.stopPullDownRefresh();
            })
          }
        } else {
          that.setData({
            noListDataShow: false,
          },()=>{
            wx.stopPullDownRefresh();
          })
        }
      }
      wx.stopPullDownRefresh() //停止下拉刷新
    }).catch((err) => {
      console.log(err);
    })
  },

  fiterArr: (list) => {
    // console.log(list)
    let listArr = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let singleBuyPrice = item.singleBuyPrice.toFixed(2);
      let groupBuyPrice = item.groupBuyPrice.toFixed(2);
      let obj = Object.assign(item, { singleBuyPrice, groupBuyPrice });
      listArr.push(obj);
    }
    return listArr;
  },
  // 上拉事件
  lower: function () {
    const index = 5
    this.setData({
      pageSize: (this.data.pageSize + index)
    }, () => {
      this.getHomeData();
    });
  },

  up: function () {
    var that = this;
    //上拉
    http(URL.homeUrl, { pageIndex: that.data.pageIndex, pageSize: that.data.pageSize }).then((data) => {
      const list = data.data.list;
      if (list.length <= that.data.listLength) {//没有新数据
        that.setData({
          noListDataShow: true,
          loading: false
        })
      } else {

        var arr = that.data.list.concat(that.fiterArr(list));
        console.log(arr)
        that.setData({
          list: arr,
          noListDataShow: false,
          loading: false
        },()=>{
          that.setData({ loading: false})
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  // 上拉事件
  onReachBottom: function () {
    console.log('上啦了')
    let that = this;
    //const pageSize = 5
    if (that.data.noListDataShow){
      return;
    }
    console.log('还有数据')
    that.setData({
      pullUpState: true, // 上拉状态
      loading:true,
      pageIndex: that.data.pageIndex + 1,
      pageSize: (that.data.pageSize )
    }, () => {
      that.up();
    });

  },
  // 下拉事件
  onPullDownRefresh: function () {
   
    var that = this;
    that.setData({
      pageIndex: 1,
      pageSize: 5
    }, () => {
      that.getHomeData();
      wx.stopPullDownRefresh();
    });
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '品质好物，用心臻选',
      path: `/pages/Home/Home?promotionCode=${app.globalData.mid}`
    }
  }
})