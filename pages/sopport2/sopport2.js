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
    visible:false,
    /**        * 页面配置        */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 2,
    list: [],
    importList:[],
    page: 1,
    hasMoreData: true,//是否还有更多数据
    hasFail: false,//获取列表数据是否出错
    showSearch: false,
    search: '',
    focused: false,
    searchContent: "",
    startTime:0,
    endtTime:0,
    isImport:true,
    pageLock:true,
    requestLock:true,
    _lastTime:0
  },

  create: function (e) {
    wx.navigateTo({
      url: "../../pages/createrequest/createrequest"

    })

  },
  showInput: function (e) {
    this.setData({
      showSearch: !this.data.showSearch,
      focused: true
    });

  },
  hideInput: function (e) {
    console.log('hideInput');
    let _this = this;
    this.setData({
      showSearch: !this.data.showSearch,
      focused: false,
      search: '',
      page: 1,
      searchContent: ""
    }, function () {
      let obj = {
        tab: _this.data.currentTab
      }
      _this.onLoad(obj);
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
  searchMember: function (e) {
    let that = this;
    let search = e.detail.value;
    that.setData({
      search
    })
    if (that.data.currentTab == 0){
    that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else if (that.data.currentTab == 1){
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    } else if (that.data.currentTab == 2) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getImportList());
    }
  },

  onPullDownRefresh: function () {
    var that = this;
    //下拉刷新，由于我的列表数据是分页的，所以下拉刷新时，需要将page置为1，再调用获取列表数据的方法
    if (that.data.currentTab == 0) {
    that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else if (that.data.currentTab == 1){
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    } else if (that.data.currentTab == 2) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getImportList());
    }
  },

  onReachBottom: function () {



    var that = this;
    //上拉加载，判断是否还有数据，如果没有数据，则不执行获取数据的方法，避免重复无用的调用接口
    if (that.data.currentTab==0){
    that.data.hasMoreData ? that.getList(1) : null;
    } else if (that.data.currentTab == 1){
      that.data.hasMoreData ? that.getList(2) : null;
    } else if (that.data.currentTab == 2) {
      that.data.hasMoreData ? that.getImportList() : null;
    }
  },
  //打开Excel预览
  openFile: function (option){
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(that.data.requestLock, 'requestLock1')

    if (!that.data.requestLock) {
      return;
    }
    console.log(that.data.pageLock, 'requestLock2')
    that.setData({
      requestLock: false,
    })
    console.log(that.data.requestLock, 'requestLock3')
    wx.downloadFile({
      url: urls.baseUrl + urls.getDownDataUrl(option.currentTarget.dataset.fileid), //
      success: function (res) {
        var filePath = res.tempFilePath; // 小程序中文件的临时文件
        console.log(filePath);
        wx.openDocument({
          filePath: filePath,
          // 文档打开格式记得写上，否则可能不能打开文档。 文档类型只能是一个
          // 若是想打开多种类型的文档，可以解析文档地址中的文档格式，动态复制到fileTpye参数
          fileType: option.currentTarget.dataset.filetype,
          success: function (res) {
            wx.hideLoading();
            console.log('打开文档成功');
            that.setData({
              requestLock: true,
            })
          },
          fail: (e) => {
            wx.hideLoading();
            console.log(e);
            that.setData({
              requestLock: true,
            })
          }
        })
      }
    })
  },
  //获取重点工作列表
  getImportList: function (options){
    console.log('getImportList: function (options)');
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
      console.log(that.data.pageLock, 'pageLock1')

      if (!that.data.pageLock) {
          // that.setData({
          //   list: that.data.list
          // })
          return;
      }
      console.log(that.data.pageLock, 'pageLock2')
      that.setData({
          pageLock: false,
      })
      console.log(that.data.pageLock, 'pageLock3')

    wx.request({
      url: urls.baseUrl + urls.getImportDataUrl(),
      method: "GET",
      data: {
        page: this.data.page,
        // receiveUserId: app.globalData.userInfo.usid,
        pageSize: 10,
        // title: this.data.search
      },
      success: function (res) {
        wx.hideLoading();
        //因为是分页加载的列表，因此需要判断，是否是第一页，是则需要将数据清空，否则将之前的列表数据赋值
        let listData = that.data.page == 1 ? [] : that.data.importList;
        //接口获取数据成功，将下拉刷新的操作停止（动画停止）
        wx.stopPullDownRefresh();

        let list1 = res.data.data.list
        for (var i = 0; i < list1.length; i++) {
          let str = list1[i].name;
          list1[i]["createTime"] = util.tsFormatTime(list1[i]["createTime"], 'Y/M/D');
          if (str && str.indexOf("(") != -1 && str.indexOf(")") != -1){
            list1[i].infoTime = str.substring(str.indexOf("("), str.indexOf(")")+1)
            list1[i].name = str.substring(0, str.indexOf("("))
          }
          for (var item in list1[i]){
            if(list1[i][item]){
                list1[i][item] = util.htmlDecodeByRegExp(list1[i][item]);
            }
        }
        }
        that.setData({
            pageLock: true,
          importList: listData.concat(list1),
          hasFail: false
        })
        //获取的数据条数为0或小于20（20是设置的每页数据条数），则说明之后没有数据了
        if (list1.length == 0 || list1.length < 10) {
          that.setData({ pageLock: true, hasMoreData: false });
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
  getList: function (options) {
    let that = this;
    if (that.data.currentTab == 0){
      console.log('getList: function (options)');
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      console.log(that.data.pageLock, 'pageLock1')

      if (!that.data.pageLock) {
        // that.setData({
        //   list: that.data.list
        // })
        return;
      }
      console.log(that.data.pageLock, 'pageLock2')
      that.setData({
        pageLock: false,
      })
      console.log(that.data.pageLock, 'pageLock3')

      wx.request({
        url: urls.baseUrl + urls.myscheduleMySupport,
        method: "GET",
        data: {
          page: that.data.page,
          receiveUserId: app.globalData.userInfo.usid,
          pageSize: 10,
          title: that.data.search
        },
        success: function (res) {
          wx.hideLoading();
          console.log(that.data.pageLock, 'success')

          //因为是分页加载的列表，因此需要判断，是否是第一页，是则需要将数据清空，否则将之前的列表数据赋值
          let listData = that.data.page == 1 ? [] : that.data.list;
          //接口获取数据成功，将下拉刷新的操作停止（动画停止）
          wx.stopPullDownRefresh();

          let list1 = res.data.data.list
          for (var i = 0; i < list1.length; i++) {
            list1[i]["createTime"] = util.tsFormatTime(list1[i]["createTime"], 'Y-M-D');
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
            that.setData({ hasMoreData: false });
          } else {
            //否则之后还有数据，将页数加1
            that.setData({
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
    }else{
        console.log('getList: function (options)');
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        console.log(that.data.pageLock, 'pageLock1')

        if (!that.data.pageLock) {
          // that.setData({
          //   list: that.data.list
          // })
          return;
        }
        console.log(that.data.pageLock, 'pageLock2')
        that.setData({
          pageLock: false,
        })
        console.log(that.data.pageLock, 'pageLock3')

    wx.request({
      url: urls.baseUrl + urls.myscheduleSupport,
      method: "GET",
      data: {
        page: that.data.page,
        createUserId: app.globalData.userInfo.usid,
        pageSize: 10,
        title: that.data.search
      },
      success: function (res) {

        //因为是分页加载的列表，因此需要判断，是否是第一页，是则需要将数据清空，否则将之前的列表数据赋值
        let listData = that.data.page == 1 ? [] : that.data.list;
        //接口获取数据成功，将下拉刷新的操作停止（动画停止）
        wx.stopPullDownRefresh();

        let list1 = res.data.data.list
        for (var i = 0; i < list1.length; i++) {
          list1[i]["createTime"] = util.tsFormatTime(list1[i]["createTime"], 'Y-M-D');
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
          that.setData({ hasMoreData: false });
        } else {
          //否则之后还有数据，将页数加1
          that.setData({
            hasMoreData: true,
            page: ++that.data.page
          })

          console.log(that.data.page);
        };
      },
      fail: function () {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tab = 2;
    if (options){
      tab = Number(options.tab);
    }    
    let that = this;
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
    // if (app.globalData.userInfo.roleIdList.indexOf("ZZJZ4BA6LR") == -1 && that.data.currentTab == 2) {
    //   that.setData({
    //     currentTab: 0,
    //     isImport: false
    //   })
    // };
    // let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // let res = nums.filter((num) => {
    //   return num > 5;
    // });
    //console.log(res);  // [6, 7, 8, 9, 10]

    let roleEOList = app.globalData.userInfo.roleEOList;
    console.log(roleEOList, 'roleEOList,onLoads');
    let importants = roleEOList.filter((roleEO) => {
      return roleEO.extInfo === 'PRIORITY_WORK_RECEIVER'
    });
    let important = false;
    if (importants.length > 0) {
      important = true;
    }
    let support = false;
    if (app.globalData.userInfo.extInfo3 === '1') {
      support = true;
    }
    console.log(important,'important');
    console.log(support,'support');
    let vvisible = false;
    if (tab == 1) {
      vvisible = true;
    }
    if (important && support){
      that.setData({
        visible: vvisible,
          currentTab: tab?tab:2,
        isImport: true,
        isSupport: true
      })
    } else if (!important && support) {
      that.setData({
        visible: vvisible,
        currentTab: tab ? tab : 0,
        isImport: false,
        isSupport: true
      })
    } else if (important && !support){
      that.setData({
        visible: vvisible,
        currentTab: tab ? tab : 2,
        isImport: true,
        isSupport: false
      })
    }else{
      that.setData({
        currentTab: tab ? tab : 1,
        visible: vvisible,
        isImport: false,
        isSupport: false
      })
    }


    //获取列表数据的方法
    console.log(that.data.currentTab,555555,tab)
    if (that.data.currentTab == 0) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else if (that.data.currentTab == 1){
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    } else if (that.data.currentTab == 2) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getImportList());
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let tab;
    console.log(options,'options');
    var that = this;
    
    console.log(that.data.currentTab, 'that.data.currentTab');
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
    console.log(app.globalData.userInfo,55555)
    // if (app.globalData.userInfo.roleIdList.indexOf("ZZJZ4BA6LR") == -1 && that.data.currentTab==2){
    //   that.setData({
    //     currentTab: 0,
    //     isImport:false
    //   })
    // }
    let roleEOList = app.globalData.userInfo.roleEOList;
    console.log(roleEOList, 'roleEOList,onShow');
    let importants = roleEOList.filter((roleEO) => {
      return roleEO.extInfo === 'PRIORITY_WORK_RECEIVER'
    });
    let important = false;
    if (importants.length > 0){
      important = true ;
    }
    let support = false;
    if (app.globalData.userInfo.extInfo3 === '1'){
      support = true;
    }
    console.log(important, 'important');
    console.log(support, 'support');
    if (important && support) {
      that.setData({
        currentTab: !that.data.currentTab ? 2 : that.data.currentTab,
        isImport: true,
        isSupport: true
      })
    } else if (!important && support) {
      that.setData({
        currentTab: !that.data.currentTab ? 0 : that.data.currentTab,
        isImport: false,
        isSupport: true
      })
    } else if (important && !support) {
      that.setData({
        currentTab: !that.data.currentTab ? 2 : that.data.currentTab,
        isImport: true,
        isSupport: false
      })
    } else {
      that.setData({
        visible: true,
        currentTab: !that.data.currentTab ? 0 : that.data.currentTab,
        isImport: false,
        isSupport: false
      })
    }

    //获取列表数据的方法
    if (that.data.currentTab == 0) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
    } else if (that.data.currentTab == 1){
      that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
    } else if (that.data.currentTab == 2) {
      that.setData({ hasMoreData: true, page: 1 }, () => that.getImportList());
    }
  },
  /**   * 点击tab切换   */
  swichNav: function (e) {

    var that = this;
    that.goTop();
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,

      })
    }

    if (e.target.dataset.current==0){

      that.setData({
        visible: false,
         page: 1,
      })

      wx.showLoading({
        title: '加载中',
        mask: true
      })

      this.getList(1);  //获取列表数据的方法


    } else if (e.target.dataset.current == 1){
      that.setData({
        visible: true,
         page: 1,
      })

      wx.showLoading({
        title: '加载中',
        mask: true
      })

      that.getList(2);  //获取列表数据的方法


    } else if (e.target.dataset.current == 1){
      that.setData({
        visible: false,
        page: 1,
      })

      wx.showLoading({
        title: '加载中',
        mask: true
      })

        //获取列表数据的方法

    }

  },
  bindTouchStart: function (e) {//触碰开始
    this.startTime = e.timeStamp;
    this.setData({
      startTime: e.timeStamp
    })
  },
  bindTouchEnd: function (e) {//触碰结束
    this.endTime = e.timeStamp;
    this.setData({
      endTime: e.timeStamp
    })
  },
  //长按支持时弹出删除按钮
  isDelClick:function(e){
    var that = this;
    if (that.data.currentTab == 0){
      return;
    }
    if (e.currentTarget.dataset.status !== 1 && e.currentTarget.dataset.status !== 2){
      wx.showModal({
        title: '提示',
        content: '是否要删除此请求？',
        success: function (sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            wx.request({
              url: urls.baseUrl + urls.delMeet(e.currentTarget.id),
              method: "DELETE",
              success: function (res) {
                if (res.data.respCode == 0) {
                  util.showMyToast('', '删除成功!');
                  //获取列表数据的方法
                  if (that.data.currentTab == 0) {
                    that.setData({ hasMoreData: true, page: 1 }, () => that.getList(1));
                  } else {
                    that.setData({ hasMoreData: true, page: 1 }, () => that.getList(2));
                  }
                }
              },
              complete(res) {
                wx.hideLoading();
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
            return false ;
          }
        }
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '领导已处理，不允许删除',
      })
    }
  },
  /**     * 滑动切换tab     */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
detailOnClick: function (e) {
  let that = this ;
  let nowDate = new Date();
  if ((that.endTime - that.startTime < 350) && util.throwQuickClick(nowDate,that.data._lastTime,2000)){
    console.log('nowDate - that.data._lastTime');
    that.goDetail(e,that);
  }
},
  goDetail:function(e,that){
      if (that.data.currentTab == 0) {
          wx.navigateTo({
            url: "../../pages/supprotdetail/supprotdetail?status=" + e.currentTarget.dataset.status + "&tag=2&id=" + e.currentTarget.id
          })
      } else {
          wx.navigateTo({
            url: "../../pages/supprotdetail/supprotdetail?tag=1&id=" + e.currentTarget.id
          })  
      }
    that.setData({
      _lastTime: new Date()
    }); 
  },
  collect: function (e) {
    let i = e.target.dataset.index;
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var id = e.currentTarget.id;
    var collectUrl = urls.updatescheduleSupport;
    console.log(that.data.currentTab,5454545)
    if (that.data.currentTab == 0){
      id = e.currentTarget.dataset.extinfo3;
      console.log(that.data.currentTab,11111)
      collectUrl = urls.updatescheduleMySupport;
    }
    wx.request({
      url: urls.baseUrl + collectUrl,
      method: "PUT",
      data: {
        id: id,
        collected: 1,
      },
      success: function (res) {
        if (res.data.respCode == 0) {
          var collected = "list[" + i + "].collected";

          that.setData({
            [collected]: 1
          })
          // wx.showToast({
          //     duration: 2000,
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
    var id = e.currentTarget.id;
    var collectUrl = urls.updatescheduleSupport;

    if (that.data.currentTab == 0) {
      id = e.currentTarget.dataset.extinfo3;
      collectUrl = urls.updatescheduleMySupport;
    }
    wx.request({
      url: urls.baseUrl + collectUrl,
      method: "PUT",
      data: {

        id: id,
        collected: 0,
      },
      success: function (res) {
        if (res.data.respCode == 0) {

          var collected = "list[" + i + "].collected";

          that.setData({
            [collected]: 0
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
    var id = e.currentTarget.id;
    var collectUrl = urls.updatescheduleSupport;

    if (that.data.currentTab == 0) {
      id = e.currentTarget.dataset.extinfo3;
      collectUrl = urls.updatescheduleMySupport;
    }
    wx.request({
      url: urls.baseUrl + collectUrl,
      method: "PUT",
      data: {
        id: id,
        top: 1,
      },
      success: function (res) {
        wx.hideLoading();
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
      fail(res) {
        wx.hideLoading();
      },
      complete(res) {
        // wx.hideLoading();
      }
    })

  },

  untop: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var collectUrl = urls.updatescheduleSupport;

    if (that.data.currentTab == 0) {
      id = e.currentTarget.dataset.extinfo3;
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
        top: 0,
      },
      success: function (res) {
        wx.hideLoading();
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
      fail(res) {
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
