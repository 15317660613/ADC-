// pages/partycommittee/partycommittee.js

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
    list: [],
    page: 1,
    hasMoreData: true,//是否还有更多数据
    hasFail: false,//获取列表数据是否出错
    showSearch: false,
    search: '',
    focused: false,
    searchContent: "",
    pageLock: true,
    requestLock:true,
    _lastTime:0
  },

  showInput: function (e) {
    this.setData({
      showSearch: !this.data.showSearch,
      focused: true
    });

  },
  hideInput: function (e) {
    let _this = this;
    this.setData({
      showSearch: !this.data.showSearch,
      focused: false,
      search: '',
      page: 1,
      searchContent: ""
    }, function () {
      _this.onLoad();
    });

  },
  searchMember: function (e) {
    let that = this;
    let search = e.detail.value;
    that.setData({
      search
    })
    that.setData({ hasMoreData: true, page: 1 }, () => that.getList());
  },

  onPullDownRefresh: function () {
    var that = this;
    //下拉刷新，由于我的列表数据是分页的，所以下拉刷新时，需要将page置为1，再调用获取列表数据的方法
    that.setData({ hasMoreData: true, page: 1 }, () => that.getList());
  },

  onReachBottom: function () {



    var that = this;
    //上拉加载，判断是否还有数据，如果没有数据，则不执行获取数据的方法，避免重复无用的调用接口
    that.data.hasMoreData ? that.getList() : null;
  },
  getList: function (options) {
      console.log('getList: function (options)');
      let that = this;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      console.log(that.data.pageLock, 'pageLock1')

      if (!that.data.pageLock) {
          // that.setData({
          //     list: that.data.list
          // })
          return;
      }
      console.log(that.data.pageLock, 'pageLock2')
      that.setData({
          pageLock: false,
      })
      console.log(that.data.pageLock, 'pageLock3')
    wx.request({
      url: urls.baseUrl + urls.minePartyCommittee,
      method: "GET",
      data: {
        page: this.data.page,
        meetType: 1,
        receiveUserId: app.globalData.userInfo.usid,
        pageSize: 10,
        title: this.data.search
      },
      success: function (res) {
        wx.hideLoading();
        //因为是分页加载的列表，因此需要判断，是否是第一页，是则需要将数据清空，否则将之前的列表数据赋值
        let listData = that.data.page == 1 ? [] : that.data.list;
        //接口获取数据成功，将下拉刷新的操作停止（动画停止）
        wx.stopPullDownRefresh();

        let list1 = res.data.data.list
        for (var i = 0; i < list1.length; i++) {
          list1[i]["createTime"] = util.tsFormatTime(list1[i]["createTime"], 'Y-M-D h:m');
          list1[i]["deadTime"] = util.tsFormatTime(list1[i]["deadTime"], 'Y-M-D h:m');
          for (var item in list1[i]){
            if(list1[i][item]){
                list1[i][item] = util.htmlDecodeByRegExp(list1[i][item]);
            }
        }
        }
        that.setData({
          list: listData.concat(list1),
            pageLock: true,
          hasFail: false
        })
        //获取的数据条数为0或小于20（20是设置的每页数据条数），则说明之后没有数据了

        if (list1.length == 0 || list1.length < 10) {
          that.setData({ hasMoreData: false,
              pageLock: true,
          });
        } else {
          //否则之后还有数据，将页数加1
          that.setData({
              pageLock: true,
            hasMoreData: true,
            page: ++that.data.page
          })

          console.log(that.data.page);
        };
      },
      fail: function () {
        wx.hideLoading();
        that.setData({
            pageLock: true,
          hasFail: true
        });
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    this.setData({ hasMoreData: true, page: 1 }, () => this.getList()); //获取列表数据的方法

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      wx.showLoading({
      title: '加载中',
      mask: true
    })

    this.setData({ hasMoreData: true, page: 1 }, () => this.getList()); //获取列表数据的方法

  },


  detailOnClick: function (e) {
    let nowDate = new Date();
    let that = this;
    console.log(e);
    if (util.throwQuickClick(nowDate, that.data._lastTime, 2000)) {
      wx.navigateTo({
        url: "../../pages/officedetail/officedetail?id=" + e.currentTarget.id
      })
      that.setData({
        _lastTime: new Date()
      })
    }
  },


  collect: function (e) {
    let i = e.target.dataset.index;
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
        meetId: e.currentTarget.id,
        collected: 1,
      },
      success: function (res) {
        if (res.data.respCode == 0) {
          var extInfo2 = "list[" + i + "].extInfo2";

          that.setData({
            [extInfo2]: '1'
          })
          // wx.showToast({
          //   title: '收藏成功',
          // })
            util.showMyToast('','收藏成功!');
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })

  },

  uncollect: function (e) {
    let i = e.target.dataset.index;
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
        meetId: e.currentTarget.id,
        collected: 0,
      },
      success: function (res) {
        if (res.data.respCode == 0) {
          var extInfo2 = "list[" + i + "].extInfo2";

          that.setData({
            [extInfo2]: '0'
          })

          // wx.showToast({
          //   title: '取消收藏',
          // })
            util.showMyToast('','取消收藏!');
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })

  },


  top: function (e) {
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
        meetId: e.currentTarget.id,
        top: 1,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {

            that.setData({ hasMoreData: true, page: 1 }, () => that.getList());

          wx.showToast({
            title: '置顶成功',
          })
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

  untop: function (e) {
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
        meetId: e.currentTarget.id,
        top: 0,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == 0) {

            that.setData({ hasMoreData: true, page: 1 }, () => that.getList());

          wx.showToast({
            title: '取消置顶',
          })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
