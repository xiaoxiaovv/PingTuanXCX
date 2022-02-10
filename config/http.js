let obj = function (
  url,
  params = {},
  method = "GET",
  header = {
    'content-type': 'application/json',
    'TokenAuthorization': 'Bearer761e4836-37ad-4ae9-a7a5-bb5d8bbfdb00203#wbAL7Y/8Pys/RUZhz5ItIQvVTG7yGkahnXtPeREXfI2E7qmUMjXCA/dH4wF9Nq1G'
    
    // 'TokenAuthorization': 'Bearer89b2c4ad-22ec-401d-9d8f-be9ed5b10361371#I3bYMyRcwQ1DyQRtiegtABayXakB9Wf4Knpxf9iOvQ1X0fzjRELq3a7aEEzkzQ22'
  }
) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        let token = res.data;
        let muHeader = Object.assign(header, { 'TokenAuthorization': token});
        // let muHeader = Object.assign(header, {});
        console.log(`params: ${JSON.stringify(params)}`);
        console.log(url);
        console.log(`header: ${JSON.stringify(muHeader)}`);
        wx.request({
          url: url,
          data: params,
          method: method,
          header: muHeader,
          success: function (res) {
            if (res.statusCode == 200) {
              console.log(res);
              resolve(res.data);
            } else {
              console.log(res.statusCode);
              wx.showToast({
                title: '顺逛君心情不好,离家出走了~',
                icon: 'none', // none 不展示icon
                duration: 2000
              })
              reject(res);
            }
          },
          fail: function (err) {
            console.log(err)
            reject(err);
          },
        });
      },
      fail: (err) => {
        console.log(`params: ${JSON.stringify(params)}`);
        console.log(url);
        console.log(`header: ${JSON.stringify(header)}`);
        wx.request({
          url: url,
          data: params,
          method: method,
          header: header,
          success: function (res) {
            if (res.statusCode == 200) {
              // console.log(res);
              resolve(res.data);
            } else {
              console.log(res.statusCode);
              wx.showToast({
                title: '顺逛君心情不好,离家出走了~',
                icon: 'none', // none 不展示icon
                duration: 2000
              })
              reject(res);
            }
          },
          fail: function (err) {
            console.log(err)
            reject(err);
          },
        });
      }
    });

  });
}

module.exports = obj;