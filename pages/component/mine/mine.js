// pages/compomemt/mine/mine.js
import { urls } from "../../../utils/urls.js";
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
 visible: false,
    name: "user name"
  },

  attached() {
    let that = this;

    that.getOpenIds()

  },

  ready() {

  },

  observers: {

  },



  /**
   * 组件的方法列表
   */
  methods: {

    getOpenIds: function () {
      const _this = this;
      wx.login({
        // 获取code凭证
        success(res) {
          wx.request({
            // 获取openid
            url: urls.baseUrl + urls.openidUrl,
            method: 'POST',
            data: {
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success(res) {
              let openId = res.data.data.data;
              _this.checkUserExist(openId);
              wx.hideLoading();
            },
            fail(res) {

            }
          })
        }
      })
    },
    checkUserExist: function (openId) {
      let _this = this;
      wx.request({
        url: urls.baseUrl + urls.getUser(openId),
        method: 'GET',
        success(res) {
          if (res.data.respCode != "0") {
            wx.redirectTo({
              url: '/pages/login/login?openId=' + openId,
            })
          } else {
            app.globalData.userInfo = res.data.data;

            _this.setData({

            name: app.globalData.userInfo.usname
     })

          }
        },
        fail(res) {
          wx.hideLoading();
        }
      })
    },

    onWodeClick: function (e) {
      wx.navigateTo({
        url: "../../pages/mineinfo/mineinfo"

      })

      // wx.downloadFile({
      //   //app.globalData.resume 这是我从接口获取的文档路径
      //   url: "http://123.127.164.20:21936/api/sys/file/4769d9e5d65c43f69733aba7c2ad8e95/download",
      //   success: function (res) {
      //     var filePath = res.tempFilePath

      //     console.log(filePath)

      //     // app.globalData.fileType 这是我从接口获取的文档的类型
      //     wx.openDocument({
      //       filePath: filePath,
      //       fileType: "xlsx",
      //       success: function (res) {
      //         console.log("打开文档成功")
      //         console.log(res);
      //       },
      //       fail: function (res) {
      //         console.log("fail");
      //         console.log(res)
      //       },
      //       complete: function (res) {
      //         console.log("complete");
      //         console.log(res)
      //       }
      //     })
      //   },
      //   fail: function (res) {
      //     console.log('fail')
      //     console.log(res)
      //   },
      //   complete: function (res) {
      //     console.log('complete')
      //     console.log(res)
      //   }
      // })
    },
    onMimaClick: function (e) {
      wx.navigateTo({
        url: "../../pages/password/password"
      })
    },

    onWeixinClick: function (e) {
      this.setData({
        visible: true
      })

    },

    cancle: function (e) {
      this.setData({
        visible: false
      })

    },

    confirm: function (e) {
      this.setData({
        visible: false

      })
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      let that = this;

      that.getOpenId()


    },

    getOpenId() {
      const _this = this;
      wx.login({
        // 获取code凭证
        success(res) {
          wx.request({
            // 获取openid
            url: urls.baseUrl + urls.openidUrl,
            method: 'POST',
            data: {
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success(res) {
              console.log(res, " res.data.data.data");
              let openId = res.data.data.data;
              _this.unbind(openId)
            },
            fail(res) {
              wx.hideLoading();
            }
          })
        }
      })
    },
    unbind(openId) {
      const _this = this;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: urls.baseUrl + urls.unbindWeixin,
        method: "GET",
        data: {
          "userId": app.globalData.userInfo.usid,
        },
        success: function (res) {
          if (res.data.respCode == 0) {

            wx.showToast({
              title: '解绑成功！',
            })
            wx.redirectTo({
              url: "../../pages/login/login?openId=" + openId
            })
          }
        },
        complete(res) {
          wx.hideLoading();
        }
      })

    },
  }
})
