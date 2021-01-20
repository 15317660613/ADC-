// pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // item1Focus:true,
    // item2Focus: true,
    // item3Focus: true,
    // item4Focus: true
  },
  item1OnClick:function(e){
    wx.navigateTo({
      url: "../../pages/mineinfo/mineinfo"

    })
  },
  item2OnClick: function (e) {
wx.showToast({
  icon: 'none',
  title: '即将开放，尽情期待',
})
  },
  item3OnClick: function (e) {
    wx.showToast({
      icon: 'none',
      title: '即将开放，尽情期待',
    })
  },
  item4OnClick: function (e) {
    wx.showToast({
      icon: 'none',
      title: '即将开放，尽情期待',
    })
  },
  // bindtouchstart1:function(){
  //   this.setData({
  //     item1Focus: false
  //   })

  // },
  // bindtouchcancel1: function () {
  //   this.setData({
  //     item1Focus: true
  //   })
  // },
  // bindtouchstart2: function () {
  //   this.setData({
  //     item2Focus: false
  //   })

  // },
  // bindtouchcancel2: function () {
  //   this.setData({
  //     item2Focus: true
  //   })
  // },

  // bindtouchstart3: function () {
  //   this.setData({
  //     item3Focus: false
  //   })

  // },
  // bindtouchcancel3: function () {
  //   this.setData({
  //     item3Focus: true
  //   })
  // },

  // bindtouchstart4: function () {
  //   this.setData({
  //     item4Focus: false
  //   })

  // },
  // bindtouchcancel4: function () {
  //   this.setData({
  //     item4Focus: true
  //   })
  // },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  
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