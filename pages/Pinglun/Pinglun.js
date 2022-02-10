// pages/Pinglun/Pinglun.js
var paramObj = {};
const app = getApp()
const config = require('../../config/index.js');
const URL = require('./../../config/url.js');
const http = require('./../../config/http.js');
const formatDate = require('./../../utils/util.js').formatDate;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,
    pageSize:10,
    pingjia: false,
    status: false,
    isScroll: false,
    active: 0,
    active2: 0,
    count: 1,
    num2: 1,
    skuNum:1,
    ping: [],
    isIphoneX: app.globalData.isIphoneX,
    footerClass: app.globalData.isIphoneX ? 'footerClass' : '',
    barClass: app.globalData.isIphoneX ? 'barClass' : '',
    SKU: '', //物流编码测试
    barList: [{
        imgUrl: '/imgs/homes.png',
        text: '首页',
        text2_color: '#999',
        bar_backgroundColor: 'white',
      },
      {
        imgUrl: '/imgs/kf@2x.png',
        text: '客服',
        text2_color: '#999',
        bar_backgroundColor: 'white',
      },
      {
        price: 2599.00,
        text: '单独购买',
        text2_color: '#000000',
        bar_backgroundColor: 'white',
        text1_color: '#000000',
      },
      {
        price: 2566.00,
        text: '发起拼团',
        text2_color: '#fff',
        bar_backgroundColor: '#FF6026',
        text1_color: '#fff',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var productId = options.productId; //接收商品id
    console.log("productIdproductIdproductIdproductId--" + options.productId)
    console.log(options)

    this.setData({
      productId: productId,
      activityId: options.activityId

    });
    this.initData(); //商品信息数据


    //获取评价数量
    this.getCount(this.data.productId);

    console.log(this.data.productId + "评价")
    this.loadList("all")
  },
  getCount(productId) {
    http(URL.pingCountUrl, {
      productId,
      productId,
      pageIndex:this.data.pageIndex,
      pageSize:this.data.pageSize,
    }).then((data) => {
      console.log(data);
      const totalNum = data.data.totalNum;  //总数
      const positiveNum = data.data.positiveNum;  //好评数
      const neutralNum = data.data.neutralNum;  //中评数
      const negativeNum = data.data.negativeNum;  //差评数
      const hasPicNum = data.data.hasPicNum;  //有图
      this.setData({
        hasPicNum,
        negativeNum,
        neutralNum,
        positiveNum,
        totalNum
      })
      if (totalNum == 0 ) {
        this.setData({
          status: true
        })
      } else {
        this.setData({
          status: false
        })
      }
    })
  }, //商品信息数据
  initData: function () {
    var that = this;
    if (that.data.activityId) {
      console.log("URL.detail_indexUrl console.log(URL.detail_indexUrl)")
      console.log(URL.detail_indexUrl)
      http(URL.detail_indexUrl, {
        productId: this.data.productId
      }).then((res) => {
        if (res.success) {
          let data = res.data;
          console.log("detail_indexUrldetail_indexUrldetail_indexUrldetail_indexUrldetail_indexUrl")
          console.log(data)
          let medias = data.medias
          let productImg = ""
          for (let i = 0; i < medias.length; i++) {
            if (medias[i].type == 0) {
              productImg = medias[i].imageUrl;
              break
            }
          }
          that.setData({
            result: {
              endList: data.groups,
              id: data.id
            },
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
            productImg
          }, () => {
            if (that.data.groups) {
              var arr = [];
              for (var i = 0; i < that.data.groups.length; i++) {
                arr.push(that.data.groups[i].eTime)
              }
              that.setData({
                endTimeList: arr
              })           
            } 
          
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

            console.log('groups.length=========' + this.data.groups.length)
          })

        } else {
          console.log(`商品信息数据后端返回错误:${res.message}`);
        }
      }).catch((err) => {
        console.log(`商品信息数据-请求.catch:${JSON.stringify(err)}`);
      })
    } //有activityId
    else {
      http(URL.detail_indexUrl, {
        productId: this.data.productId
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
            result: {
              endList: data.groups,
              id: data.id
            },
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
            productImg
          }, () => {
            if (that.data.groups) {
              var arr = [];
              for (var i = 0; i < that.data.groups.length; i++) {
                arr.push(that.data.groups[i].eTime)
              }
              that.setData({
                endTimeList: arr
              })             
            }           
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

            console.log('groups.length=========' + this.data.groups.length)
          })

        } else {
          console.log(`商品信息数据后端返回错误:${res.message}`);
        }
      }).catch((err) => {
        console.log(`商品信息数据-请求.catch:${JSON.stringify(err)}`);
      })
    }
  },
  loadList: function(commentType) {
    var that = this;
    console.log(URL.testUrl);
    http(URL.pingjiaUrl, {
      commentType: commentType,
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize,
      productId: that.data.productId,
      flag: "list"
    }).then((data) => {
      console.log(data.data);
      const ping = data.data;
      //判断评论数量
      if (commentType == "praise" && that.data.positiveNum == 0) {
        //好评为0
        that.data.status = true;
        that.data.ping.length = 0;
        that.setData({
          status: that.data.status,
          ping: that.data.ping
        })
      } else if (commentType == "neutral" && that.data.neutralNum == 0) {
        //中评为0
        that.data.status = true;
        that.data.ping.length = 0;
        that.setData({
          status: that.data.status,
          ping: that.data.ping
        })
      } else if (commentType == "poor" && that.data.negativeNum == 0){
        //差评为0
        that.data.status = true;
        that.data.ping.length = 0;
        that.setData({
          status: that.data.status,
          ping: that.data.ping
        })
      } else if (commentType == "image" && that.data.hasPicNum == 0){
        //有图为0
        that.data.status = true;
        that.data.ping.length = 0;
        that.setData({
          status: that.data.status,
          ping: that.data.ping
        })
      }
      else{

      
      if (Array.isArray(ping)) {
        for (let i = 0, leni = ping.length; i < leni; i += 1) {
          const expTime = ping[i].experienceTime;
          if (expTime) {
            ping[i].experienceTime = formatDate(ping[i].experienceTime, '/');
          }
        }
      }
      var time = new Date(data.data[0].createTime)
      console.log(time.toLocaleDateString())
      
      for (var i in ping) {
        var index = false;
        // var time = new Date(ping[i].createTime);
        // var time2 = time.toLocaleDateString();
        // ping[i].createTime = time2;
        ping[i].createTime = that.toDate(ping[i].createTime)
        ping[i].index = index;
      }
      that.setData({
        ping,
        status: false
      })
      }

    })
  },
  //时间戳转换时间
  toDate:function(number){
    var n= number;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return(Y + M + D)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
     
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      skuNum: 1
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
    //上拉加载
    console.log("到底了")
    var that = this;
    if(that.data.ping.length<that.data.pageSize){
      //到底了
      that.setData({
        loading: false
      })
    }else{
      that.setData({
        loading: true
      })
      that.data.pageSize = that.data.pageSize + 10;
      that.setData({
        pageSize: that.data.pageSize
      })
      that.loadList("all")
    }
    
    

  },

  //按钮
  onBtnclick: function(e) {
    var homeId = e.target.dataset.num;
    this.setData({
      num2: homeId
    });
    if (homeId == 1) {
      this.loadList("all");
    } else if (homeId == 2) {
      this.loadList("praise");
    } else if (homeId == 3) {
      this.loadList("neutral");
    } else if (homeId == 4) {
      this.loadList("poor");
    } else {
      this.loadList("image");
    }

  },

  //底部页面跳转
  myPage: function(e) {
    //跳转
    var n = e.currentTarget.dataset.id;
    if (n == 0) {
      wx.switchTab({
        url: './../Home/Home',
        success: function(res) {
          console.log("ok")
        },
        fail: function(res) {
          console.log("no")
        }
      })
    }

  },

  tan: function() {
    this.data.isScroll = !this.data.isScroll;
    this.setData({
      isScroll: this.data.isScroll
    })
  },
  onX: function() {
    this.tan()
  },
  myPage2: function() {
    this.tan()
  },
  onColor: function(e) {
    var val = e.currentTarget.dataset.value;
    var id = e.currentTarget.dataset.id;
    this.data.yixuan = val;
    this.data.active = id;
    this.setData({
      yixuan: this.data.yixuan,
      active: this.data.active
    });


  },
  onSize: function(e) {
    var size = e.currentTarget.dataset.size;
    var id = e.currentTarget.dataset.id;
    this.data.yixuan_size = size;
    this.data.active2 = id;
    this.setData({
      yixuan_size: this.data.yixuan_size,
      active2: this.data.active2
    })
  },
  onAdd: function() {
    var count = this.data.count;
    count++;
    this.setData({
      count: count
    })
  },
  onJian: function() {
    var count = this.data.count;
    if (count > 1) {
      count--;
    }
    this.setData({
      count: count
    })
  },
  enter: function() {
    //关闭页面
    this.tan()
    //跳支付页
  },
  //查看评价
  onPing: function(e) {
    console.log(e.currentTarget.dataset.id)
    var that = this;
    var item = e.currentTarget.dataset.item;
    var ind = e.currentTarget.dataset.id;
    that.data.ping[ind].index = !that.data.ping[ind].index;
    // item.index = true;
    // that.data.pingjia = !that.data.pingjia;

    that.setData({
      ping: that.data.ping,
    })
  },
  LoadSkuData: function(flag) {
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
  BindSKUToUI: function(sgAttribute) {
    //重构Json数据
    console.log("重构Json数据")
    console.log(sgAttribute)
    let skulist = [] //sku 属性列表
    for (let name in sgAttribute) {
      let skuAttr = []
      for (let i = 0; i < sgAttribute[name].length; i++) {
        skuAttr = sgAttribute[name];
      }
      let sku = {
        "skuCode": name,
        "skuKey": sgAttribute[name][0].attrName,
        'skuAttr': skuAttr
      }
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
  SetSukData: function(sgStoreAttribute) {
    let skuPrice = ""; //价格
    let skustock = "0"
    let skuimg = ""
    let skuIds = ""; //选择的描述
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
            skuwrap.push({
              "codeid": skuIdsArr[i],
              "id": skuAttr[b].sgAttribute.id,
              "name": skuAttr[b].sgAttribute.attrValueName
            })
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
  ChoiceSku: function(e) { //用户选择属性
    let sku = e.currentTarget.dataset.sku;
    let code = e.currentTarget.dataset.code;
    // 获取数组的内容
    let skulist = this.data.skulist;
    let skuwrap = this.data.skuwrap; //当前选择的SKU属性

    //开始循环获取设置
    for (let i = 0; i < skulist.length; i++) {
      if (skulist[i].skuCode == code) {
        // console.log(skulist[i].skuKey)
        let skuAttr = skulist[i].skuAttr
        //第二层换行获取sku的value 的名字
        for (let b = 0; b < skuAttr.length; b++) {
          if (sku == skuAttr[b].sgAttribute.id) {
            skuAttr[b].sgAttribute.ishot = "sku_red" //设置选中
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
    //2. 循环判断
    let sukData = this.data.sukData; // 数据
    let skuPrice = ""; //价格
    let skustock = "0"
    let skuimg = ""; //图片
    let skku = "";//SKKU

    for (let i = 0; i < sukData.length; i++) {
      //  console.log(sukData[i].attrValueIds +"=="+ skuwrapids)
      if (sukData[i].attrValueIds == skuwrapids) {
        // console.log(sukData[i])
        // console.log("9as8d9as8d9")
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
      skuNum: 1
    })

    //按钮的颜色
    if (skustock == "0") {
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
  sKuClose: function() {
    // console.log("关闭")
    this.setData({
      skuHidden: "sku_hidden"
    })
  },
  minClose: function() {
    // console.log("关闭")
    this.setData({
      min_wrap: "sku_hidden"
    })
  },
  skuShow: function(e, gb) { //获取商品信息  0 直接购买   1 发起拼团 
    var that = this;

    //如果商品已经下架，不再只执行下面的操作    
    let tabid = e.currentTarget.dataset.id;

    if (this.data.goodsDown == "goods_down_show") {
      return false
    }

    var token = app.globalData.token;

    if (token == "" || token == null) {
      wx.navigateTo({
        url: '/pages/common/commonLogin/commonLogin',
      })
      return false
    }

    if (token.indexOf('#') > -1) {
      //获取数据       
      let proType = 0;
      let proFlag = 0;
      if (tabid == 3) {
        proType = 6
        proFlag = 1
        var id = that.data.result.id;
        that.setData({
          groupId: id
        })
      }
      if (tabid == 2) {
        proType = 9
        proFlag = 0
      }
      if (gb == 1) {
        proType = 1
        proFlag = 1

      }
      this.setData({
        proType,
        proFlag
      })
      this.LoadSkuData(tabid == 2 ? 0 : 1) //加载SKU数据
      // 上传 formId;
      let formId = e.detail.formId;
      // console.log(formId);
      http(URL.formIdUrl, {
        formId
      });
      // this.setData({
      //   skuHidden: "sku_show"
      // })

    } else {

      wx.navigateTo({
        url: '/pages/common/commonLogin/commonLogin',
      })
    }

  },
  skuKey: function(e) {
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

  skuKeyMin: function(e) {
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
    } else {
      this.setData({
        skuNum: 1
      })
    }

  },



  skuNumAdd: function() {
    let skuNum = this.data.skuNum;
    skuNum += 1
    if (this.data.skustock == "0") {
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

  skuNumMinus: function() {
    let skuNum = this.data.skuNum;
    if (skuNum == 1) return
    skuNum -= 1
    this.setData({
      skuNum: skuNum
    })
  },
  skuNumMinusMin: function() {
    let skuNum = this.data.skuNum;
    if (skuNum == 1) return
    skuNum -= 1
    this.setData({
      skuNum: skuNum
    })
  },

  skuNumAddMin: function() {
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
  goBuy: function(e) {
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
    if (skuwrap) {
      for (let i = 0; i < skuwrap.length; i++) {
        skuName.push(skuwrap[i].name)
      }
    }

    // 上传 formId;
    let formId = e.detail.formId;
    // console.log(formId);
    http(URL.formIdUrl, {
      formId
    })

    let cs = '/pages/Order/PutOrder/PutOrder?flag=' +
      1 + '&name=' +
      skuName + '&num=' +
      this.data.count + '&proId=' +
      this.data.productId + '&type=' +
      this.data.proType + '&sku=' +
      this.data.skuCode + '&id=' +
      this.data.groupId
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
      url: '/pages/Order/PutOrder/PutOrder?flag=' +
        this.data.proFlag + '&name=' +
        skuName + '&num=' +
        this.data.skuNum + '&proId=' +
        this.data.productId + '&type=' +
        this.data.proType + '&sku=' +
        this.data.skuCode + '&id=' +
        this.data.groupId,
    })
  }, close_suk: function () {
    this.setData({ skuHidden: "sku_hidden", min_wrap: "sku_hidden" })
  }

})