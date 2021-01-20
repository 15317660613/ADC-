const app = getApp()

Page({
  data: {
    winHeight: 0,
    daily: {}
  },
  //监听传值，后面自己做处理了
  // cityTap(e) {;
  //   let _this = this;
  //   let daily = _this.data.daily;
  //   // 拼凑如此那
  //   let payload = {};
  //   payload.scheduleContent = "出差:" + e.detail.cityname;
  //   payload.userId = app.globalData.userInfo.usid;
  //   payload.scheduleDate = daily.date;
  //   payload.scheduleHour = daily.type;
  //   if ( daily.id !== "undefined" ){
  //     payload.id = daily.id;
  //   }
  //   // 获取上一个页面
  //   let pages = getCurrentPages();
  //   let prevPage = pages[ pages.length - 2 ];
  //   console.log(prevPage.data);
  //   wx.request({
  //     url: 'https://ics.evtbts.org/infoApp/api/smallProgram/ScheduleHourController/save',
  //     method: "POST",
  //     data: payload,
  //     success(res) {
  //       if ( res.data.respCode === "0"){
  //         let dailys = prevPage.data.dailys;
  //         dailys.splice(prevPage.data.current, 1, res.data.data.nowWeek_list);
  //         prevPage.setData({
  //           dailys
  //         })
  //         console.log(res);
  //         wx.navigateBack({
  //           delta: 1
  //         });
  //       }
  //     }
  //   })
  // },
  cityTap(e) {
    let _this = this;
    let daily = _this.data.daily;
    // 拼凑如此那
    let payload = {};
    payload.scheduleContent = "出差:" + e.detail.cityname;
    app.globalData.cityData = payload.scheduleContent;
    wx.navigateBack({
      delta: 1
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const win = wx.getSystemInfoSync();
    this.setData({
      winHeight: win.windowHeight,
      daily: options
    });
  }
})
