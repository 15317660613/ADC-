// pages/component/index/index.js
const util = require('../../../utils/util.js')
import { urls } from "../../../utils/urls.js";
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },


  attached() {
      console.log('index.js atteched')
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let that = this;
    that.getOpenId()

    if (app.globalData.saveData !== '') {
      let _this = this;
      let dailys = _this.data.dailys;
      dailys.splice(_this.data.current, 1, app.globalData.saveData);
      dailys.forEach((item) => {
        if (item) {
          _this.setLine(item);
        }
      });
      _this.setData({
        dailys
      })
      app.globalData.saveData = '';
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    dailys: [null, null],
    dates: ["— —", "— —"],
    leftWeek: "",
    centerWeek: "",
    rightWeek: "",
    pickArr: ["东丽", "西青", "出差", "休假", "无"],
    nowWeekIndex: 3,
    imgSwiper: [],
    current: 3,
    weekNumRight: 0,
    weekNumLeft: 0,
    _lastTime:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点左边一周的事件
    backStep: function () {
      if (this.data.centerWeek.content !== "— —") {
        let _this = this;
        this.setData({
          current: --_this.data.current
        }, function () {
          _this.setTopDate();
        })
      }
    },

    // 点右边一周的事件
    frontStep: function () {
      if (this.data.centerWeek.content !== "— —") {
        let _this = this;
        this.setData({
          current: ++_this.data.current
        }, function () {
          _this.setTopDate();
        })
      }
    },
    // 去创建日程详情页
    goCreateDaily: function (e) {
      let _this = this;
      let nowDate = new Date();
      if (!util.throwQuickClick(nowDate, _this.data._lastTime, 2000)) {
        return;
      }
      // let arr = _this.data.dates[_this.data.current].split("-")[0].split("/");
      var nowYear = _this.data.dailys[_this.data.current][e.currentTarget.dataset.index].year;
      var dayArr = _this.data.dailys[_this.data.current][e.currentTarget.dataset.index].day.split("-")[0].split("/");
      let date = new Date(nowYear + "-" + dayArr[0] + "-" + dayArr[1]);
      let id = e.currentTarget.dataset.id;
      let type = e.currentTarget.dataset.type;
        console.log(date)

      if (e.currentTarget.id) {
        wx.navigateTo({
          url: '../index/createDaily?type=' + type + '&date=' + date + '&scheduleHourId=' + e.currentTarget.id,
        })
      } else {
        wx.navigateTo({
          url: '../index/createDaily?type=' + type + '&date=' + date,
        })
      }
      _this.setData({
        _lastTime: new Date()
      })

    },

    // picker修改事件
    pickChange: function (e) {
      let content = "";
      let _this = this;
      // let arr = _this.data.dates[_this.data.current].split("-")[0].split("/");
      var nowYear = _this.data.dailys[_this.data.current][e.currentTarget.dataset.index].year;
      var dayArr = _this.data.dailys[_this.data.current][e.currentTarget.dataset.index].day.split("-")[0].split("/");
      let date = new Date(nowYear + "-" + dayArr[0] + "-" + dayArr[1]);
      // date.setDate(date.getDate() + (e.currentTarget.dataset.index));
      let id = e.currentTarget.dataset.id;
      let type = e.currentTarget.dataset.type;
      console.log(type)
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      switch (e.detail.value) {
        case "0":
          content = "东丽办公";
          break;
        case "1":
          content = "西青办公";
          break;
        case "2":
          wx.navigateTo({
            url: '/pages/index/selectCity?date=' + util.formatTime(date) + "&id=" + id + "&type=" + type,
          });
          wx.hideLoading();
          return;
        case "3":
          content = "休假";
          break;
        case "4":
          this.deleteDaily(e);
          return;
      }
      wx.request({
        url: urls.baseUrl + urls.saveScheduleHourUrl,
        method: "POST",
        data: {
          scheduleContent: content,
          userId: app.globalData.userInfo.usid,
          scheduleDate: date,
          scheduleHour: type,
          id: id
        },
        success(res) {
          let dailys = _this.data.dailys;
          dailys.splice(_this.data.current, 1, res.data.data.nowWeek_list);
          _this.setData({
            dailys
          })
        },
        complete(res) {
          wx.hideLoading();
        }
      })
    },

    deleteDaily: function (e) {
      let _this = this;
      let dailys = this.data.dailys;
      wx.request({
        url: urls.baseUrl + urls.deleteDailyUrl(e.currentTarget.dataset.id),
        method: 'GET',
        success: function (res) {
          if (res.data.respCode === "0") {
            switch (e.currentTarget.dataset.type) {
              case "0":
                dailys[_this.data.current][e.currentTarget.dataset.index].AM = null;
                break;
              case "1":
                dailys[_this.data.current][e.currentTarget.dataset.index].PM = null;
            }
            _this.setData({
              dailys
            });
          }
        },
        complete(res) {
          wx.hideLoading();
        }
      })
    },

    // 表格滑动事件
    onSlideChange: function (e) {

    },

    // 表格滑动完成事件
    onSlideChangeEnd: function (e) {
      console.log(e.detail)
      let _this = this;
      this.setData({
        current: e.detail.current
      }, function () {
        _this.setTopDate();
      });

      if (e.detail.current + 1 === this.data.dailys.length) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.setData({
          weekNumRight: this.data.weekNumRight + 5
        }, function () {
          _this.getPageData(true);
        })
      } else if (e.detail.current + 1 == 1) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.setData({
          weekNumLeft: this.data.weekNumLeft + 5
        }, function () {
          _this.getPageData(false);
        })
      }
    },
    onLoad: function (option) {
      console.log('index.js onload')
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      let that = this;
      that.getOpenId()

    },
    onShows: function () {
      if (app.globalData.saveData !== '') {
        let _this = this;
        let dailys = _this.data.dailys;
        dailys.splice(_this.data.current, 1, app.globalData.saveData);
        dailys.forEach((item) => {
          if (item) {
            _this.setLine(item);
          }
        });
        _this.setData({
          dailys
        })
        app.globalData.saveData = '';
      }
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
              _this.checkUserExist(openId);
              _this.setData({
                current: 3
             });
            },
            fail(res) {
              wx.hideLoading();
            }
          })
        }
      })
    },

    checkUserExist(openId) {
      let _this = this;
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
            _this.getPageData(true);
          }
        },
        fail(res) {
          wx.hideLoading();
        }
      })
    },

    // 设置上方框内容的方法
    setTopDate: function () {
      const current = this.data.current;
      const nowWeekIndex = this.data.nowWeekIndex;
      let leftWeekName = "",
        nowWeekName = "",
        rightWeekName = "",
        value = current - nowWeekIndex;
      if (value < -1) {
        leftWeekName = "前" + (-value + 1) + "周";
        nowWeekName = "前" + (-value) + "周";
        rightWeekName = "前" + (-value - 1) + "周";
      } else if (value == -1) {
        leftWeekName = "前2周";
        nowWeekName = "前1周";
        rightWeekName = "本周";
      } else if (value == 0) {
        leftWeekName = "前1周";
        nowWeekName = "本周";
        rightWeekName = "后1周"
      } else if (value == 1) {
        leftWeekName = "本周";
        nowWeekName = "后1周";
        rightWeekName = "后2周";
      } else {
        leftWeekName = "后" + (value - 1) + "周";
        nowWeekName = "后" + value + "周";
        rightWeekName = "后" + (value + 1) + "周";
      }
      const _this = this;
      this.setData({
        leftWeek: {
          content: this.data.dates[current - 1],
          name: leftWeekName
        },
        centerWeek: {
          content: this.data.dates[current],
          name: nowWeekName
        },
        rightWeek: {
          content: this.data.dates[current + 1],
          name: rightWeekName
        }
      })
    },
    setLine: function (lineData) {
      lineData.forEach((item) => {
        if (item.AM && item.AM.scheduleContent && item.AM.scheduleContent.indexOf(':') != -1) {
          item.AM.scheduleContent = item.AM.scheduleContent.replace(/:/g, '\n');
        }
        if (item.PM && item.PM.scheduleContent && item.PM.scheduleContent.indexOf(':') != -1) {
          item.PM.scheduleContent = item.PM.scheduleContent.replace(/:/g, '\n');
        }
      })
    },
    getPageData: function (isEnd) {
      let _this = this;
      let dailys = _this.data.dailys;
      let dates = _this.data.dates;
      let weekNum = isEnd ? this.data.weekNumRight : ("-" + this.data.weekNumLeft);
      wx.request({
        url: urls.baseUrl + urls.getPageData(app.globalData.userInfo.usid, weekNum),
        method: "GET",
        success: function (res) {
          console.log(res)
          if (res.data.respCode == "0") {
            const data = res.data.data;
            // 日报表格数据插入位置
            const dailyPosition = isEnd ? dailys.length - 1 : 1;
            // 日期数据插入位置
            const datePosition = isEnd ? dates.length - 1 : 1;
            //判断为出差时替换为换行
            _this.setLine(data.next2_list);
            _this.setLine(data.next1_list);
            _this.setLine(data.nowWeek_list);
            _this.setLine(data.before1_list);
            _this.setLine(data.before2_list);
            // 插入对应的日期和日报
            dailys.splice(dailyPosition, 0, data.next2_list);
            dailys.splice(dailyPosition, 0, data.next1_list);
            dailys.splice(dailyPosition, 0, data.nowWeek_list);
            dailys.splice(dailyPosition, 0, data.before1_list);
            dailys.splice(dailyPosition, 0, data.before2_list);
            dates.splice(datePosition, 0, data.next2);
            dates.splice(datePosition, 0, data.next1);
            dates.splice(datePosition, 0, data.nowWeek);
            dates.splice(datePosition, 0, data.before1);
            dates.splice(datePosition, 0, data.before2);
            // 如果是在昨天插入，多执行一步修改current，由于会有动画滑动效果
            // 因此只能把current的修改和数据的修改放到一起，故分两步
            if (!isEnd) {
              _this.setData({
                dailys,
                dates,
                current: _this.data.current + 5,
                nowWeekIndex: _this.data.nowWeekIndex + 5,
                // scheduleDesc:
              }, function () {
                // 计算新的上部日期
                _this.setTopDate();
              });
            } else {
              _this.setData({
                dailys,
                dates
              }, function () {
                // 计算新的上部日期
                _this.setTopDate();
              });
            }
          }
        },
        complete(res) {
          wx.hideLoading();
        }
      })
    },
  }
})
