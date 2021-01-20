// pages/mime/mine.js
import { urls } from "../../utils/urls.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    name: "user name"
  },

  onWodeClick:function(e){
    wx.navigateTo({
      url: "../../pages/mineinfo/mineinfo"
  
    })
  },

  onMimaClick: function (e) {
    wx.navigateTo({
    url: "../../pages/password/password"
    })
  },

  onWeixinClick: function (e) {
    this.setData({
    visible:true
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
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(app.globalData.userInfo);
    this.setData({
      
      name: app.globalData.userInfo.usname
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