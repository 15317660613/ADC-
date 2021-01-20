// pages/partycommitteedetail/partycommitteedetail.js
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
    requestLock: true
  },


  getData:function(){
    let that = this;
    wx.request({
      url: urls.baseUrl + urls.partyCommitteeDetail(this.data.id) + "/" + app.globalData.userInfo.usid,
      method: "GET",
      success: function (res) {
        let content1 = res.data.data.scheduleMeetEO
        let content2 = res.data.data.scheduleMeetUserEOList
        content1["createTime"] = util.tsFormatTime(content1["createTime"], 'Y-M-D h:m');
        content1["deadTime"] = util.tsFormatTime(content1["deadTime"], 'Y-M-D h:m');
        for (var item in content1){
          if(content1[item]){
            content1[item] = util.htmlDecodeByRegExp(content1[item]);
          }
      }
        for (var i = 0; i < content2.length; i++) {
          content2[i]["finishedTime"] = content2[i]["finishedTime"] ? util.tsFormatTime(content2[i]["finishedTime"], 'Y-M-D h:m'):"";
        }
        that.setData({
          scheduleMeetEO: content1,
          scheduleMeetUserEOList: content2,
        })
      },
      fail(res){

      },
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
      id: options.id
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.getData();

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
          console.log('用户点击取消')
        }
      }
    })


  },
  submit: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(that.data.requestLock, 'requestLock1')

    if (!that.data.requestLock) {
      return;
    }
    console.log(that.data.pageLock, 'requestLock2')
    that.setData({
      requestLock: false,
    })
    console.log(that.data.requestLock, 'requestLock3')
    wx.request({
      url: urls.baseUrl + urls.updatescheduleMeetUser,
      method: "PUT",
      data: {
        receiveUserId: app.globalData.userInfo.usid,
        meetId: that.data.id,
        status: 1,
      },
      success: function (res) {
        if (res.data.respCode == 0) {

          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '成功',
          })
          that.setData({
            requestLock: true,
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

  },

  collect: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: urls.baseUrl + urls.updatescheduleMeetUser,
      method: "PUT",
      data: {
        receiveUserId: app.globalData.userInfo.usid,
        meetId: that.data.id,
        collected: 1,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {
          // that.getData();
          that.setData({
            'scheduleMeetEO.extInfo2': "1",
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
      url: urls.baseUrl + urls.updatescheduleMeetUser,
      method: "PUT",
      data: {
        receiveUserId: app.globalData.userInfo.usid,
        meetId: that.data.id,
        collected: 0,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {
          // that.getData();
          that.setData({
            'scheduleMeetEO.extInfo2': "0",
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
