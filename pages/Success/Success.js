//pages/Pinman/Pinman
//获取应用实例
const app = getApp()

const config = require('./../../config/index.js');
const URL = require('./../../config/url.js');
const http = require('./../../config/http.js');



Page({

  /** 
  * 页面的初始数据
  */
  data: {
    youke: false,
    load:true,
    networkType:false,
    youke_man:false,
    member: false,
    arr2:[],
    skulist: [],
    sukData: [],
    skuPrice: "",
    skuimg: "",
    skustock: "",
    minSkustock: "",
    skuNum: 1,
    skuCode: '',//skku  or spu
    skuHidden: 'sku_hidden',
    pin: {},
    a:1,
    shengPrice:0,
    other:[],
    result:{
      endList:[],
      id:0
    },
    timer:null,
    endTimeList:[],

    success: false,
    pinTuanzhong: false,
    fail: false,
    loading: false,
    tuijian: [],
    Tuan: false,
    tuaninfo: {},
    hours: 0,
    minutes: 0,
    seconds: 0,
  },

  //商品详情
  goodsDetail: function () {
    wx.navigateTo({
      url: '/pages/Details/index/index?activityId='+this.data.pin.id,
    })
  },
  //订单详情 
  putOrder: function () {
    console.log(this.data.pin.orderProductIds[0])
    wx.navigateTo({
      // url: '/pages/Order/OrderPending/OrderPending?cOrderId=' + this.data.pin.orderProductIds[0],
      url: '/pages/Order/OrderPage/OrderPage?cOrderId=' + this.data.pin.orderProductIds[0] + "&cOrderSn=" + this.data.pin.orderProductSns[0]
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    console.log("onload了")
    var that = this;
    var token = app.globalData.token;
    if (token == "" || token == null) {
      console.log("没有token没有token没有token没有token没有token")
      that.setData({
        youke: true
      })
    }else if (token.indexOf('#') <= -1){
      console.log("没有token没有token没有token没有token没有token2")
      that.setData({
        youke: true
      })
    }
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        networkType === 'none' ? networkType = true : networkType = false
        if (networkType==true){
          that.data.load=false; //无网络不显示加载中
          that.setData({
            load: that.data.load
          })
        }
        that.setData({
          networkType
        })
      }
    })
    
    var id = options.id;//接收groupId
    //接收分享的memberId
    var promotionCode = options.promotionCode;
    wx.setStorage({
      key: 'promotionCode',
      data: promotionCode,
    })

    console.log(options)
    console.log(promotionCode)
    console.log(options.id+"--------------------------")
    var orderSn = options.orderSn; //接收订单号
    // that.setData({
    //   id:id,
    //   orderSn: orderSn
    // })
    // console.log(id);
    var time3 = "";
    var nTime = "";
    if(id){
      that.setData({
        id: id,
        groupId: id
        // orderSn: orderSn
      })
      http(URL.pinStatusUrl, { groupId: that.data.id}).then((data) => {
        var data = data.data;
        console.log(data)
        
        
        that.setData({
          pin: data,
          spu: data.spu,
          productId: data.productId,
          groupBuyPrice: data.groupBuyPrice.toFixed(2),
          singleBuyPrice: data.singleBuyPrice.toFixed(2),
          rNum: data.rNum,
          other: data.groups,
          leng : data.actors.length,
          other_length: data.groups.length
        },()=>{
          console.log(this.data.leng)
          console.log("长度长度长度长度长度长度")
          var arr=[]
          for(var i in that.data.pin.groups){
            arr.push(that.data.pin.groups[i].eTime)
          }
          that.setData({
            endTimeList: arr
          })
          // that.data.arr.length = that.data.rNum; //剩余人数
          // if(that.data.arr.length!=0){ //防止数组累计
            that.data.arr2.length = 0;
            that.setData({
              arr2: that.data.arr2
            })
          // }
          for (var i = 1; i <= that.data.pin.rNum; i++) {
            that.data.arr2.push("+")
          }
          that.setData({
            arr2: that.data.arr2
          })
          console.log("arrarrarrarrarrarrarrarr")
          console.log(that.data.arr2.length)
          console.log(that.data.pin.rNum)

          that.fn();
          that.down();
          that.initData(that.data.productId);
          
          //修改
          wx.getStorage({
            key: 'sgUserInfo',
            success: function (res) {
              console.log("自己的自己的自己的自己的自己的自己的自己的自己的")
              console.log(res.data)
              console.log(that.data.pin.actors)
              var mid2 = JSON.parse(res.data).mid;
              var pinArr = that.data.pin.actors;  //拼团成员
              var result = null;
              result = pinArr.some(function (item) {
                return item.memberId == mid2  //判断自己和成员memberId是否一致
              })
              if (result) { //是团长或团员
                console.log("result==true result==trueresult==true")
                that.setData({
                  member: true,
                  youke_man: false,
                  
                })
              } else {    //游客
                console.log("result==false result==falseresult==false")
                that.setData({
                  member: false,
                  youke_man: true,
                  
                })
              }
              
            },
          })
        })
        // that.fn();
        // that.initData(that.data.productId)
      }).catch((err) => {
        console.log("拼团状态接口调用失败！")
      })
      
    } else if (orderSn){
      that.setData({
        // id: id,
        orderSn: orderSn
      })
      http(URL.pinStatusUrl, { orderSn: that.data.orderSn }).then((data) => {
        var data = data.data;
        that.down(data.groups)
        
        that.setData({
          pin: data,
          spu: data.spu,
          productId: data.productId,
          groupBuyPrice: data.groupBuyPrice.toFixed(2),
          singleBuyPrice: data.singleBuyPrice.toFixed(2),
          rNum: data.rNum,
          other: data.groups,
          leng : data.actors.length,
          other_length: data.groups.length
          // arr: that.data.arr
        },()=>{
          console.log(this.data.leng)
          console.log("长度长度长度长度长度长度")
          var arr = []
          for (var i in that.data.pin.groups) {
            arr.push(that.data.pin.groups[i].eTime)
          }
          that.setData({
            endTimeList: arr
          })
          // that.data.arr.length = that.data.rNum; //剩余人数
          that.data.arr2.length = 0; //防止数组累加
          that.setData({
            arr2: that.data.arr2
          })
          for (var i = 1; i <= that.data.pin.rNum; i++) {
            that.data.arr2.push("+")
          }
          that.setData({
            arr2: that.data.arr2
          })
          console.log("arrarrarrarrarrarrarrarr")
          console.log(that.data.arr2.length)
          console.log(that.data.pin.rNum)
          that.fn();
          that.initData(that.data.productId);
          // this.down(that.data.other)
          //修改
          wx.getStorage({
            key: 'sgUserInfo',
            success: function (res) {
              console.log("自己的自己的自己的自己的自己的自己的自己的自己的")
              console.log(res.data)
              console.log(that.data.pin.actors)
              var mid2 = JSON.parse(res.data).mid;  //自己的memberId
              var pinArr = that.data.pin.actors;  //拼团成员
              var result = null;
              result = pinArr.some(function(item){
                return item.memberId == mid2  //判断自己和成员memberId是否一致
              })
              if(result){ //是团长或团员
                console.log("result==true result==trueresult==true")
                that.setData({
                    youke_man: false,
                    member: true
                  })
              }else{    //游客
                console.log("result==false result==falseresult==false")
                that.setData({
                    youke_man: true,
                    member: false
                  })
              }
              // for (var i in that.data.pin.actors) {
              //   if (that.data.pin.actors[i].memberId == mid2) {
              //     console.log("团长团员团长团员团长团员团长团员团长团员团长团员")
              //     that.setData({
              //       youke_man: false,
              //       member: true
              //     })
              //   } else {
              //     console.log("游客游客游客游客游客游客游客游客游客游客游客")
              //     that.setData({
              //       youke_man: true,
              //       member: false
              //     })
              //   }

              // }
            },
          })
        })
        // that.fn();
        // that.initData(that.data.productId);
        
      }).catch((err) => {
        console.log("拼团状态接口调用失败！")
      })
    }
    

  },
  fn:function(){
    var that = this;
    var time3 = that.data.pin.eTime; //结束时间
    var nTime = that.data.pin.nTime;  //开始时间
    let boughtNum = that.data.pin.boughtNum; //获取已拼人数
    let num = that.data.pin.num;  //获取成团人数
    let status = that.data.pin.groupStatus; //获取拼团状态0123
    var tuaninfo = that.data.pin;   //拼团商品、成员及时间
    var tuijian = that.data.pin.activites;  //推荐
    // tuijian.length = 5;
    var shengPrice = that.data.pin.singleBuyPrice - that.data.pin.groupBuyPrice;
    for(var i in tuijian){
      tuijian[i].groupBuyPrice = (tuijian[i].groupBuyPrice).toFixed(2);
      tuijian[i].singleBuyPrice = (tuijian[i].singleBuyPrice).toFixed(2)
    }
    console.log(tuaninfo);
    this.setData({
      tuaninfo: tuaninfo,
      tuijian: tuijian,
      hours: 0,
      minutes: 0,
      seconds: 0,
      shengPrice: shengPrice.toFixed(2)
    },()=>{ //7.31
      that.setData({
        load: false
      })
      this.down();
    })
    //补零函数
    function addZero(num) {
      return num < 10 ? '0' + num : num;
    }
    if (that.data.hours == null || that.data.minutes == null || that.data.seconds == null){
      that.setData({
        hours: '0',
        minutes: '0',
        seconds: '0'
      })
    }
    //倒计时
    nTime = nTime.replace(/-/g, '/');
    time3 = time3.replace(/-/g, '/');

    var nTime = Date.parse(new Date(nTime)),
      sTime = Date.parse(new Date(time3)),
      ctime = sTime - nTime;
      // ctime=1000

    if (ctime <= 0) { //时间到
      clearInterval(interval);
      that.data.fail = !that.data.fail;
      that.data.Tuan = !that.data.Tuan;
      that.setData({
        fail: true,
        Tuan: that.data.Tuan,
        hours: '0',
        minutes: '0',
        seconds: '0'
      })
      
      return false;
    }
    if (status == 1 || status==0) { //拼团中
      //等待成团
      that.setData({
        pinTuanzhong: true
      })
    } else if (status == 2) {
      //拼团成功
      that.setData({
        success: true,
        // fail: 
        Tuan: true
      })

    } else if (status == 3) {
      //拼团失败
      that.setData({
        pinTuanzhong: true,
        Tuan: true,
        fail: true
      })
      return;
    }
    function downTime() {
      if(ctime<=0){
        that.setData({
          fail:true,
          hours:'0',
          minutes: '0',
          seconds: '0'
        })
        // console.log(that.data.fail)
        // console.log("时间到")
        return false;
      }
      var hours1 = Math.floor(ctime / 1000 / 60 / 60),
        minutes1 = Math.floor(ctime / 1000 / 60 % 60),
        seconds1 = Math.floor(ctime / 1000 % 60);

      that.setData({
        hours: addZero(hours1),
        minutes: addZero(minutes1),
        seconds: addZero(seconds1)
      });
      ctime -= 1000;

    };
    downTime();
    var interval = setInterval(downTime, 1000);

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

    // this.down();
    this.setData({
      skuNum: 1
    })
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
    console.log("到底了")
    var that = this;
    // this.data.loading = !this.data.loading;
    // this.setData({
    //   loading: true
    // });
    // if(that.data.id){
    //   http(URL.pinStatusUrl, { groupId: that.data.id }).then((data) => {
    //     console.log(data.data)
    //     const update = data.data.activites; //上拉后获得的数组
    //     if (update.length <= that.data.tuijian.length) {
    //       console.log("小于")
    //       that.data.loading = false;
    //       that.setData({
    //         loading: that.data.loading
    //       })
    //     }else{
    //       console.log("大于大于大于大于大于大于")
    //       for (var i in that.data.tuijian){
    //         //删除重复的
    //         update.shift()
    //       }
    //       that.data.tuijian=update.concat(that.data.tuijian);
    //         that.data.loading = false;
    //         that.setData({
    //           tuijian:that.data.tuijian,
    //           loading: that.data.loading
    //         })
           
    //     }
    //   })
    // }else if(that.data.orderSn){
    //   http(URL.pinStatusUrl, { orderSn: that.data.orderSn }).then((data) => {
    //     console.log(data.data)
    //     const update = data.data.activites; //上拉后获得的数组
    //     if (update.length <= that.data.tuijian.length) {
    //       console.log("小于")
    //       that.data.loading = false;
    //       that.setData({
    //         loading: that.data.loading
    //       })
    //     } else {
    //       console.log("大于大于大于大于大于大于")
    //       for (var i in that.data.tuijian) {
    //         //删除重复的
    //         update.shift()
    //       }
    //       that.data.tuijian = update.concat(that.data.tuijian);
    //       that.data.loading = false;
    //       that.setData({
    //         tuijian: that.data.tuijian,
    //         loading: that.data.loading
    //       })

    //     }
    //   })
    // }
    
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;
    let promotionCode = 0;
    try {
      var value = wx.getStorageSync('sgUserInfo');
      if (value) {
        console.log("valuevaluevaluevaluevaluevaluevaluevaluevalue")
        console.log(value);
        promotionCode = JSON.parse(value).mid;
      }
    } catch (e) {
      // Do something when catch error

    }
    http(URL.shareUrl + "?groupId=" + that.data.pin.groupId, { groupId: that.data.pin.groupId });
    
    return {
      title: '快来￥' + that.data.groupBuyPrice + "拼" + that.data.pin.productName,
      path: '/pages/Success/Success?id=' + that.data.pin.groupId + "&promotionCode=" + app.globalData.mid,
      success: function(res){
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '已邀请好友参团',
            icon: 'none',
            duration: 500
          })
        } 
      },
      fail:function(res){
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          　// 用户取消转发
          wx.showToast({
            title: '已取消',
            icon: 'none',
            duration: 500
          })
        　} else if (res.errMsg == 'shareAppMessage:fail') {
          　// 转发失败，其中 detail message 为详细失败信息
          wx.showToast({
            title: '转发失败',
            icon: 'none',
            duration: 500
          })
        　}
      }
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
  //去拼 团
  onDetail2:function(e){
    var item = e.currentTarget.dataset.item;
    console.log(item);
    let videoUrl = item.videoUrl;
    let activityId = item.id;
      wx.navigateTo({
        url: '/pages/Details/index/index?activityId=' + activityId,
      })
    
  },
