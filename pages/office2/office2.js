//index.js//获取应用实例
const app = getApp()

import {
  urls
} from "../../utils/urls.js";
let util = require("../../utils/util.js");
Page({
  data: {
    /**        * 页面配置        */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,

    list: [],
    list2: [],
    page: 1,
    hasMoreData: true,//是否还有更多数据
    hasFail: false,//获取列表数据是否出错
    showSearch: false,
    search: '',
    focused: false,
    searchContent: "",
      pageLock:true,
    _lastTime:0
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取列表数据的方法
    if (that.data.currentTab == 0) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    }

  },
  onLoads: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取列表数据的方法
    if (that.data.currentTab == 0) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    }


    //this.getList2();  //获取列表数据的方法

  },
  /**     * 滑动切换tab     */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  goTop: function () {
    if (wx.pageScrollTo) { //当滑动距离不为0（不处于顶部时）
      wx.pageScrollTo({
        scrollTop: 0 //设置滑动距离为0
      })
    } else { //版本过低时的兼容操作
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  detailOnClick: function (e) {
    let nowDate = new Date();
    let that = this;
    console.log(e);
    if (util.throwQuickClick(nowDate, that.data._lastTime, 2000)) {
      wx.navigateTo({
        url: "../../pages/officedetail/officedetail?id=" + e.currentTarget.id
      })
    }
    that.setData({
      _lastTime: new Date()
    })
  },
  /**   * 点击tab切换   */
  swichNav: function (e) {

    var that = this;
    that.goTop();
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })


      if (e.target.dataset.current == 0) {

        that.setData({
          visible: false,
          page: 1,
        })

        wx.showLoading({
          title: '加载中',
          mask: true
        })

        this.getList(1);  //获取列表数据的方法


      } else {
        that.setData({
          visible: true,
          page: 1,
        })

        wx.showLoading({
          title: '加载中',
          mask: true
        })

        this.getList(2);  //获取列表数据的方法


      }
    }
  },

  showInput: function (e) {
    this.setData({
      showSearch: !this.data.showSearch,
      focused: true
    });

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
        if (res.data.respCode == 0) {
          if (that.data.currentTab == 0) {
            that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
          } else {
            that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
          }
          wx.showToast({
            title: '置顶成功',
          })
        }
      },
      complete(res) {
        wx.hideLoading();
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
        if (res.data.respCode == 0) {

          if (that.data.currentTab == 0) {
            that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
          } else {
            that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
          }
          wx.showToast({
            title: '取消置顶',
          })
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })

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
      _this.onLoads();
    });

  },
  searchMember: function (e) {
    let that = this;
    let search = e.detail.value;
    that.setData({
      search
    })
    if (that.data.currentTab == 0) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    }
  },

  onPullDownRefresh: function () {
    var that = this;
    //下拉刷新，由于我的列表数据是分页的，所以下拉刷新时，需要将page置为1，再调用获取列表数据的方法
    if (that.data.currentTab == 0) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    }
  },

  onReachBottom: function () {



    var that = this;
    //上拉加载，判断是否还有数据，如果没有数据，则不执行获取数据的方法，避免重复无用的调用接口
    if (that.data.currentTab == 0) {
      that.data.hasMoreData ? that.getList(1) : null;
    } else {
      that.data.hasMoreData ? that.getList(2) : null;
    }
  },
  getList: function (options) {
    let that = this;
    if (that.data.currentTab == 0) {
      console.log('getList: function (options)');
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
        url: urls.baseUrl + urls.allPartyCommittee,
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
              pageLock: true,
            list: listData.concat(list1),
            hasFail: false
          })
          //获取的数据条数为0或小于20（20是设置的每页数据条数），则说明之后没有数据了

          if (list1.length == 0 || list1.length < 10) {
            that.setData({ hasMoreData: false,
                pageLock: true});
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
    } else {
      console.log('getList: function (options)');
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
              pageLock: true,
            list: listData.concat(list1),
            hasFail: false
          })
          //获取的数据条数为0或小于20（20是设置的每页数据条数），则说明之后没有数据了

          if (list1.length == 0 || list1.length < 10) {
            that.setData({ pageLock: true,hasMoreData: false });
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
    }
  },

  getList2: function (options) {
    console.log('getList: function (options)');
    var that = this;
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
      url: urls.baseUrl + urls.allPartyCommittee,
      method: "GET",
      data: {
        page: this.data.page,
        meetType:1,
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

        that.setData({
            pageLock: true,
          list2: listData.concat(list1),
          hasFail: false
        })
        //获取的数据条数为0或小于20（20是设置的每页数据条数），则说明之后没有数据了

        if (list1.length == 0 || list1.length < 10) {
          that.setData({ hasMoreData: false });
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
})
