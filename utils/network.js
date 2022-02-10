//封装网络请求
var requestHandler = {
  url: '',
  params: {

  },
  success: function (res) {
    // success
  },
  fail: function (res) {
    // fail
  },
  complete: function () {
    //complete
  }
}

//GET请求
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  request('POST', requestHandler)
}



function request(method, requestHandler) {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  var app = getApp();
  var session = '';
  if (app.globalData.xhlSession == '') {
    // wx.getStorage({
    //   key: 'session',
    //   success: function (res) {
    //     session=res.data,
    //     console.log("我在这里拿session=" + res.data);
    //   },
    // })
    session = wx.getStorageSync("session");
    console.log("我在缓存中拿的session=" + session);
  } else {
    session = app.globalData.xhlSession;
    console.log("我在app.js中拿的session=" + session);
  }
  params.session = session;


  var user_id = '';
  if (app.globalData.userId == '' || app.globalData.userId == null) {
    var basic_user_info = wx.getStorageSync("basic_user_info");
    user_id = basic_user_info.user_id;
    console.log("我在缓存中拿的user_info=" + basic_user_info);
  } else {
    user_id = app.globalData.userId;
  }
  params.user_id = user_id;

  console.log("url=" + requestHandler.url);
  console.log("params=" + JSON.stringify(params));

  wx.request({
    url: requestHandler.url,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }, // 设置请求的 header
    success: function (res) {
      //注意：可以对参数解密等处理
      if (res.data.retCode == 0) {
        requestHandler.success(res)
      } else {
        console.log('network_failed:' + JSON.stringify(res))
        requestHandler.fail(res)
      }
    },
    fail: function (res) {
      console.log(res)
      requestHandler.fail()
    },
    complete: function () {
      // complete
      requestHandler.complete();
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}
