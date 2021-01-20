const app = getApp()

import {
  urls
} from "../../utils/urls.js";
let util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    scheduleMeetEO: null,
    scheduleMeetUserEOList: [],
    requestLock: true,
    title: '',
    createTime: '',
    rsId:""
  },


  getData: function () {
    let that = this;
    let item = {
      id: that.data.id,
      createUserId: app.globalData.userInfo.usid
    };
    wx.request({
      url: urls.baseUrl + urls.getPersonScienceDetailUrl(item),
      method: "GET",
      success: function (res) {
        let content1 = res.data.data.list[0];
        for (var item in content1){
          if(content1[item]){
            content1[item] = util.htmlDecodeByRegExp(content1[item]);
          }
      }
        that.setData({
          scheduleMeetEO: content1,
          rsId:content1.id
        })
      },
      fail(res) {},
      complete(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id);
    that.setData({
      id: options.id,
      collect: options.collect,
      title: options.title,
      createTime: options.createTime,
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.getData();

  },
  // 获取详情的值
  bindEquipment: function (e) {

    console.log(e)
    let that = this;
    var value = e.detail.value;
    that.setData({ //更新备注内容
        'scheduleMeetEO.content': value
      }),
      console.log(value, 'bindEquipment')

  },
  cancleSubmit: function () {
    let that = this;
    console.log(that.data.requestLock, 'requestLock1')

    if (!that.data.requestLock) {
      return;
    }
    console.log(that.data.pageLock, 'requestLock2')
    that.setData({
      requestLock: false,
    })
    console.log(that.data.requestLock, 'requestLock3')

    wx.showModal({
      title: '提示',
      content: '您确定要将此条安排\r\n切换为未完成状态吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用切换状态的方法了
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          that.setData({
            requestLock: true,
          })
          wx.request({
            url: urls.baseUrl + urls.updatescheduleMeetUser,
            method: "PUT",
            data: {
              receiveUserId: app.globalData.userInfo.usid,
              meetId: that.data.id,
              status: 0,
            },
            success: function (res) {
              if (res.data.respCode == 0) {
                wx.navigateBack({
                  delta: 1
                })
                that.setData({
                  requestLock: true,
                })
                wx.showToast({
                  title: '成功',
                })
              }
            },
            complete(res) {
              that.setData({
                requestLock: true,
              })
              wx.hideLoading();
            }
          })
        } else if (sm.cancel) {
          that.setData({
            requestLock: true,
          })
          console.log('用户点击取消')
        }
      }
    })
  },
  submit: function () {
    let that = this;
    console.log(that.data.requestLock, 'requestLock1', that.data.scheduleMeetEO)
    if (!that.data.scheduleMeetEO.content.trim()) {
      wx.showToast({
        icon: 'none',
        title: '请填写内容',
      })
      return;
    }
    // return;
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    if (!that.data.requestLock) {
      return;
    }
    console.log(that.data.pageLock, 'requestLock2')
    that.setData({
      requestLock: false,
    })
    console.log(that.data.requestLock, 'requestLock3',urls.baseUrl + urls.setPersonScienceDetailUrl(),that.data.scheduleMeetEO.content.trim())
    wx.request({
      url: urls.baseUrl + urls.setPersonScienceDetailUrl(),
      method: "PUT",
      data: {
        status: 1,
        content: that.data.scheduleMeetEO.content.trim(),
        id: that.data.rsId,
        researchId:that.data.id
      },
      success: function (res) {
        if (res.data.respCode == 0) {
          wx.navigateBack({
            delta: 1
          })
          that.setData({
            requestLock: true,
          })
          wx.showToast({
            title: '成功',
          })
        }
      },
      complete(res) {
        wx.hideLoading();
        that.setData({
          requestLock: true,
        })
      }
    })

  },

  collect: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: urls.baseUrl + urls.setScienceTopOrCollectUrl(),
      method: "PUT",
      data: {
        userId: app.globalData.userInfo.usid,
        researchId: that.data.id,
        collect: 1,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {
          // that.getData();
          that.setData({
            'collect': "1",
          })
          wx.showToast({
            title: '收藏成功',
          })
          // util.showMyToast(that,'收藏成功!');
        }
      },
      fail: function () {
        wx.hideLoading();
      },
      complete(res) {
        // wx.hideLoading();
      }
    })

  },

  uncollect: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: urls.baseUrl + urls.setScienceTopOrCollectUrl(),
      method: "PUT",
      data: {
        userId: app.globalData.userInfo.usid,
        researchId: that.data.id,
        collect: 0,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {
          that.setData({
            'collect': "0",
          })
          wx.showToast({
            title: '取消收藏',
          })
          // util.showMyToast(that,'取消收藏!');
        }
      },
      fail: function () {
        wx.hideLoading();
      },
      complete(res) {
        // wx.hideLoading();
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})