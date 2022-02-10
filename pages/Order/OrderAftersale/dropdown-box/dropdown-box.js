// pages/Order/OrderAftersale/dropdown-box/dropdown-box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectStateData: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  
  methods: {
    //点击选择类型
    clickPerson: function () {
       this.setData({
         selectStateData: {
           selectType: this.data.selectStateData.selectType,
           typeName: this.data.selectStateData.typeName,
           selectArea: !this.data.selectStateData.selectArea,
           selectPerson: !this.data.selectStateData.selectPerson,
           firstPerson: this.data.selectStateData.firstPerson,
           list: this.data.selectStateData.list
         }
       })
    },
  //点击切换 
  mySelect: function (e) {
    this.setData({
      selectStateData: {
        selectType: this.data.selectStateData.selectType,
        typeName: this.data.selectStateData.typeName,
        firstPerson: e.target.dataset.me,
        selectPerson: true,
        selectArea: false,
        list: this.data.selectStateData.list
      }
    })
    const myEventDetail = {
      firstPerson: e.target.dataset.me,
      selectType: this.data.selectStateData.selectType,
    } // detail对象，提供给事件监听函数
    const myEventOption = {} // 触发事件的选项
    this.triggerEvent('myevent', myEventDetail , myEventOption)
  }
  }
})
