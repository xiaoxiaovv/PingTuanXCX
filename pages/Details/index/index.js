// pages/Details/index/index.js

const config = require('./../../../config/index.js');
const URL = require('./../../../config/url.js');
const http = require('./../../../config/http.js');
const formatDate = require('../../../utils/util.js').formatDate;

var tan = function () { };
var paramObj = {};
const app = getApp();

Page({   
  /**   
   * 页面的初始数据  
   */
  data: {
    load:true,
    isOnShow:false,
    timer:null,
    result:{
      endList:[],
      id:0,
    },
    endTimeList:[],
    nowTimer:0,
    hours: '00',
    minutes: '00',
    seconds: '00',
    zhe_zhao_ceng:true,
    videoHidden:true,
    autoplay:true,
    video_btn:true,
    auto:[],    //经过计算之后每张图片的宽高 
    bottom: true,
    groupId: '',
    myType: 1,
    bottomAutoplay: true,
    video: true,
    swiper: false,
    videoUrl: '',
    list: [0, 1],
    sgAttribute1: [],
    commentList: [],
    sgAttribute2: [],
    sgAttribute3: [],
    sgStoreAttribute: [],
    detailImgs: [],
    isScroll: false,
    yixuan: "玫瑰红",
    yixuan_size: "23",
    active: 0,
    active2: 0,
    count: 1,
    SKU: '', //物流编码测试
    storeId: 0, //店铺ID测试  
    barClassName: app.globalData.isIphoneX ? 'bottom-content-phonex' : '',  //兼容iphonex 
    goodsClassName: app.globalData.isIphoneX ? 'bottom-high' : '',  //兼容iphonex 
    phonexClass: app.globalData.isIphoneX ? 'footer-phonex' : '',  //兼容iphonex ，
    isIphoneX: app.globalData.isIphoneX,       
    barList: [{
      imgUrl: '/imgs/homes.png',
      text: '首页',
      text2_color: '#999999',
      bar_backgroundColor: 'white',
      pageUrl: '/pages/Home/Home',
      },
      {
        imgUrl: '/imgs/kf@2x.png',
        text: '客服',
        text2_color: '#999999',
        bar_backgroundColor: 'white',
        pageUrl: '',
      },
      {
        price: 0,
        text: '单独购买',        
        bar_backgroundColor: 'white',
        text1_color: '#000000',
        // pageUrl: '',
      },
      {
        price: 0,
        text: '发起拼团',
        text2_color: '#FFFFFF',
        bar_backgroundColor: '#FF6026',
        text1_color: '#FFFFFF',
        // pageUrl: '/pages/Success/Success',
      }
    ],
    /** nuche**/
    productId: 0,
    skulist: [],
    sukData: [],
    skuPrice: "",
    skuimg: "",
    skustock: "",
    minSkustock:"",
    skuNum: 1,
    skuCode: '',//skku  or spu
    skuHidden: 'sku_hidden',
    proType: 0,
    proFlag: 0,
    groupId:0,
    gray:'gray',
    videoCss:"", //设置有视频时候轮播图的大小
    videoUrl:""
  },
  //多张图片自适应宽高
  autoImage: function(e) {
    var myHeight=0;   //自适应图片总高度
    var imageWidth=e.detail.width;   //获取图片真实宽度
    var imageHeight = e.detail.height;   //获取图片真实高度
    var imageScale = imageWidth / imageHeight;    //图片真实宽高比
    var autoWidth='';    //自适应宽度
    var autoHeight='';   //自适应高度
     wx.getSystemInfo({   //获取屏幕宽度
       success: function(res) {
         autoWidth=res.windowWidth;   //自适应宽度等于屏幕宽度
         autoHeight = autoWidth / imageScale;   //自适应高度等于图片宽度/图片的真实宽高比
       },
     });

    var image=this.data.auto;
    image[e.currentTarget.index]={
      width: autoWidth,
      height: autoHeight,
    }
    // for (var i = 0; i < this.data.detailImgs.length; i++) {
    //   myHeight = myHeight + image[i].height;
    // }
    this.setData({
      auto:image,
      // myHeight: myHeight,
    })


  },
  //退出视频
  videoSignOut:function(){
    this.videoContext.pause();
    this.videoContext.seek(0);;
    this.setData({
      videoHidden: true,
      video_btn:true,
    })
  },
  //通过轮播图获取视频播放地址
  getVideoUrl:function(e){
    var index=e.currentTarget.dataset.index;
    if (this.data.medias[index].type==1){
      this.setData({
        videoUrl: this.data.medias[index].videoUrl,
        videoHidden:false,
        video_btn:false,
      })
      this.videoNetwork();
    }
  },

  //停止播放视频
  bindStop: function() {
    this.videoContext.pause();
  },
  //开始播放视频
  bindPlay: function() {
    // this.videoContext.seek(0);
    this.videoContext.play();
    this.setData({
      autoplay:true,
    })
    console.log('autoplay=====' + this.data.autoplay)
  },
  bindchange: function(e) {
    var current = e.detail.current;
    if (current != 0) {
      this.bindStop();
    } else {
      this.videoContext.seek(0);
    }
  },
  //去拼团跳转
  onCollage: function(e) {
    var token = app.globalData.token;
    if (token == "" || token == null) {
      wx.navigateTo({
        url: '/pages/common/commonLogin/commonLogin',
      })
      return false
    }
    if (token.indexOf('#') > -1) {
      // 登录过
      var index = e.currentTarget.dataset.index;
      var groupId = this.data.groups[index].id; //获取团id
      this.skuShow(e, 1); //sku弹出层
      this.setData({
        myType: 1,
        groupId: groupId,
      })
    } else {

      wx.navigateTo({
        url: '/pages/common/commonLogin/commonLogin',
      })

    }
    
  },
  //获取单价、库存、图片
  // onList: function() {
  //   var that = this;
  //   var getList = [];
  //   var strId = this.data.colorId + ',' + this.data.sizeId + ',' + this.data.typeId;
  //   for (var i = 0; i < this.data.sgStoreAttribute.length; i++) {
  //     if (this.data.sgStoreAttribute[i].attrIds == strId) {
  //       var price = this.data.sgStoreAttribute[i].price; //单价
  //       var num = this.data.sgStoreAttribute[i].num; //库存
  //       if (num == null) {
  //         that.setData({
  //           kucun: 0,
  //         })
  //       };
  //       var imgUrl = this.data.sgStoreAttribute[i].pic; //图片
  //       // var productId = this.data.sgStoreAttribute[i].productId;  
  //       getList[0] = price;
  //       getList[1] = num;
  //       getList[2] = imgUrl;
  //     }
  //     break;
  //   }
  //   return getList;
  // },
  getCheckStock: function() {
    var that = this;
    // 2 716 937 12024841
    // 默认的省市区
    http(URL.checkStockUrl, {
      productId: that.data.productId,
      sku: this.data.SKU,
      number: 1,
      provinceId: 2,
      cityId: 716,
      regionId: 937,
      streetId: 12024841,
    }).then((res) => {
      console.log(res);
      if (res.success) {
        let data = res.data;
        let commission = data.commission;
        let hasStock = data.hasStock;
        let isB2C = data.isB2C;
        let stockType = data.stockType;
        let storeId = data.o2oStoreId == null ? 0 : data.o2oStoreId;
        let stockNum = data.stockNum;
        that.setData({ commission, hasStock, isB2C, stockType, storeId, stockNum});

        //如果storeId = 0 的时候提示商品已经下架          

        if (storeId==0){  
          that.setData({
            goodsDown:"goods_down_show",
            GPopacity:'goods_price_opacity'           
          })
        }       
        that.setData({
          minSkustock: stockNum
        })
     
      }      
    }).catch((err) => {
      console.log('checkStock调用失败---------------------');
    })
  },
   fn:function() {
    var that = this;
    var  nTime = new Date().getTime();
    var endList = that.data.endTimeList;     
    var ctime,timerArr=[];
        
    //补零函数
    function addZero(num) {
      return num < 10 ? '0' + num : num;
    }
    endList.forEach((item)=>{
      // console.log(item)
     var sTime = Date.parse(new Date(item.replace(/-/g, '/'))),
         ctime = sTime - nTime;
      var obj = null;
      // 如果活动未结束，对时间进行处理
      if (sTime - nTime > 0){
        // 获取天、时、分、秒
        var hours1 = Math.floor(ctime / 1000 / 60 / 60),
            minutes1 = Math.floor(ctime / 1000 / 60 % 60),
            seconds1 = Math.floor(ctime / 1000 % 60);
      
        obj = { 
          hours: addZero(hours1),
          minutes: addZero(minutes1),
          seconds: addZero(seconds1)
        }
      }else{//活动已结束，全部设置为'00'
        obj = {
          hours: '00',
          minutes: '00',
          seconds: '00'
        }
        clearTimeout(that.data.timer);
      }
      timerArr.push(obj)
    })
    var timer = setTimeout(this.fn,1000);
    var id = that.data.result.id;
    that.setData({
      result:{
        endList:timerArr,
        id:id
      },
      timer
    })
    // console.log(that.data.result)
  },
  //商品规格 Attribute 接口(商品sku接口)
  getAttribute: function () {
    var that = this;
    // 2 716 937 12024841
    http(URL.skuUrl, {
      productId: that.data.productId,
      sku: this.data.SKU,
      storeId: this.data.storeId,
      flag: this.data.flag,
    }).then((res) => {
      // if(res.success){
        console.log('-----getAttribute------');
        let data = res.data;
        console.log(data);
      // }
        let sgAttribute = data.sgAttribute;
        let sgStoreAttribute = data.sgStoreAttribute;
        let AttributeKeyArr = Object.keys(sgAttribute);
        console.log(AttributeKeyArr);

      that.setData({ 
        AttributeKeyArr: AttributeKeyArr,
        sgStoreAttribute: sgStoreAttribute
      })

    }).catch((err) => {
      console.log(`商品sku接口-请求.catch:${JSON.stringify(err)}`);
    })
  },
  //商品图文介绍接口
  getPromos: function() {
    var that = this;
    http(URL.promosUrl, {
      productId: that.data.productId
    }).then((data) => {
      that.setData({
        detailImgs: data.data.detailImgs,
      })
    }).catch((err) => {
      console.log(err);
    })
  },
  //评价列表数据
  getComments: function() {
    var that = this;
    http(URL.commentsUrl, {
      commentType: 'all',
      flag: 'item',
      pageIndex: 1,
      pageSize: 2,
      productId: that.data.productId
    }).then((res) => {
      if (res.success) {
        let data = res.data;
        if (Array.isArray(data)) {
          for (let i = 0, leni = data.length; i < leni; i += 1) {
            data[i].createTime = formatDate(data[i].createTime);
          }
        }
        that.setData({
          commentList: data, //评论数组
          commentLength: data.length,
        })
      } else {
        console.log(`评价列表接口后端返回错误:${res.message}`);
      }
    }).catch((err) => {
      console.log(`评价列表接口-请求.catch:${JSON.stringify(err)}`);
    })
  },
  //商品信息数据
  initData: function() {
    var that = this;

   // console.log('!!!app.globalData.isIphoneX!!', app.globalData.isIphoneX)
  

    http(URL.detail_indexUrl, {
      activityId: this.data.activityId ? this.data.activityId:0,      
      productId: this.data.productId ? this.data.productId:0 ,    
      }).then((res) => {
        if (res.success) {
          let data = res.data;

          let medias = data.medias
          let videoCss=""
          let videoUrl=""
          let startPlayIco=""
          let productImg = ""
          for (let i = 0; i < medias.length; i++) {
            if (medias[i].type == 0) {
              productImg = medias[i].imageUrl;             
              break
            } 
            //判断是否有视频，如果有视频  swiper  960rpx ，没有 750rpx
            if (medias[i].type == 1) {
              // console.log("medias[i].videoUrlmedias[i].videoUrlmedias[i].videoUrl")
              //  console.log(medias[i].videoUrl)
              if (medias[i].videoUrl != "" || medias[i].videoUrl != null) {
                videoCss = "video_css";
                startPlayIco ='show_vbtn'
                videoUrl = medias[i].videoUrl
              } else {
                videoCss = "";

              }
            }
          }
          that.setData({
            result: {
              endList: data.groups,
              id: data.id
            },
            videoCss: videoCss, //设置有视频时候轮播图的大小
            startPlayIco:startPlayIco,
            videoUrl: videoUrl,
            nowTimer: data.nTime,
            activityName: data.activityName, //活动名称
            medias: data.medias, //轮播图数组
            num: data.num, //成团数
            boughtNum: data.boughtNum, //已拼数量
            groupBuyPrice: data.groupBuyPrice.toFixed(2), //拼团价
            singleBuyPrice: data.singleBuyPrice.toFixed(2), //单买价格
            groups: data.groups, //正在进行中的团
            id: data.id, //活动Id
            groupId: data.id,
            productId: data.productId, //商品Id
            productName: data.productName, //商品名称
            spu: data.spu, //商品spu
            SKU: data.spu,
            productImg: productImg,
          }, () => {
            if (that.data.groups) {
              var arr = [];
              for (var i = 0; i < that.data.groups.length; i++) {
                arr.push(that.data.groups[i].eTime)
              }
              that.setData({
                endTimeList: arr
              })
              that.fn(); //倒计时
            }

            that.getComments(); //评价列表数据
            that.getPromos(); //商品图文介绍接口
            that.getCheckStock();//获取库存接口

            if (that.data.groups.length < 3) {
              this.setData({
                bottomAutoplay: false,
              })
            } else {
              that.setData({
                bottomAutoplay: true,
              })
            }
            if (that.data.groups.length > 0) { //如果有团就显示
              that.setData({
                bottom: false,
              })
            }

            // console.log('groups.length=========' + this.data.groups.length)
          })

        } else {
          console.log(`商品信息数据后端返回错误:${res.message}`);
        }
      }).catch((err) => {
        console.log(`商品信息数据-请求.catch:${JSON.stringify(err)}`);
      })
   
  },
  LoadSkuData: function (flag) {  
    /** 何兴 SKU **/
    var that = this; 
    http(URL.skuUrl, {
        productId: this.data.productId,
        sku: this.data.spu,
        storeId: this.data.storeId,
      // productId: 1000247,
      // sku: 'JiaJu001',
      // storeId: 1821106672,
      flag: flag,
    }).then((res) => {
     // console.log("*******999999999******")
      //console.log(res)
      let data = res.data;
      let sgAttribute = data.sgAttribute; //
      let sgStoreAttribute = data.sgStoreAttribute;
      //绑定SKU数据
      this.BindSKUToUI(sgAttribute);
      //设置默认的SUK
      this.SetSukData(sgStoreAttribute);
      // console.log("*******何兴******")
      // console.log(sgAttribute)
      // console.log("重构完成的json")
      this.setData({
        sukData: sgStoreAttribute
      })
    }).catch((err) => {
      console.log(`商品sku接口-请求.catch:${JSON.stringify(err)}`);
    })

    /** 何兴 SKU **/
  },
  //判断网络类型
  isNetwork: function (network){
    /* vedio start */
    var that = this;
    let videoContext = wx.createVideoContext('myVideo')
    //console.log(network)  
    if (network == 'wifi') {
      videoContext.play();
      this.setData({ vedioPaly: "hidden_vbtn", autoplay: false })
    }
    else if (network == 'none') {
      videoContext.pause();
      videoContext.showStatusBar()
      wx.showToast({
        title: '当前暂无可用网络',
        icon: 'none',
        duration: 2000
      })
      this.setData({ vedioPaly: "show_vbtn" })

      if (this.data.showPlayIco) {
        this.setData({ autoplay: false })
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
      this.setData({ vedioPaly: "show_vbtn" })
      if (this.data.showPlayIco) {
        this.setData({ autoplay: true})
      }
    }
    console.log("this.data.vedioPalythis.data.vedioPalythis.data.vedioPalythis.data.vedioPaly")
    console.log(this.data.vedioPaly)
    /* vedio end  */
 
  },
  ResumeVedio: function () {
    wx.createVideoContext('myVideo').play();
    this.setData({ vedioPaly: "hidden_vbtn"})
  },
  //通过网络类型控制视频播放
  videoNetwork:function(){
    let that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        that.isNetwork(networkType);
      }
    })
    wx.onNetworkStatusChange(function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      that.setData({ showPlayIco: true }) 
      var networkType = res.networkType;
      that.isNetwork(networkType);
    })
  },
  //点击弹出层播放视频
  videoAuto:function(){
    console.log('播放')
    this.videoContext.play();
    this.setData({
      autoplay:true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.videoContext = wx.createVideoContext('myVideo');
    var myType = options.type;
    if (myType) {
     // console.log('myType=============' + myType)
      this.setData({
        myType: myType,
      })
    }

    var activityId = options.activityId;
    // var productId = options.productId?options.productId:0;
    var productId = options.productId;
    //console.log('activityId=============' + activityId)
    this.setData({
      activityId: activityId,
      productId: productId,
      isOnShow:true
    }, () => {

    });

  },

  /* 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function (res) {
    console.log(res)
    var that = this;
    that.data.load = false;
    that.setData({
      load: that.data.load,
      skuNum: 1
    })
    //clearTimeout(that.data.timer);
   // that.fn();
   if(this.data.isOnShow){
    that.initData()
   }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('yincnag')
    var that = this;
    clearTimeout(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
   console.log('yemian ')
    var that = this;
    clearTimeout(this.data.timer);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from == 'button') {    
     //来自页面的转发
      console.log('res.target====' + res.target)
    }
    var myNickName, mid='';
    if (app.globalData.sgUserInfo == null || app.globalData.sgUserInfo == undefined) {
      myNickName = '小逛';
    } else {
      myNickName = app.globalData.sgUserInfo.nickName;
      mid = app.globalData.mid;
    }    
    let abc = this.data.medias[0]; 
    return {
      title: '【' + myNickName + '】超值推荐 | ' +this.data.productName,
      path: `/pages/Details/index/index?activityId=${this.data.activityId}&promotionCode=${mid}`,
      imageUrl: abc.imageUrl
    }
  },

  //sku弹出层
  // tan: function () {
  //   var list = this.onList();
  //   var price = list[0];
  //   var kucun = list[1];
  //   var imgUrl = list[2];
  //   this.setData({
  //     price: price,
  //     kucun: kucun,
  //     imgUrl: imgUrl,
  //   })
  //   this.data.isScroll = !this.data.isScroll;
  //   this.setData({
  //     isScroll: this.data.isScroll,
  //     // price: this.data.sgStoreAttribute[0].price,
  //   })
  // },  
  myPage: function (e) {
    //页面跳转
    var index = e.currentTarget.dataset.id;
    this.setData({
      index: index,
    })
    if (index == 0) {
      wx.switchTab({
        url:'/pages/Home/Home',
      })
    } else {
      if (index == 2) { //单独购买
        this.setData({
          flag: 0,
          myType: 9,
        }, ()=>{

        });
      } else if (index == 3) { 
                //拼团购买
        this.setData({
          flag: 1,
        }, ()=>{
          if (this.data.myType != 1) {
            this.setData({
              myType: 6,
            }, ()=>{
              this.getAttribute(); //调用sku接口
            })
          }
        })
        
      }
      console.log('zhe_zhao_ceng====' + this.data.zhe_zhao_ceng)
    }

  }, 
  seePingjia: function () {
    var that = this;
    //判断评价数量
    http(URL.pingCountUrl, { productId: that.data.productId}).then((data) => {
      console.log(data)
      if (data.data.totalNum){//有评价
        wx.navigateTo({
          url: '/pages/Pinglun/Pinglun?productId=' + that.data.productId,
        })
      }
    })
    
    
  },
  BindSKUToUI: function (sgAttribute) {
    //重构Json数据
   //console.log("重构Json数据")
  // console.log(sgAttribute)
    let skulist = [] //sku 属性列表
    for (let name in sgAttribute) {
      let skuAttr = []
      for (let i = 0; i < sgAttribute[name].length; i++) {
        skuAttr = sgAttribute[name];
      }
      let sku = { "skuCode": name, "skuKey": sgAttribute[name][0].attrName, 'skuAttr': skuAttr }
      skulist.push(sku)
    }    

    this.setData({
       skulist: skulist  
    })
    if(skulist.length == 0) {
      this.setData({
        min_wrap: "sku_show"
      })
    } else {
      this.setData({
        skuHidden: "sku_show"
      })
    }
  },
  SetSukData: function (sgStoreAttribute) {
    var that = this;
    let skuPrice = "";//价格
    let skustock = "0"
    let skuimg = ""
    let skuIds = "";//选择的描述
    let skuValue = ""
    let skuCode = ""
  

    //获取 数据池里面的 拉起一个有库存的SKU
    for (let i = 0; i < sgStoreAttribute.length; i++) {
      if (sgStoreAttribute[i].num > 0) {
        skuIds = sgStoreAttribute[i].attrIds
        skuValue = sgStoreAttribute[i].attrValueIds
        skuimg = sgStoreAttribute[i].pic
        skuPrice = sgStoreAttribute[i].price
        skuCode = sgStoreAttribute[i].skku
        skustock = sgStoreAttribute[i].num     
        break;
      }
    }
    //如果全部没有货，就拿第一个SKU
    if (skuIds==""){          
       this.setData({
         gobuy_gray: that.data.minSkustock ? '' : "gobuy_gray",
       })
      for (let i = 0; i < sgStoreAttribute.length; i++) {         
          skuIds = sgStoreAttribute[i].attrIds
          skuValue = sgStoreAttribute[i].attrValueIds
          skuimg = sgStoreAttribute[i].pic
          skuPrice = sgStoreAttribute[i].price
          skuCode = sgStoreAttribute[i].skku
          skustock = sgStoreAttribute[i].num
          break;
        
      }
    }
 
   
    let skulist = this.data.skulist;  

    // 获取数组的内容
    let _code="";
    let _sku="";
    let skuIdsArr = skuIds.split(',')
    let skuValueArr = skuValue.split(',')
    //假如  skuIds  和 skuValue 完全是 1-1 的话
    let skuwrap = []; //选择的信息描述   
    for (let i = 0; i < skuIdsArr.length; i++) {
      //第一层换行获取sku的key 的名字     
      for (let a = 0; a < skulist.length; a++) {
        let skuAttr = skulist[a].skuAttr
        //第二层换行获取sku的value 的名字
        for (let b = 0; b < skuAttr.length; b++) {
          if (skuValueArr[i] == skuAttr[b].sgAttribute.id) {

            if (skustock!="0"){ //如果有货可以标红
              skuAttr[b].sgAttribute.ishot = "sku_red"    
            }       
            
            skuwrap.push({ "codeid": skuIdsArr[i], "id": skuAttr[b].sgAttribute.id, "name": skuAttr[b].sgAttribute.attrValueName })
          if(i==0){ //获取一级SKU数据，判断是否有货
            _code = skuAttr[b].sgAttribute.id
            _sku = skuAttr[b].sgAttribute.attrCode
          }


          }
          // console.log(skuIdsArr[i] + "--" + skuValueArr[i] + "--" + skuAttr[b].sgAttribute.id)
          //设置无货不可选择的情况
          // if(){
          //   gray
          // }
        }
      }
    }

    /*******判断查库存问题******/
    // 1. 获取没有货的商品组合 如  ["1112,1115",""]
    let noStock = [] //无货组合的数组
    for (let d = 0; d < sgStoreAttribute.length; d++) {
      if (sgStoreAttribute[d].num == 0) {
        noStock.push({ "ids": sgStoreAttribute[d].attrValueIds })
      }
    }
    //noStock.push({ "ids": "1112,1115" }) //测试   
    // console.log("无货的组合：")
    //  console.log(noStock)
    // console.log(sgStoreAttribute)
    // console.log("_sku" + _sku)
    // console.log("_code" + _code)
    // 2. 循环无货数组， skulist ，设定多级SKU的状态 ， if(在组合中){设置灰色}
    // 通过 sku ID 判断下一级
    for (let i = 1; i < skulist.length; i++) {
     /// console.log("skulist[i].skuCode " + skulist[i].skuCode)    
        //获取二级属性
        let skuAttr = skulist[i].skuAttr //获取SKU设置清单      
        for (let b = 0; b < skuAttr.length; b++) {
          let _ids = _code + "," + skuAttr[b].sgAttribute.id
        //  console.log("属性 -_ids:" + _ids)          
          for (let n = 0; n < noStock.length; n++) {
          //  console.log("属性 -noStock" + noStock[n].ids)
            if (_ids == noStock[n].ids) {
             // console.log("点击的属性-id：" + skuAttr[b].sgAttribute.id)
              skuAttr[b].sgAttribute.noStock = "noStock"
            } else {
              skuAttr[b].sgAttribute.noStock = ""
            }
          }
        }      
    }

    /*******判断查库存问题******/


    // console.log("one2")
    //console.log(JSON.stringify(skuwrap))
    this.setData({
      skuwrap: skuwrap,
      skuPrice: skuPrice,
      skustock: skustock,
      skuimg: skuimg,
      skulist: skulist,
      skuCode: skuCode
    })
    // console.log("有库存的sku"+skuIds + "-" + skuValue)
  },
  ChoiceSku: function (e) { //用户选择属性
    let sku = e.currentTarget.dataset.sku;
    let code = e.currentTarget.dataset.code;

    //如果没有库存不能点击
    let data_noStock = e.currentTarget.dataset.nostock;
    if (data_noStock == "noStock"){       
       return false
    }

   // console.log("继续执行" + data_noStock)

    // 获取数组的内容
    let skulist = this.data.skulist;
    let skuwrap = this.data.skuwrap;//当前选择的SKU属性
    let sukData = this.data.sukData;// 库存图片价格等数据

    // console.log("skulistskulistskulistskulist")
    // console.log(JSON.stringify(skulist))
    // console.log(JSON.stringify(skuwrap))
    // console.log(JSON.stringify(this.data.sukData))
   //开始循环获取设置
    for (let i = 0; i < skulist.length; i++) {
      if (skulist[i].skuCode == code) {        
        let skuAttr = skulist[i].skuAttr
        //第二层换行获取sku的value 的名字
        for (let b = 0; b < skuAttr.length; b++) {
          if (sku == skuAttr[b].sgAttribute.id) {
            skuAttr[b].sgAttribute.ishot = "sku_red"//设置选中
            //第三层 修改 SKU显示的数据
            for (let s = 0; s < skuwrap.length; s++) {              
              if (skuAttr[b].sgAttribute.attrCode == skuwrap[s].codeid) {
                skuwrap[s].name = skuAttr[b].sgAttribute.attrValueName
                skuwrap[s].id = skuAttr[b].sgAttribute.id
              }
            }
          } else {
            skuAttr[b].sgAttribute.ishot = "" 
          }
        }
      }
    }

    /*******判断查库存问题******/
     // 1. 获取没有货的商品组合 如  ["1112,1115",""]
    let noStock = [] //无货组合的数组
    for (let d = 0; d < sukData.length; d++) {
      if (sukData[d].num == 0) {        
        noStock.push({"ids":sukData[d].attrValueIds})
      }
    } 
    //noStock.push({ "ids": "1112,1115" }) //测试   
    // console.log("无货的组合：")
    // console.log(noStock)

     // 2. 循环无货数组， skulist ，设定多级SKU的状态 ， if(在组合中){设置灰色}
    // 通过 sku ID 判断下一级
     for (let i = 1; i < skulist.length; i++) {
      let skuAttr = skulist[i].skuAttr //获取SKU设置清单   
      if (skulist[i].skuCode != code){
        for (let b = 0; b < skuAttr.length; b++) {
          skuAttr[b].sgAttribute.noStock = ""
        }
           //获取二级属性            
        for (let b = 0; b < skuAttr.length; b++) {          
          let _ids = sku + "," + skuAttr[b].sgAttribute.id
          for (let n = 0; n < noStock.length; n++) {     
            if (_ids == noStock[n].ids){
             // console.log("点击的属性 -attrValueName：" + skuAttr[b].sgAttribute.attrValueName)
            //  console.log("点击的属性-id：" + skuAttr[b].sgAttribute.id)
              skuAttr[b].sgAttribute.noStock = "noStock"
              skuAttr[b].sgAttribute.ishot = ""      
             } 
          }
        }         
      }
    }

    /*******判断查库存问题******/



    //判断选择完成后的库存和是否有货

    //1. 拼接 attrValueIds
    let skuwrapids = ""
    for (let i = 0; i < skuwrap.length; i++) {
      skuwrapids = skuwrapids + "," + skuwrap[i].id
    }
    skuwrapids = skuwrapids.substring(1, skuwrapids.length)   
    //2. 循环判断
   
    let skuPrice = "";//价格
    let skustock = "0"
    let skuimg = "";//图片
    let skku = "";//SKKU

    for (let i = 0; i < sukData.length; i++) {
      //  console.log(sukData[i].attrValueIds +"=="+ skuwrapids)
      if (sukData[i].attrValueIds == skuwrapids) {    
        skuPrice = sukData[i].price
        skustock = sukData[i].num 
        skuimg = sukData[i].pic
        skku = sukData[i].skku

      }
    }
    //  console.log("choice")
    //  console.log(JSON.stringify(skuwrap))
    this.setData({
      skuwrap: skuwrap,
      skulist: skulist,
      skuPrice: skuPrice,
      skustock: skustock,
      skuimg: skuimg,
      skuCode: skku,
      skuNum:1
    }) 

    //按钮的颜色
    if (skustock== "0")  {
      this.setData({
        gobuy_gray:"gobuy_gray"
      })      
    }else{
      this.setData({
        gobuy_gray: ""
      }) 
    }
    // console.log(sku + "---" + code)
  },
  sKuClose: function () {
    // console.log("关闭")
    this.setData({
      skuHidden: "sku_hidden"
    })
  },
  minClose: function () {
    // console.log("关闭")
    this.setData({
      min_wrap: "sku_hidden"
    })
  },  
  skuShow: function (e, gb) {  //获取商品信息  0 直接购买   1 发起拼团 
    var that = this;
    
    //如果商品已经下架，不再只执行下面的操作    
    let tabid = e.currentTarget.dataset.id;
    
    if (this.data.goodsDown == "goods_down_show") {
      return false
    }  
    //判断显示的窗体  min_wrap skuHidden
    this.videoSignOut();  //关闭视频
    var token = app.globalData.token; 

    if (token == "" || token == null) {
      wx.navigateTo({
        url: '/pages/common/commonLogin/commonLogin',
      })
      return false
    }

    if (token.indexOf('#') > -1) { 
   //获取数据       
      let proType=0;
      let proFlag = 0;
      if (tabid == 3) {
        proType= 6 
        proFlag= 1
        var id = that.data.result.id;       
        that.setData({ groupId : id})
      }
      if (tabid == 2) {
       console.log('dan du ')
        proType = 9
        proFlag = 0
      }
      if (gb==1){
        proType = 1
        proFlag = 1
         
      }     
      this.setData({
        proType,proFlag
      })
      this.LoadSkuData(tabid == 2?0:1)//加载SKU数据
      // 上传 formId;
      let formId = e.detail.formId;
      // console.log(formId);
      http(URL.formIdUrl, { formId });
      // this.setData({
      //   skuHidden: "sku_show"
      // })

    } else {

      wx.navigateTo({
        url: '/pages/common/commonLogin/commonLogin',
      })
    }
  
  },
  skuKey: function (e) {
    console.log("skuKey")
    let value = e.detail.value
    if (!isNaN(value)) {
      if (value > 100) value = 100
      if (value < 1) value = 1
      if (value > this.data.skustock) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        })
        value = this.data.skustock
        console.log("库存不足库存不足库存不足库存不足" + value + "--" + this.data.skustock)
      }    
      this.setData({
        skuNum: value
      })
    } else {
      this.setData({
        skuNum: 1
      })
    }

    this.setData({
      skuHidden: "sku_show"
    })
  },

  skuKeyMin: function (e) {   
    let value = e.detail.value
    if (!isNaN(value)) {
      if (value > 100) value = 100
      if (value < 1) value = 1  
      if (value > this.data.minSkustock) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        })
        value = this.data.minSkustock
      }
      this.setData({
        skuNum: value
      })
    }else{
      this.setData({
        skuNum: 1
      })
    }
   
  },  
  skuNumAdd: function () {
    let skuNum = this.data.skuNum;
    skuNum += 1  
    if (this.data.skustock == "0"){
      wx.showToast({
        title: '该商品暂时无货',
        icon: 'none',
        duration: 2000
      })
      return false
     }   
     if (skuNum > this.data.skustock){
       wx.showToast({
         title: '库存不足',
         icon: 'none',
         duration: 2000
       })
       skuNum = this.data.skustock
     }    
    if (skuNum > 100) value = 100
    this.setData({
      skuNum: skuNum
    })
  },

  skuNumMinus: function () {
    let skuNum = this.data.skuNum;
    if (skuNum == 1) return
    skuNum -= 1
    this.setData({
      skuNum: skuNum
    })
  },
  skuNumMinusMin: function () {
    let skuNum = this.data.skuNum;
    if (skuNum == 1) return
    skuNum -= 1
    this.setData({
      skuNum: skuNum
    })
  },
  
  skuNumAddMin: function () {
    let skuNum = this.data.skuNum;
    skuNum += 1    
    if (skuNum > this.data.minSkustock) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
      skuNum = this.data.minSkustock
    }
    if (skuNum > 100) value = 100
    this.setData({
      skuNum: skuNum
    })
  },
  goBuy: function (e) {
    var that = this;

    
    let stock = e.currentTarget.dataset.stock;
    if (stock == "0") {
      wx.showToast({
        title: '该商品暂时无货',
        icon: 'none',
        duration: 2000
      })
      return false
    }
       
    let skuName = [];
    let skuwrap = this.data.skuwrap
    if (skuwrap){
      for (let i = 0; i < skuwrap.length; i++) {
        skuName.push(skuwrap[i].name)
      }
    }    
 
    // 上传 formId;
    let formId = e.detail.formId;
    // console.log(formId);
    http(URL.formIdUrl, { formId })
    
    let cs = '/pages/Order/PutOrder/PutOrder?flag='
      + 1 + '&name='
      + skuName + '&num='
      + this.data.count + '&proId='
      + this.data.productId + '&type='
      + this.data.proType + '&sku='
      + this.data.skuCode + '&id='
      + this.data.groupId
    console.log(cs)

    var obj = {
      flag: this.data.proFlag * 1,
      name: skuName,
      num: this.data.skuNum * 1,
      productId: this.data.productId * 1,
      sku: this.data.skuCode,
      shareId: 28056363,
      streetId: null,
      'type': this.data.proType,
      id: this.data.groupId * 1,
    }
    wx.setStorage({
      key: 'order-info',
      data: obj,
    })

    //跳支付页
    //return false
    //flag = 0直接购买   1拼团
    //name = 选择的名称 “红色，44码，板鞋”
    //num  购买数量
    //productId  = 商品ID  productId
    //type  区分参团   + 发起参团   1  6   9单独买
    //sku  === spu没有属性     skku 有属性
    //groupId  ==   1. 去拼团 groupId == 团id；  6.发起拼团 groupId= 活动id；  9.单独购买 groupId 不传
    this.setData({
      skuHidden: "sku_hidden"
    })
    
    wx.navigateTo({
      url: '/pages/Order/PutOrder/PutOrder?flag='
      + this.data.proFlag + '&name='
      + skuName + '&num='
      + this.data.skuNum + '&proId='
      + this.data.productId + '&type='
      + this.data.proType + '&sku='
      + this.data.skuCode + '&id='
      + this.data.groupId,
    })
  },  
  bindPause: function () {
    this.setData({ vedioPaly: "show_vbtn" })

  },
  bindPlay: function () {
    this.setData({ vedioPaly: "hidden_vbtn" })    
  },
  startPlay: function () {
    this.setData({ vedioPaly: "hidden_vbtn" })
    var  that= this;
   this.setData({  
      videoUrl: this.data.videoUrl,  
      videoHidden: false,
      video_btn: false,
    },()=>{
      that.videoNetwork();
      //  let videoContext = wx.createVideoContext('myVideo')
      // videoContext.play();
    })
    

 
  },
  
  bindEnded: function () {
    this.setData({ vedioPaly: "hidden_vbtn" })
  },
  close_suk: function () {
    this.setData({ skuHidden: "sku_hidden", min_wrap: "sku_hidden"})
  }
})