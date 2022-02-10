
//最终供外面调用的方法
function login() {
  // console.log('logining..........');
  // //调用登录接口
  // wx.login({
  //   success: function (e) {
  //     console.log('wxlogin successd........');

  //     var code = e.code;
  //     wx.getUserInfo({
  //       success: function (res) {
  //         console.log('wxgetUserInfo successd........');
  //         console.log('昵称：' + res.userInfo.nickName)
  //         var encryptedData = encodeURIComponent(res.encryptedData);
  //         thirdLogin(code, encryptedData, res.iv);//调用服务器api
  //       }
  //     })
  //   }
  // });

 

  // var encryptedData = Object;
  // wx.getSetting({
  //   success: function (res) {
  //     if (res.authSetting[!'scope.userInfo']) {
  //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称 
  //       wx.getUserInfo({
  //         success: function (res) {
  //           console.log(res.encryptedData)
  //           encryptedData.nickName = res.encryptedData.nickName;
  //           encryptedData.avatarUrl = res.encryptedData.avatarUrl;
  //           encryptedData.unionId = res.encryptedData.unionId;
  //           encryptedData.city = res.encryptedData.city;
  //           encryptedData.gender = res.encryptedData.gender;
  //           encryptedData.openId = res.encryptedData.openId;
  //           encryptedData.province = res.encryptedData.province;
  //           encryptedData.country = res.encryptedData.country;
  //           console.log('encryptedData.nickName=' + encryptedData.nickName)
  //           wx.setStorage({
  //             key: 'encryptedData',
  //             data: encryptedData,
  //           })
  //         }
  //       })
  //     }
  //   }
  // })

  wx.login({
    success: function(res) {
      
      
      // ------ 获取凭证 ------
      var code = res.code;
      var myEncryptedData = wx.getStorage({
        key: 'encryptedData',
        success: function (res) { },
      })
      if (code) {
        //console.log('获取用户登录凭证：' + code);
        // ------ 发送凭证 ------
       
        // getToken();
        myLogin();
        wx.request({
          url: '/wechat/groupbuy/member/login.json',
          method: 'GET',
          header: 'application/json',

          data: {
            // code: code,
            avatarUrl: myEncryptedData.avatarUrl,
            nickName: myEncryptedData.nickName,
            openid: myEncryptedData.openId,
            unionId: myEncryptedData.unionId,
            promotionCode: '',
          },
        })
      }
    }
  })
}

//获取openId
function getOpenId(){  
  wx.login({
    //获取code
    success: function (res) {
      code = res.code //返回code
    }
  })
  wx.request({
    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=' + code + '&grant_type=authorization_code',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      wx.setStorage({
        key: 'openId',
        data: res.data.openid,  //返回openid
      })
    }
  })
}

function getToken() {
  wx.request({
    url: '/wechat/groupbuy/member/getToken.json',
    method: 'GET',
    header: 'application/json',
    success: function (res) {
      if (res.errorCode == 1) {
        wx.setStorage({
          key: 'token',
          data: res.data,
        })
      }
    }
  })
}

function myLogin() {
  // 查看是否授权
  console.log('1--------------')
  var encryptedData = Object;
  wx.getSetting({
    success: function (res) {
      if (!res.authSetting['scope.userInfo']) {
        wx.authorize({
          scope: 'scope.record',
          success() {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称 
            console.log('2--------------')
            wx.getUserInfo({
              success: function (res) {
                console.log('3--------------')
                console.log(res.encryptedData)
                encryptedData.nickName = res.encryptedData.nickName;
                encryptedData.avatarUrl = res.encryptedData.avatarUrl;
                encryptedData.unionId = res.encryptedData.unionId;
                encryptedData.city = res.encryptedData.city;
                encryptedData.gender = res.encryptedData.gender;
                encryptedData.openId = res.encryptedData.openId;
                encryptedData.province = res.encryptedData.province;
                encryptedData.country = res.encryptedData.country;
                console.log('encryptedData.nickName=' + encryptedData.nickName)
                wx.setStorage({
                  key: 'encryptedData',
                  data: encryptedData,
                })
              }
            })
          }
        })

      }
    }
  })
}


// function thirdLogin(code, encryptedData, iv) {
//   var url = "/wechat/groupbuy/member/login.json";
//   var params = new Object();
//   params.code = code;
//   params.encryptedData = encryptedData;
//   params.iv = iv;

//   buildRequest(new Object(), url, params, {
//     onPre: function (page) { },
//     onSuccess: function (data) {
//       console.log('my  login successd........');
//       console.log(data);
//       getApp().globalData.session_id = data.session_id;
//       getApp().globalData.uid = data.uid;
//       getApp().globalData.isLogin = true;
//     },
//     onError: function (msgCanShow, code, hiddenMsg) {
//     }
//   }).send();
// }


module.exports.login = login
