// pages/compomemt/home/home.js
const util = require('../../../utils/util.js')
import {
  urls
} from "../../../utils/urls.js";
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
    loginLock: true,
    isScienceMember:false,
    isScienceLeadedr:false,
    isNormal:false
  },


  attached() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let that = this;
    if(null === app.globalData.userInfo){
      that.getOpenId()
    }else{
      app.globalData.userInfo.roleEOList.forEach(item => {
        if (item.extInfo == 'RS_LEADER') {
          that.setData({
              isScienceLeadedr: true,
            });
        }
        if (item.extInfo == 'SCHEDULE_RESEARCH') {
          that.setData({
            isScienceMember: true,
            });
        }
        if (!that.data.isScienceMember&&item.extInfo == 'SCHEDULE_RESEARCH_MEMBER') {
          that.setData({
            isScienceLeadedr: true,
            });
        }
    });
    if(!that.data.isScienceMember&&!that.data.isScienceLeadedr){
      that.setData({
        isNormal: true,
        });
    }
    }
    
  },


  /**
   * 组件的方法列表
   */
  methods: {

    /*** 下载文件并预览*/

    getOpenId: function() {

      console.log(' getOpenId: function() {');
      const _this = this;
      if(!_this.data.loginLock){
        return ;
      }
      _this.setData({
          loginLock:false
      })
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
                _this.setData({
                    loginLock:true
                })
              let openId = res.data.data.data;
              _this.checkUserExist(openId);
              wx.hideLoading();
            },
            fail(res) {
              _this.setData({
                  loginLock:true
              })
            }
          })
        }
      })
    },
    checkUserExist: function(openId) {
      let _this = this;
      if(null === app.globalData.userInfo) {
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
                      app.globalData.userInfo.roleEOList.forEach(item => {
                        if (item.extInfo == 'RS_LEADER') {
                          _this.setData({
                              isScienceLeadedr: true,
                            });
                        }
                        if (item.extInfo == 'SCHEDULE_RESEARCH') {
                          _this.setData({
                            isScienceMember: true,
                            });
                        }
                        if (!_this.data.isScienceMember&&item.extInfo == 'SCHEDULE_RESEARCH_MEMBER') {
                          _this.setData({
                            isScienceLeadedr: true,
                            });
                        }
                    });
                    if(!_this.data.isScienceMember&&!_this.data.isScienceLeadedr){
                      _this.setData({
                        isNormal: true,
                        });
                    }
                      //_this.      (true);
                  }
              },
              fail(res) {
                  wx.hideLoading();
              }
          })
      }else{
        app.globalData.userInfo.roleEOList.forEach(item => {
                        if (item.extInfo == 'RS_LEADER') {
                          _this.setData({
                              isScienceLeadedr: true,
                            });
                        }
                        if (item.extInfo == 'SCHEDULE_RESEARCH') {
                          _this.setData({
                            isScienceMember: true,
                            });
                        }
                        if (!_this.data.isScienceMember&&item.extInfo == 'SCHEDULE_RESEARCH_MEMBER') {
                          _this.setData({
                            isScienceLeadedr: true,
                            });
                        }
                    });
                    if(!_this.data.isScienceMember&&!_this.data.isScienceLeadedr){
                      _this.setData({
                        isNormal: true,
                        });
                    }
      }
    },

    item1OnClick: function(e) {

      wx.redirectTo({
        url: "../../pages/mainindex/scheduleindex"

      })



    },
    item2OnClick: function(e) {
      // if (app.globalData.userInfo.extInfo3 === '1') {
        wx.redirectTo({
          url: "../../pages/sopport2/sopport2"
         // url: "../../pages/support/support"

      //   })
      // } else {
      //   wx.redirectTo({
      //     url: "../../pages/support/support"

        })
    // }
    },
    item3OnClick: function(e) {
      console.log(app.globalData.userInfo.extInfo3,"=-----------------?");
      if (app.globalData.userInfo.extInfo4 === '1') {

        wx.redirectTo({
          url: "../../pages/partycommittee2/partycommittee2"

        })
      } else {
        wx.redirectTo({
          url: "../../pages/partycommittee/partycommittee"

        })
      }
    },
    item4OnClick: function(e) {

      if (app.globalData.userInfo.extInfo4 === '1') {
        wx.redirectTo({
          url: "../../pages/office2/office2"

        })
      } else {
        wx.redirectTo({
          url: "../../pages/office/office"

        })
      }
    },
    item5OnClick: function(e) {
      console.log(app.globalData.userInfo,"=-----------------?");
      wx.redirectTo({
        url: "../../pages/scienceMonth/scienceMonth"

      })
    },
    item6OnClick: function(e) {
      console.log(app.globalData.userInfo,"=-----------------?");
      wx.redirectTo({
        url: "../../pages/calendar/calendar"
      })
    },
  }
})
