//获取应用实例
const app = getApp();
import { urls } from "../../utils/urls.js";
// pages/personInfo/personInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    password: '',
    showStatus : true,
    openId: "",
    eyeStatus: "../../assects/eye-close.png",
    lockLogin:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(option) {
    this.setData({
      openId: option.openId
    })
  },

  // 点击眼睛后调用
  changeStatus: function(){
    this.setData({
      showStatus : !this.data.showStatus,
      eyeStatus: this.data.showStatus ? "../../assects/eye.png" : "../../assects/eye-close.png"
    })
  },

  submitForm(e) {
      console.log(e);
      console.log(app.globalData);
      const _this = this;
      if(!_this.data.lockLogin){
        return
      }
      _this.setData({lockLogin: false});
      let fil = e.detail.value;
      let form_id = e.detail.formId;
      let openId = this.data.openId;
      for (let i in fil) {
        if (!fil[i]) {
          return wx.showModal({
            title: '请将登录信息填写完整',
            content: '',
            showCancel: false,
          })
        }
      }
      wx.showLoading({
        title: '加载中',
        mask : true
      })
      // 登录
      wx.request({
        url: urls.baseUrl+ urls.loginUrl,
        method: 'GET',
        data: {
          ...fil,
          openId
        },
        success(resp) {
          console.log(resp);
          // 如果入口是个人中心，确定动作只完善个人信息
          if ( resp.data.respCode == "0" ){
            wx.showModal({
              title: '登录成功',
              content: '',
              showCancel: false,
              success(res) {
                  console.log(resp.data,"==============");
                app.globalData.userInfo = resp.data.data;
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/mainindex/mainindex'
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: resp.data.message,
              content: '',
              showCancel: false,
            })
          }
        },
        complete (res){
          _this.setData({lockLogin: true});
          wx.hideLoading();
        }
      })
  }
})
