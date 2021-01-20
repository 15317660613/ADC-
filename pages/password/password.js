// pages/password/password.js
import { urls } from "../../utils/urls.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_focus: false,
    new_focus_value: "",
    old_focus: false,
    old_focus_value: "",
    confirm_focus: false,
    confirm_focus_value: ""
  },

  oldlistenerPhoneInput: function (e) {
    // 用户名input 
    this.setData({
      old_focus: true,
      new_focus: false,
      confirm_focus: false
      
    });
  },
  newlistenerPhoneInput: function (e) {
    // 用户名input 
    this.setData({
      old_focus: false,
      new_focus: true,
      confirm_focus: false
      
    });
  },
  confirmlistenerPhoneInput: function (e) {
    // 用户名input 
    this.setData({
      old_focus: false,
      new_focus: false,
      confirm_focus: true
      
    });
  },
  oldonInputEvent: function (e) {
    this.setData({
      old_focus_value: e.detail.value

    });
  },
  newonInputEvent: function (e) {
    this.setData({
      new_focus_value: e.detail.value

    });
  },
  confirmonInputEvent: function (e) {
    this.setData({
      confirm_focus_value: e.detail.value
    });
  },
 

 
  submit: function (e) {
  
    if (this.data.old_focus_value===""){
wx.showToast({
  icon: 'none',
  title: '请输入旧密码',
})
return;
    } else if (this.data.new_focus_value === ""){
      wx.showToast({
        icon: 'none',
        title: '请输入新密码',
      })
      return;
    } else if (this.data.confirm_focus_value === ""){
      wx.showToast({
        icon: 'none',
        title: '请确认新密码',
      })
      return;
    } else if (this.data.confirm_focus_value !== this.data.new_focus_value){
      wx.showToast({
        icon: 'none',
        title: '两次新密码输入不一致',
      })
      return;
    }
    if (!/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,10}$/.test(this.data.confirm_focus_value)) {
      wx.showToast({
        icon: 'none',
        title: '密码必须6-10位且不能为纯数字，不能为纯字母，不能为纯特殊符号',
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })

  
    wx.request({
      url: urls.baseUrl + urls.updatePassword,
      method: "POST",
      data: {
        "usid": app.globalData.userInfo.usid,
        "oldPWD": this.data.old_focus_value,
        "newPWD": this.data.new_focus_value,
        
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ok === true) {
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
                  wx.reLaunch({
                    url: '/pages/login/login?openId=' + openId,
                  })
                },
                fail(res) {
                  wx.hideLoading();
                }
              })
            }
          })
          wx.showToast({
            icon: 'none',
            title: res.data.data,
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: res.data.message,
          })
        }
      },
      fail(res) {
        wx.hideLoading();
      },
      complete(res) {
        //为解决弹出提示一闪而逝问题不能在该生命周期调用hide
        // wx.hideLoading();
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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