// pages/mineinfo/mineinfo.js
const app = getApp()
import { urls } from "../../utils/urls.js";
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    tel_focus:false,
    mobile_focus:false,
    elec_focus:false,
    account:"",
    usname:"",
    userCode:"",
    contactAddress:"",
    officePhone:"",
    cellPhoneNumber:"",
    email:"",

    userinfor:{
      officePhone: "",
      cellPhoneNumber: "",
      email: "",
    }
  },


  tellistenerPhoneInput: function (e) {
    this.setData({
      tel_focus: true,
      mobile_focus: false,
      elec_focus: false,
      
    });

  },
  mobilelistenerPhoneInput: function (e) {
    this.setData({
      tel_focus: false,
      mobile_focus: true,
      elec_focus: false,
    
    });
  },
  eleclistenerPhoneInput: function (e) {
    this.setData({
      tel_focus: false,
      mobile_focus: false,
      elec_focus: true,
    });
  },

  telonInputEvent: function (e) {
    this.setData({
      officePhone: e.detail.value
    });
  },
  mobileonInputEvent: function (e) {
    this.setData({
      cellPhoneNumber: e.detail.value
    });
  },
  eleconInputEvent: function (e) {
    this.setData({
      email: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //that.getOpenId()
    this.setData({

      account: app.globalData.userInfo.account === null ? '' : app.globalData.userInfo.account,
      usname: app.globalData.userInfo.usname === null ? '' : app.globalData.userInfo.usname,
      userCode: app.globalData.userInfo.userCode === null ? '' : app.globalData.userInfo.userCode,
      contactAddress: app.globalData.userInfo.contactAddress === null ? '' : app.globalData.userInfo.contactAddress,
      officePhone: app.globalData.userInfo.officePhone === null ? '' : app.globalData.userInfo.officePhone,
      cellPhoneNumber: app.globalData.userInfo.cellPhoneNumber === null ? '' : app.globalData.userInfo.cellPhoneNumber,
      email: app.globalData.userInfo.email === null ? '' : app.globalData.userInfo.email

    })


  },

  submit: function (e) {
    console.log(e, 555555, this.data.officePhone);
    if (this.data.officePhone &&!(/^\d{8}$/.test(this.data.officePhone)) &&
      !(/^\d{1,4}-\d{8}$/.test(this.data.officePhone)) &&
      !(/^\d{1,4}-\d{8}-\d{1,5}$/.test(this.data.officePhone)) &&
      !(/^\d{8}\/\d{8}$/.test(this.data.officePhone))
    ) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确格式的办公电话'
      })
      return;
    }
    if (this.data.cellPhoneNumber &&!(/^1\d{10}$/.test(this.data.cellPhoneNumber))) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确格式的手机号'
      })
      return;
    }
    if (this.data.email&&!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.data.email)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确格式的邮箱'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: urls.baseUrl + urls.updateUserUrl,
      method: "POST",
      data: {
       
        "usid": app.globalData.userInfo.usid,
        "officePhone": this.data.officePhone,
        "cellPhoneNumber": this.data.cellPhoneNumber,
        "email": this.data.email
      },
      success: function (res) {
        if (res.data.respCode == 0) {
          app.globalData.userInfo = res.data.data;
         
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '修改成功！',

          })
        }
      },
      complete(res) {
        wx.hideLoading();
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