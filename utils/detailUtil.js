//数组页面跳转
function onNavtgate(e,objList,targetName,listId,url){
  var index = e.currentTarget.dataset.targetName;
  var navtgate = objList[index].listId; 
  wx.navigateTo({
    url: url,
  })
}

module.exports={
  onNavtgate: onNavtgate
}