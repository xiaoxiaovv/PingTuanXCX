//app.js
let URL = require('./config/url.js');
let Http = require('./config/http.js');

App({
  onLaunch: function (options, cb) {
    
    console.log(options);
    if (options.query && options.query.promotionCode){
      wx.getStorage({ key: 'promotionCode', success: (res) => { 
        if (!res.data){
          wx.setStorage({
            key: "promotionCode",
            data: options.query.promotionCode,
            success: sss => { console.log('success-promotionCode-setStorage-ok'); }
          });
        }
      },
        fail: (err)=>{
          wx.setStorage({
            key: "promotionCode",
            data: options.query.promotionCode,
            success: sss => { console.log('fail-promotionCode-setStorage-ok'); }
          });
        }
       });
      }

        let that = this;
        that.initApp(that,cb);
        // 全局判断 isIphoneX
        // wx.getSystemInfo({success: (res)=> {if (res.model == 'iphonrx') {that.globalData.isIphoneX = true;}}});
    wx.getSystemInfo({
      success: (res) => {
        const modelStr = res.model;
        if (modelStr.indexOf('iPhone X') > -1) { that.globalData.isIphoneX = true; }
      }
    });
    },

    initApp: (thiss, cb)=>{
        let that = this;
        if (thiss) { that = thiss; }
        // 1. 先获取本地是否保留 token
        let openId;
        wx.getStorage({ key: 'openId', success: (res) => { that.globalData.openId = res.data; openId = res.data; } });
        wx.getStorage({
            key: 'token',
            success: function (res) {
                let token = res.data;
                that.globalData.token = token;
                if (token.indexOf('#') > -1) {
                    console.log('------登录用户------');
                  wx.getStorage({ key: 'sgUserInfo', success: (res) => { 
                    let sgUserInfo = JSON.parse(res.data);
                    that.globalData.sgUserInfo = sgUserInfo;
                    that.globalData.mid = sgUserInfo.mid;
                    }});
                } else {
                    console.log('------临时用户------');
                    that.getLogin(that, cb);
                }
            },
            fail: function (err) {
                that.getLogin(that);
                console.error(err)
            }
        });
    },

    getLogin: (thiss, cb)=>{
        let that = this;
        if (thiss) { that = thiss; }
        // 登录
        wx.login({
            success: res => {
                console.log(res);
                console.log('登录');
                let code = res.code;
                wx.request({
                    url: URL.getToken,
                    data: { code: code },
                    method: "GET",
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                        if (res.statusCode == 200) {
                            let data = res.data;
                            if (data.success) {
                                let datas = data.data;
                                let openId = datas.openid;
                                let token = `Bearer${datas.token}`;
                                that.globalData.openId = openId;
                                that.globalData.token = token;
                                wx.setStorage({ key: "token", data: token, success: sss => { console.log('token-setStorage-ok'); } });
                                wx.setStorage({ key: "openId", data: openId, success: sss => { console.log('openId-setStorage-ok'); } });
                              console.log('login-getToken 成功--继续获取授权用户信息');
                                that.getAuthUser(that, cb);
                                // 用户 unionid
                                // 上传 code 到服务器
                                // 获取用户信息
                                
                            }
                        }else{
                          wx.showToast({
                            title: '获取token失败',
                            icon: 'none', // none 不展示icon
                            duration: 2000
                          })
                        }
                    }
                });

            },
            fail: (err) => {
              wx.showToast({
                title: '登录接口获取失败',
                icon: 'none', // none 不展示icon
                duration: 2000
              })
            }
        })
    },
    getAuthUser: (thiss, cb)=>{
        let that = this;
        if (thiss) {that = thiss;}
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            console.log('-----授权----返回--');
                            console.log(res);
                            that.setUserInfo(res, cb, that);
                        },
                        fail:()=>{
                          wx.showModal({
                            title: '用户未授权',
                            content: '如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，勾选用户信息并点击确定。',
                            showCancel: false,
                            success: function (res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                              }
                            }
                          })
                        },
                    });
                } else {
                    // 没有授权 --> 弹出授权
                    console.log('没有授权 --> 弹出授权');
                    // 设置全局 授权弹窗 -> 去授权
                    that.globalData.showAuth = true;
                }
            }
        });
    },
    setUserInfo: (detail, cbc, thiss) => {
        let that = this;
        if (thiss) { that = thiss; }
        let errMsg = detail.errMsg;
        if (errMsg == "getUserInfo:ok") {
            console.log('授权成功');
            console.log(detail);

            that.globalData.userInfo = detail.rawData;
            let encryptedData = detail.encryptedData;
            let iv = detail.iv;
            let openId = that.globalData.openId;
            let avatarUrl = detail.userInfo.avatarUrl;
            // 通过
          wx.getStorage({
            key: 'promotionCode', success: (res) => {

              console.log('---success-promotionCode----');
              let promotionCode = '';
              if (res.data) {promotionCode = res.data;}
            
              Http(URL.getLogin,
                {
                  encryptedData: encryptedData,
                  iv: iv,
                  openid: openId,
                  avatarUrl: avatarUrl,
                  promotionCode: promotionCode
                }, "POST").then((data) => {
                  console.log(data)
                  if (data.success) {
                    let resData = data.data;
                    let token = `Bearer${resData.sessionValue}`;
                    let mid = resData.mid;
                    that.globalData.sgUserInfo = resData;
                    that.globalData.mid = mid;
                    that.globalData.token = token;
                    // 返回 新 token
                    console.log('返回 新 token');

                    wx.setStorage({
                      key: "token",
                      data: token,
                      success: sss => { console.log('token-setStorage-ok'); }
                    });
                    wx.setStorage({
                      key: "sgUserInfo",
                      data: JSON.stringify(resData),
                      success: sss => { console.log('sgUserInfo-setStorage-ok'); }
                    });
                    cbc('success');
                  } else {
                    wx.showToast({
                      title: data.message,
                      icon: 'none', // none 不展示icon
                      duration: 2000
                    })
                  }
                });

            },
            fail: (err) => {

              let promotionCode = '';
              Http(URL.getLogin,
                {
                  encryptedData: encryptedData,
                  iv: iv,
                  openid: openId,
                  avatarUrl: avatarUrl,
                  promotionCode: promotionCode
                }, "POST").then((data) => {
                  console.log(data)
                  if (data.success) {
                    let resData = data.data;
                    let token = `Bearer${resData.sessionValue}`;
                    let mid = resData.mid;
                    that.globalData.sgUserInfo = resData;
                    that.globalData.mid = mid;
                    that.globalData.token = token;
                    // 返回 新 token
                    console.log('返回 新 token');

                    wx.setStorage({
                      key: "token",
                      data: token,
                      success: sss => { console.log('token-setStorage-ok'); }
                    });
                    wx.setStorage({
                      key: "sgUserInfo",
                      data: JSON.stringify(resData),
                      success: sss => { console.log('sgUserInfo-setStorage-ok'); }
                    });
                    cbc('success');
                  } else {
                    wx.showToast({
                      title: data.message,
                      icon: 'none', // none 不展示icon
                      duration: 2000
                    })
                  }
                });

            }
          });

        } else {
          wx.showToast({
            title: '获取授权失败',
            icon: 'none', // none 不展示icon
            duration: 2000
          })
            console.log('授权失败');
        }
    },
    globalData: {
        userInfo: null,
        sgUserInfo: null,
        mid: '',
        token: null,
        AuthUserInfo: false,
        isIphoneX: false,
        showAuth: false,
        openId: '',
     
    }
})