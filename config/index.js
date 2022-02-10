
// 全局配置文件

let HOST = 'https://m.ehaier.com';

let ENV = 'PROD'; // 设置环境 测试 DEV, 正式环境 PROD

if (ENV !== 'DEV'){
  // 正式环境 host
  HOST = 'https://m.ehaier.com';
}else{
  // 测试环境 host
  // HOST = 'http://rap.test.ehaier.com/mockjsdata/14';
  HOST = 'http://mobiletest.ehaier.com:38103';
}


module.exports = {
  HOST: HOST
}