// SKU
  initData: function (productId) {
    var that = this;

    http(URL.detail_indexUrl, {
      productId: productId
    }).then((res) => {
      if (res.success) {
        let data = res.data;

        let medias = data.medias
        let productImg = ""
        for (let i = 0; i < medias.length; i++) {
          if (medias[i].type == 0) {
            productImg = medias[i].imageUrl;
            break
          }
        }
        
        that.setData({
          activityName: data.activityName, //活动名称
          medias: data.medias, //轮播图数组
          num2: data.num, //成团数
          boughtNum: data.boughtNum, //已拼数量
          // groupBuyPrice: data.groupBuyPrice.toFixed(2), //拼团价
          // singleBuyPrice: data.singleBuyPrice.toFixed(2), //单买价格

          groups: data.groups, //正在进行中的团
          id: data.id, //活动Id
          // groupId: data.id,---------------------------------------
          productId: data.productId, //商品Id
          productName: data.productName, //商品名称
          spu: data.spu, //商品spu
          productImg
        }, () => {
          that.getCheckStock();
          // console.log('groups.length=========' + this.data.groups.length)
        })

      } else {
        console.log(`商品信息数据后端返回错误:${res.message}`);
      }
    }).catch((err) => {
      console.log(`商品信息数据-请求.catch:${JSON.stringify(err)}`);
    })
  },

  getCheckStock: function () {
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
        that.setData({ commission, hasStock, isB2C, stockType, storeId, stockNum });

        //如果storeId = 0 的时候提示商品已经下架          
        console.log("店铺ID店铺ID店铺ID店铺ID店铺ID店铺ID")
        console.log(that.data.storeId)
        if (storeId == 0) {
          that.setData({
            goodsDown: "goods_down_show",
            GPopacity: 'goods_price_opacity'
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
  // LoadSkuData: function () { 
  //   /** 何兴 SKU **/
  //   var that = this;
  //   console.log("何兴 SKU")
  //   console.log(this.data.productId)
  //   console.log(this.data.spu)
  //   console.log(this.data.storeId)

  //   http(URL.skuUrl, {
  //     productId: that.data.productId,
  //     sku: that.data.spu,
  //     storeId: this.data.storeId,
  //     // productId: 1000247,
  //     // sku: 'JiaJu001',
  //     // storeId: 1821106672,
  //     flag: 1,
  //   }).then((res) => {
  //     // console.log("*******999999999******")
  //     //console.log(res)
  //     let data = res.data;
  //     // console.log(data)
  //     let sgAttribute = data.sgAttribute; //
  //     let sgStoreAttribute = data.sgStoreAttribute;
  //     //绑定SKU数据
  //     this.BindSKUToUI(sgAttribute);
  //     //设置默认的SUK
  //     this.SetSukData(sgStoreAttribute);
      
  //     console.log("*******何兴******")
  //     console.log(sgAttribute)
  //     console.log(sgStoreAttribute)
  //     console.log("重构完成的json")
  //     this.setData({
  //       sukData: sgStoreAttribute
  //     })
  //   }).catch((err) => {
  //     console.log(`商品sku接口-请求.catch:${JSON.stringify(err)}`);
  //   })

  //   /** 何兴 SKU **/
  // },
  LoadSkuData: function (flag=1) {
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
  // BindSKUToUI: function (sgAttribute) {
  //   //重构Json数据
  //   //console.log(sgAttribute)
  //   let skulist = [] //sku 属性列表
  //   for (let name in sgAttribute) {
  //     let skuAttr = []
  //     for (let i = 0; i < sgAttribute[name].length; i++) {
  //       skuAttr = sgAttribute[name];
  //     }
  //     let sku = { "skuCode": name, "skuKey": sgAttribute[name][0].attrName, 'skuAttr': skuAttr }
  //     skulist.push(sku)
  //   }
  //   this.setData({
  //     skulist: skulist
  //   })
  // },
  BindSKUToUI: function (sgAttribute) {
    //重构Json数据
    console.log("重构Json数据")
    console.log(sgAttribute)
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
    if (skulist.length == 0) {
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
    let skuPrice = "";//价格
    let skustock = "0"
    let skuimg = ""
    let skuIds = "";//选择的描述
    let skuValue = ""
    let skuCode = ""
 
    //获取 数据池里面的 有库存的SKU
    for (let i = 0; i < sgStoreAttribute.length; i++) {
      if (sgStoreAttribute[i].num > 0) {
        skuIds = sgStoreAttribute[i].attrIds
        skuValue = sgStoreAttribute[i].attrValueIds
        skuimg = sgStoreAttribute[i].pic
        skuPrice = sgStoreAttribute[i].price
        skuCode = sgStoreAttribute[i].skku
        // sgStoreAttribute[i].num
        skustock = sgStoreAttribute[i].num  
        // skustock = sgStoreAttribute[i].num > 0 ? sgStoreAttribute[i].num : "无货"
        break;
      }
    }
    //如果全部没有货，就拿第一个SKU
    if (skuIds == "") {
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
    // 获取数组的内容
    let skulist = this.data.skulist;
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
            skuAttr[b].sgAttribute.ishot = "sku_red"
            skuwrap.push({ "codeid": skuIdsArr[i], "id": skuAttr[b].sgAttribute.id, "name": skuAttr[b].sgAttribute.attrValueName });
            console.log(skuwrap)
          }
          // console.log(skuIdsArr[i] + "--" + skuValueArr[i] + "--" + skuAttr[b].sgAttribute.id)
          //设置无货不可选择的情况
          // if(){
          //   gray
          // }
        }
      }
    } 
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
    // 获取数组的内容
    let skulist = this.data.skulist;
    let skuwrap = this.data.skuwrap;//当前选择的SKU属性

    //开始循环获取设置
    for (let i = 0; i < skulist.length; i++) {
      if (skulist[i].skuCode == code) {
        // console.log(skulist[i].skuKey)
        let skuAttr = skulist[i].skuAttr
        //第二层换行获取sku的value 的名字
        for (let b = 0; b < skuAttr.length; b++) {
          if (sku == skuAttr[b].sgAttribute.id) {
            skuAttr[b].sgAttribute.ishot = "sku_red"//设置选中
            //第三层 修改 SKU显示的数据
            for (let s = 0; s < skuwrap.length; s++) {
              // console.log("修改name和ID" + skuAttr[b].sgAttribute.id  + "-" + skuwrap[s].id)
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

    //判断选择完成后的库存和是否有货

    //1. 拼接 attrValueIds
    let skuwrapids = ""
    for (let i = 0; i < skuwrap.length; i++) {
      skuwrapids = skuwrapids + "," + skuwrap[i].id
    }


    skuwrapids = skuwrapids.substring(1, skuwrapids.length)
    console.log(skuwrapids)
    console.log("-skuwrapids")
    //2. 循环判断
    let sukData = this.data.sukData;// 数据
    let skuPrice = "";//价格
    let skustock = "0"
    let skuimg = "";//图片
    let skku = "";//SKKU

    for (let i = 0; i < sukData.length; i++) {
      //  console.log(sukData[i].attrValueIds +"=="+ skuwrapids)
      if (sukData[i].attrValueIds == skuwrapids) {
        // console.log(sukData[i])
        // console.log("9as8d9as8d9")
        skuPrice = sukData[i].price
        skustock = sukData[i].num > 0 ? sukData[i].num : "无货"
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
      skuNum: 1
    })

    //按钮的颜色
    if (skustock == "无货") {
      this.setData({
        gobuy_gray: "gobuy_gray"
      })
    } else {
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
  skuShow: function (e) {  //获取商品信息  0 直接购买   1 发起拼团 

    //如果商品已经下架，不再只执行下面的操作    
    let tabid = e.currentTarget.dataset.id;
    var that = this;
    if (this.data.goodsDown == "goods_down_show") {
      return false
    }
    //判断显示的窗体  min_wrap skuHidden
    // this.videoSignOut();  //关闭视频
    // let formId = e.detail.formId;
    // // console.log(formId);
    // http(URL.formIdUrl, { formId });
    // this.LoadSkuData(1)
    var token = app.globalData.token;

    if (token == "" || token == null) {
      console.log("没有token没有token没有token没有token没有token")
      wx.navigateTo({
        url: '/pages/common/commonLogin/commonLogin',
      })
      return false
    }
//
    if (token.indexOf('#') > -1) {
        // 上传 formId;
        let formId = e.detail.formId;
        // console.log(formId);
        http(URL.formIdUrl, { formId });
      this.LoadSkuData(1)//加载SKU数据
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
      if (value > this.data.num) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        })
        value = this.data.num
      }
      // console.log(value)
      this.setData({
        skuNum: value
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
      if (value > this.data.num) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 2000
        })
        value = this.data.num
      }
      this.setData({
        skuNum: value
      })
    } else {
      this.setData({
        skuNum: 1
      })
    }

  },



  skuNumAdd: function () {
    let skuNum = this.data.skuNum;
    skuNum += 1
    if (this.data.skustock == "无货") {
      wx.showToast({
        title: '该商品暂时无货',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (skuNum > this.data.skustock) {
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
    if (skuNum > this.data.num) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
      skuNum = this.data.num
    }
    if (skuNum > 100) value = 100
    this.setData({
      skuNum: skuNum
    })
  },
  goBuy: function () {
    if (this.data.skustock == "无货") {
      wx.showToast({
        title: '该商品暂时无货',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    let skuName = [];
    let skuwrap = this.data.skuwrap
    if (skuwrap) {
      for (let i = 0; i < skuwrap.length; i++) {
        skuName.push(skuwrap[i].name)
      }
    }


    if (this.data.skustock == "无货") {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
    }

    let cs = '/pages/Order/PutOrder/PutOrder?flag=1'
      + '&name='
      + skuName + '&num='
      + this.data.count + '&proId='
      + this.data.productId + '&type='
      + this.data.a + '&sku='
      + this.data.skuCode + '&id='
      + this.data.pin.groupId
    console.log(cs)

    var obj = {
      flag: 1,
      name: skuName,
      num: this.data.skuNum * 1,
      productId: this.data.productId * 1,
      sku: this.data.skuCode,
      shareId: 28056363,
      streetId: null,
      'type': this.data.a,
      id: this.data.id * 1,
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
      url: '/pages/Order/PutOrder/PutOrder?flag=1'
       + '&name='
      + skuName + '&num='
      + this.data.skuNum + '&proId='
      + this.data.productId + '&type='
      + this.data.a + '&sku='
      + this.data.skuCode + '&id='
      + this.data.pin.groupId,
    })
  },
  //商品规格 Attribute 接口(商品sku接口)
  getAttribute: function () {
    var that = this;
    // 2 716 937 12024841
    http(URL.skuUrl, {
      productId: that.data.productId,
      sku: this.data.SKU,
      storeId: this.data.storeId,
      flag: 1,
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
  onPin:function(){
    wx.navigateTo({
      url: '/pages/Details/index/index?productId=' + this.data.productId,
    })
  },
  down: function () {
    var that = this;
    var other = that.data.pin.groups;
    // console.log(other)
    var nTime = new Date().getTime();
    var endList = that.data.endTimeList;
    var ctime, timerArr = [];

    that.setData({
      result: that.data.result,
      // startList: that.data.startList
    })
    //补零函数
    function addZero(num) {
      return num < 10 ? '0' + num : num;
    }
    endList.forEach((item) => {
      var sTime = Date.parse(new Date(item.replace(/-/g, '/'))),
          ctime = sTime - nTime;
      // console.log(item)
      // console.log(ctime)
      var obj = null;
      // 如果活动未结束，对时间进行处理
      if (ctime > 0) {
        // 获取天、时、分、秒
        var hours1 = Math.floor(ctime / 1000 / 60 / 60),
          minutes1 = Math.floor(ctime / 1000 / 60 % 60),
          seconds1 = Math.floor(ctime / 1000 % 60);

        obj = {
          hours: addZero(hours1),
          minutes: addZero(minutes1),
          seconds: addZero(seconds1)
        }
      } 
      else {//活动已结束，全部设置为0
        obj = {
          hours: '00',
          minutes: '00',
          seconds: '00'
        }
        clearTimeout(that.data.timer);
      }
      timerArr.push(obj)
    })
   
    var timer = setTimeout(that.down, 1000);
    var id = that.data.result.id;
    that.setData({
      result: {
        endList: timerArr,
        id:id
      },
      timer
    })
    // console.log(that.data.result)
  },
  close_suk:function(){
    //关闭遮罩
    this.setData({ skuHidden: "sku_hidden", min_wrap: "sku_hidden" })
  }
})