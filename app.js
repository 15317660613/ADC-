//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //小程序自动更新
    const updateManager = wx.getUpdateManager();    // 获取更新管理器对象
    updateManager.onCheckForUpdate(function (res) {
      // console.log(res)    检测更新结果
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.hideLoading();
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好\r\n点击确定重新启动',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '检查到有新版本\r\n但是下载失败\r\n请检查网络设置',
            showCancel: false
          })
        })
      }
    })
    // this.getOpenId();


    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },


  globalData: {
    userInfo: null,
    saveData: '',
    cityData: '',
    isDetail:null
  },
})