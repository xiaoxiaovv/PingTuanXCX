let config = require('./index.js');
let HOST = config.HOST;

function FullUrl(route, host = HOST) {
  return `${host}/${route}`;
}

module.exports = {
  // 获取 token
  getToken: FullUrl("wechat/groupbuy/member/getToken.json"),
  // 获取 login
  getLogin: FullUrl("wechat/groupbuy/member/login.json"),
  // 测试链接
  testUrl: FullUrl("v3/platform/web/token/getToken.json"),
  homeUrl: FullUrl("wechat/groupbuy/home/index.json"), // 首页接口
  myOrderUrl: FullUrl('wechat/groupbuy/order/orderList.json') ,//订单列表接口
  videoUrl: FullUrl("wechat/groupbuy/home/video.json"), // 视频页接口

  // youkeUrl: FullUrl("wechat/groupbuy/group/groupDetail.json"), // 展示拼团状态接口
  detail_indexUrl: FullUrl("wechat/groupbuy/home/detail.json"),  //详情页接口
  detail_vedioUrl: FullUrl("wechat/groupbuy/home/video.json"),  //视频页接口
 
  indexUrl: FullUrl("wechat/groupbuy/home/detail.json"), // 详情页接口
  commentsUrl: FullUrl("wechat/groupbuy/product/getComments.json"),    //评价列表接口


  pingjiaUrl: FullUrl("wechat/groupbuy/product/getComments.json"), //评价接口
  addressUrl: FullUrl("wechat/groupbuy/member/addressManage.json"), //收货地址接口
  newAddUrl: FullUrl("wechat/groupbuy/member/addAddress.json"), //新增收货地址接口

  pinStatusUrl: FullUrl("wechat/groupbuy/home/groupDetail.json"), //展示拼团状态接口
  promosUrl: FullUrl("wechat/groupbuy/product/promos.json"), //图文介绍接口
  skuUrl: FullUrl("wechat/groupbuy/product/getAttribute.json"), //商品sku接口
  checkStockUrl: FullUrl("wechat/groupbuy/product/checkStock.json"), // 校验库存

  diquUrl: FullUrl("wechat/groupbuy/page/getAddressByPid.json"), //根据父节点id获取地区信息

  // 结算页订单
  getOrderInit: FullUrl("wechat/groupbuy/order/pageInfo.json"), //结算页接口
  commitOrder: FullUrl("wechat/groupbuy/order/submitOrder.json"), //提交订单
  getWeChatPayment: FullUrl("wechat/groupbuy/pay/wxpay.json"), //获取支付信息
  getOrderRefund: FullUrl("wechat/groupbuy/order/getOrderRepairsInfo.json"), //退款详情


  // 我的页面
  getUserMsg: FullUrl("wechat/groupbuy/member/memberCenter.json"), // 我的

  defaultAddUrl: FullUrl("wechat/groupbuy/member/updateDefaultAddress.json"), //修改默认地址接口

  changeAddUrl: FullUrl("wechat/groupbuy/order/changeAddress.json"), //切换收获地址结算页接口

  shareUrl: FullUrl("wechat/groupbuy/home/share.json"), //分享接口

  cancelOrder: FullUrl("wechat/groupbuy/order/cancelOrder.json"), //取消订单接口
  confirmOrderProduct: FullUrl("wechat/groupbuy/order/confirmOrderProduct.json"),    //确认收货
  delAddUrl: FullUrl("wechat/groupbuy/member/deleteAddress.json"),    //删除收货地址
  editAddUrl: FullUrl("wechat/groupbuy/member/updateAddress.json"),   //编辑收货地址
  orderDetailUrl: FullUrl("wechat/groupbuy/order/orderDetail.json"),  //订单详情接口

  tuiKuanUrl: FullUrl("wechat/groupbuy/order/orderRefund.json"),    //申请退款页面接口
  tuiSubUrl: FullUrl("wechat/groupbuy/order/orderRepair.json"),   //申请退款提交接口

  pingCountUrl: FullUrl("wechat/groupbuy/product/getCommentCount.json"),  //获取好评数量

  checkTuiUrl: FullUrl("wechat/groupbuy/order/checkOrderRefund.json"),  //校验退款接口
  orderTrackUrl: FullUrl("wechat/groupbuy/order/orderTrack.json"),  //订单物流追踪接口

  formIdUrl: FullUrl("wechat/groupbuy/member/collectFormId.json"),  // 提交 formId
  getOrderIsPayment: FullUrl("/wechat/groupbuy/home/canPay.json"), //校验订单
};