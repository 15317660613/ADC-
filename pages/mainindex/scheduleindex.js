let app = getApp()

Page({
  data: {
    currentTab: 0,
    _lastTime:0,
    //这里只做tab名和显示图标
    items: [
      {
        "text": "我的日程",
        "selectedIconPath": "/assects/icon-my-blue.png",
        "iconPath": "/assects/icon-my-gray.png"
      },
      {
        "text": "查看他人",
        "selectedIconPath": "/assects/icon-others-blue.png",
        "iconPath": "/assects/icon-others-gray.png"
      }
    ]
  },
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,  
      })
    
    }
  },
  onLoad: function (option) {
    console.log(app.globalData.saveData)
    if (app.globalData.saveData !== '') {
      let _this = this;
      // let dailys = _this.data.dailys;
      // dailys.splice(_this.data.current, 1, app.globalData.saveData);
      // dailys.forEach((item) => {
      //   if (item) {
      //     _this.setLine(item);
      //   }
      // });
      // _this.setData({
      //   dailys
      // })
      app.globalData.saveData = '';
    }
  },
  onShow: function () {
    this.selectComponent('#test').onShows();
    console.log("onshow")
    console.log(app.globalData)
    if (app.globalData.saveData !== '') {
      let _this = this;
      // let dailys = _this.data.dailys;
      // dailys.splice(_this.data.current, 1, app.globalData.saveData);
      // dailys.forEach((item) => {
      //   if (item) {
      //     _this.setLine(item);
      //   }
      // });
      // _this.setData({
      //   dailys
      // })
      // _this.today()
      app.globalData.saveData = '';
    }
  },
  


  
})
