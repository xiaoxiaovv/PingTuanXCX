Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWuliu()
  },
  getWuliu:function(){
    var that = this;
    //物流信息
    //非测试环境！！！
    wx.request({
      url: 'http://m.ehaier.com/v3/h5/sg/order/orderTrack.html?orderSn=D18062217293598343',
      data: { orderSn: 'D18062217293598343' },
      header: {
        'content-type': 'application/json',
        'TokenAuthorization': 'Bearer89b2c4ad-22ec-401d-9d8f-be9ed5b10361371#I3bYMyRcwQ1DyQRtiegtABayXakB9Wf4Knpxf9iOvQ1X0fzjRELq3a7aEEzkzQ22'
      },
      method: 'GET',
      // dataType: 'json',
      // responseType: 'text',
      success: function (res) {
        console.log(res.data.data);
        const wuliuInfo = res.data.data;
        that.setData({
          wuliuInfo
        })
      },
      fail: function (res) { },
      complete: function (res) { },
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