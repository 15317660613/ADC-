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
    scheduleMeetEO:[],
    scheduleMeetUserEOList:[],
    requestLock: true,
    collect:0,
    title:'',
    createTime:''
  },


  getData:function(){
    let that = this;
    wx.request({
      url: urls.baseUrl + urls.getAllScienceDetailUrl(that.data.id),
      method: "GET",
      success: function (res) {
        let content1 = res.data.data;
        console.log(content1,66666)
        for (var i = 0; i < content1.length; i++) {
          for (var item in content1[i]){
            if(content1[i][item]){
              content1[i][item] = util.htmlDecodeByRegExp(content1[i][item]);
            }
        }
        }
        wx.request({
          url: urls.baseUrl + urls.getAllScienceDetailStatusUrl(that.data.id),
          method: "GET",
          success: function (resp) {
            let content2 = resp.data.data;
            for (var i = 0; i < content2.length; i++) {
              content2[i]["updateTime"] = content2[i]["updateTime"] ? util.tsFormatTime(content2[i]["updateTime"], 'Y-M-D h:m'):'';
            }
            that.setData({
              scheduleMeetEO: content1,
              scheduleMeetUserEOList: content2,
            })
    
          },fail(res){
          },
          complete(res) {
            wx.hideLoading();
          }
        })
      },fail(res){
      },
      complete(res) {
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
