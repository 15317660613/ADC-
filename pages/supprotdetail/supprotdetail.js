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
    tag:'',
    status:"",
    scheduleMeetEO: null,
   chooseContent: '',
   requestLock:true
  },
  listenerRadioGroup: function (e) {

    var that = this;
    console.log(e);

    let value = e.detail.value;
    if (value ==="已完成"){
    that.setData({
      chooseContent: 1,
    })
      console.log(that.data.chooseContent);
    } else if (value === "不同意，驳回"){
      that.setData({
        chooseContent: 2,
      })
      console.log(that.data.chooseContent);
    } else if (value === "暂不处理") {
      that.setData({
        chooseContent: 3,
      })
      console.log(that.data.chooseContent);
    }


  },


  getData: function(){
    let that = this;
    var myUrl = urls.supprotDetail(this.data.id);
    if (this.data.tag==2){
      myUrl = urls.supprotMyDetail(this.data.id, app.globalData.userInfo.usid);
    }
    wx.request({
      url: urls.baseUrl + myUrl ,
      method: "GET",
      success: function (res) {
        let content1 = res.data.data
        content1["createTime"] = util.tsFormatTime(content1["createTime"], 'Y-M-D');
        for (var item in content1){
          if(content1[item]){
            content1[item] = util.htmlDecodeByRegExp(content1[item]);
          }
      }
        that.setData({
          scheduleMeetEO: content1,
          chooseContent: res.data.data.status,
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
    that.setData({
      id: options.id,
      tag: options.tag,
      status: options.status
    })
    console.log(options);
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.getData();

  },
  submit: function () {
    var that = this;
    if(that.data.chooseContent===""){
      wx.showToast({
        icon: 'none',
        title: '请选择处理意见',
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var id = that.data.id;
    var collectUrl = urls.updatescheduleSupport;
    if (that.data.tag == 2) {
      id = that.data.scheduleMeetEO.extInfo3;
      collectUrl = urls.updatescheduleMySupport;
    }
    wx.request({
      url: urls.baseUrl + collectUrl,
      method: "PUT",
      data: {
        id: id,
        status: that.data.chooseContent,
      },
      success: function (res) {
        if (res.data.respCode == 0) {
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '审批成功',
          })
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })

  },

  collect: function () {
    var that = this;
    var id = that.data.id;
    var collectUrl = urls.updatescheduleSupport;
    if (that.data.tag == 2) {
      id = that.data.scheduleMeetEO.extInfo3;
      collectUrl = urls.updatescheduleMySupport;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: urls.baseUrl + collectUrl,
      method: "PUT",
      data: {
        id: id,
        collected: 1,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {
          that.setData({
            'scheduleMeetEO.collected': 1,
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
    });

  },

  uncollect: function () {
    var that = this;
    var id = this.data.id;
    var collectUrl = urls.updatescheduleSupport;
    console.log(that.data,33333)
    if (that.data.tag == 2) {
      id = that.data.scheduleMeetEO.extInfo3;
      collectUrl = urls.updatescheduleMySupport;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: urls.baseUrl + collectUrl,
      method: "PUT",
      data: {
        id: id,
        collected: 0,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {
          // that.getData();
          that.setData({
            'scheduleMeetEO.collected': 0,
          })
          wx.showToast({
            title: '取消收藏',
          })
          // util.showMyToast(that, '取消收藏!');
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
