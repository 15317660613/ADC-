//获取应用实例
const app = getApp()
import { urls } from "../../utils/urls.js";
let util = require("../../utils/util.js");
Page({
  data: {
    dailys: [null,null],
    dates: ["— —","— —"],
    leftWeek: "",
    centerWeek: "",
    rightWeek: "",
    userId : "",
    id: "",
    current: 3,
    weekNumRight: 0,
    weekNumLeft: 0,
    nowWeekIndex: 3,
    visible : false,
    left : "<",
    right : ">",
    usname : "",//
    daily:{}
  },

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

  // 表格滑动事件
  onSlideChange: function (e) {
    
  },

  // 表格滑动完成事件
  onSlideChangeEnd: function (e) {
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
  // 设置当前展示的日程
  setDaily : function (date, time,tag){
    let _this = this;
    if (this.data.id !== '' && tag!== "other") {
    wx.request({
      url:  urls.baseUrl + urls.getScheduleHour(""),
      method: "POST",
      data: {
        "scheduleDate": date,
        "scheduleHour": time,
        id: this.data.id,
        "userId": app.globalData.userInfo.usid,
         destUserId: this.data.userId
      },
      success: function (res) {
        let data = res.data.data;
        let daily = {};
        let nowDate = _this.getDateUtil(data.scheduleDate, data.scheduleHour);
        let preDate = _this.getDateUtil(data.preDate, data.preHour);
        let postDate = _this.getDateUtil(data.postDate, data.postHour);
        daily.title = nowDate.arr[0] + "/" + nowDate.arr[1] + " " + nowDate.week + " " + nowDate.time;
        daily.preTitle = preDate.arr[0] + "/" + preDate.arr[1] + " " + preDate.week + " " + preDate.time;
        daily.preYear = new Date(data.preDate).getFullYear();
        daily.postTitle = postDate.arr[0] + "/" + postDate.arr[1] + " " + postDate.week + " " + postDate.time;
        daily.time = data.scheduleHour;
        daily.postYear = new Date(data.postDate).getFullYear();
        daily.scheduleContent = data.scheduleContent === null ? "" : data.scheduleContent;
        daily.scheduleDesc = data.scheduleDesc === null ? "" : data.scheduleDesc;
        daily.scheduleDetailEOs = data.scheduleDetailEOs === null ? "" : data.scheduleDetailEOs;
        if (daily.scheduleDesc && daily.scheduleDesc!=1){
          daily.scheduleDetailEOs=[
            {
              scheduleDetail: daily.scheduleDesc,
              timeLimit:"",
            }
          ];
        }
        for (var item in daily.scheduleDetailEOs[0]) {
          if(daily.scheduleDetailEOs[0][item]){
            daily.scheduleDetailEOs[0][item] = util.htmlDecodeByRegExp(daily.scheduleDetailEOs[0][item]);
          }
        }
        _this.setData({
          daily
        });
      },
      complete : function(){
        wx.hideLoading();
      }
    });
  }else{
      wx.request({
        url: urls.baseUrl + urls.getScheduleNext,
        method: "POST",
        data: {
          "scheduleDate": date,
          "scheduleHour": time,
          "userId": app.globalData.userInfo.usid,
          destUserId: this.data.userId
        },
        success: function (res) {
          if (res.data.data){
          let data = res.data.data;
          let daily = {};
          let nowDate = _this.getDateUtil(data.scheduleDate, data.scheduleHour);
          let preDate = _this.getDateUtil(data.preDate, data.preHour);
          let postDate = _this.getDateUtil(data.postDate, data.postHour);
          daily.title =  nowDate.arr[0] + "/" + nowDate.arr[1] + " " + nowDate.week + " " + nowDate.time;
          daily.preTitle = preDate.arr[0] + "/" + preDate.arr[1] + " " + preDate.week + " " + preDate.time;
          daily.preYear = new Date(data.preDate).getFullYear();
          daily.postTitle = postDate.arr[0] + "/" + postDate.arr[1] + " " + postDate.week + " " + postDate.time;
          daily.time = data.scheduleHour;
          daily.postYear = new Date(data.postDate).getFullYear();
          daily.scheduleContent = data.scheduleContent === null ? "" : data.scheduleContent;
          daily.scheduleDesc = data.scheduleDesc === null ? "" : data.scheduleDesc;
          daily.scheduleDetailEOs = data.scheduleDetailEOs === null ? "" : data.scheduleDetailEOs;
          _this.setData({
            daily
          });
          }
        },
        complete: function () {
          wx.hideLoading();
        }
      });
  }
  },
  getDateUtil: function (date, index) {
    let dateDetail = {};
    let today = new Date(date);
    let dateArr = util.formatTime(today);
    dateDetail.arr = dateArr.split("-").splice(1, 2);
    dateDetail.time = index === "0" ? "上午" : "下午";
    dateDetail.week = util.getWeek(today);
    return dateDetail;
  },
  openModal: function (e) {

       console.log(e);
    if (e.currentTarget.id===""){
      wx.showToast({
        icon: 'none',
        title: '暂无日程可查看',
      })
        return;
    }else{
      this.setData({
        id: e.currentTarget.id
      })
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let arr = this.data.dates[this.data.current].split("-")[0].split("/");
    let time = e.currentTarget.dataset.time;
    let weeknum = e.currentTarget.dataset.weeknum;
    let year = e.currentTarget.dataset.year;
    let date = new Date(year + "-" + arr[0] + "-" + arr[1]);
    date.setDate(date.getDate() + weeknum);
    console.log(date,5555)
    this.setDaily(date, time);
    this.setData({
      visible: true,
      daily : {}
    });
  },
  beforeDaily: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let arr = this.data.daily.preTitle.split(" ")[0].split("/");
    let date = new Date(this.data.daily.preYear + "-" + arr[0] + "-" + arr[1]);
    let time = 1 - this.data.daily.time;
    this.setDaily(date,time,"other");
  },
  afterDaily: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
   
    let arr = this.data.daily.postTitle.split(" ")[0].split("/");
    let date = new Date(this.data.daily.postYear + "-" + arr[0] + "-" + arr[1]);
    let time = 1 - this.data.daily.time;
    this.setDaily(date, time,"other");
  
  },
  closeModal :function(){
    this.setData({
      visible : false
    })
  },
  onLoad: function (option) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
      mask :true
    });
    this.setData({
      userId : option.mid,
      usname : option.usname
    },function(){
      _this.getPageData(true);
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

  getPageData: function (isEnd) {
    let _this = this;
    let dailys = this.data.dailys;
    let dates = this.data.dates;
    let currentTmp = this.data.current;
    let weekNum = isEnd ? this.data.weekNumRight : ("-" + this.data.weekNumLeft);
    console.log(currentTmp,6666)
    wx.request({
      url:urls.baseUrl + urls.getPageData(_this.data.userId, weekNum),
      method: "GET",
      success: function (res) {
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
              dailys, dates,
              current: _this.data.current + 5,
              nowWeekIndex: _this.data.nowWeekIndex + 5,
            }, function () {
              // 计算新的上部日期
              _this.setTopDate();
            });
          } else {
            if(currentTmp==3){
              _this.setData({
                current: 3
             });
            }
            _this.setData({
              dailys, dates
            }, function () {
              // 计算新的上部日期
              _this.setTopDate();
            });
          }
        }
      },
      complete (res) {
        wx.hideLoading();
      }
    })
  },
})
