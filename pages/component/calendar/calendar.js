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
    currMonthIndex: null, //月份索引
    calendarHeight: 600,
    journeyHeight: 600,
    dayList: [
      [],
      [],
      []
    ], //月份
    dataList: [], //数据
    currentPage: null, //日程索引
    tempImagePath: '',
    select: "", //选中日期
    userId: '',
    flag1: false, //行程显示隐藏
    year: "",
    month: "",
    day: "",
    today: '', //日历当前年月日，今日
    currentUserId: '', //当前登录人id
    dotsList: 0, //每日行程数
    endX: 0,
    endY: 0,
    startX: 0,
    startY: 0,
    swiper: false, //滑动日程标识
    count_n: 0, //滑动次数标识
    todayselect: false, //选择今天标志如果是今天日子不默认1号
    windowHeight: null, //获取设备窗口高度,
    week: null,
    ecurrent: null,
    tmonth: null,
    tday: null
  },
  ready: function () {
    this.toDate()
    this.setData({
      currentUserId: app.globalData.userInfo.usid,
      windowHeight: (wx.getSystemInfoSync().windowHeight - wx.getSystemInfoSync().statusBarHeight - 120) * 2
    })
  },
  onLoad: function () {
    this.toDate()
  },
  /**
   * 组件的方法列表
   */

  methods: {
    toUpper: function (week) {
      switch (week) {
        case 0:
          return '日';
          break;
        case 1:
          return '一';
          break;
        case 2:
          return '二';
          break;
        case 3:
          return '三';
          break;
        case 4:
          return '四';
          break;
        case 5:
          return '五';
          break;
        case 6:
          return '六';
      }
    },
    onShows: function () {
      if (app.globalData.saveData !== '') {
        let that = this;
        let date = app.globalData.saveData;
        console.log(app.globalData.saveData)
        let year, month, day;
        year = new Date(date).getFullYear(),
          month = new Date(date).getMonth() + 1,
          day = new Date(date).getDate();
        let days = new Date(year, month, 0).getDate();
        this.getSelectedData(year + '-' + month + '-' + 1, year + '-' + month + '-' + days) //当天
        this.setData({
          currentPage: day - 1
        })
        app.globalData.saveData = '';
      }
    },
    calendarchanger: function (e) {},
    //查询日程
    getSelectedData: function (starttime, endtime) {
      let that = this;
      wx.request({
        url: urls.baseUrl + urls.getPersonData,
        method: "POST",
        data: {
          researchUserId: app.globalData.userInfo.usid,
          createUserId: app.globalData.userInfo.usid,
          scheduleBeginDate: starttime,
          scheduleEndDate: endtime
        },
        success(res) {
          res.data.data.map((item, index) => {
            item.scheduleDate = new Date(item.scheduleDate).getFullYear() + '-' + (new Date(item.scheduleDate).getMonth() + 1) + '-' + new Date(item.scheduleDate).getDate()
            item.week = that.toUpper(new Date(item.scheduleDate).getDay())
            item.month = (new Date(item.scheduleDate).getMonth() + 1)
            item.day = new Date(item.scheduleDate).getDate()
            
            if(item.scheduleDetailEOList.length!=0){
              item.scheduleDetailEOList.map(item => {
                item.extInfo1 = item.extInfo1.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/&amp;/g, "&");
                item.scheduleDetail = item.scheduleDetail.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/&amp;/g, "&");
              })
            }
          })

          that.data.dayList[that.data.currMonthIndex].days.map((item, index) => {
            res.data.data.forEach((val, i) => {
              if (item.day === (i + 1)) {
                item.scheduleDetailEOList = val.scheduleDetailEOList
              }
            })
          })
          that.setData({
            dataList: res.data.data,
            dayList: that.data.dayList,
          })
          // setTimeout(function(){
          if (that.data.dataList[that.data.currentPage].scheduleDetailEOList && that.data.dataList[that.data.currentPage].scheduleDetailEOList.length > 1) {
            let i = 0;
            that.data.dataList[that.data.currentPage].scheduleDetailEOList.forEach((item, index) => {
              if (item.scheduleDetail !== null) {
                item.scheduleDetail = item.scheduleDetail.replace(/\n/g, "<br/>")
                i = i + that.getStrCount(item.scheduleDetail, "<br/>")
                if (item.scheduleDetail.length > 20) {
                  i++;
                }
              }
            })
            that.setData({
              journeyHeight: ((that.data.dataList[that.data.currentPage].scheduleDetailEOList.length) * 176) + 280 + i * 40
            })
          } else {
            if (wx.getSystemInfoSync().windowHeight > 600) {
              that.setData({
                // journeyHeight:that.data.windowHeight - that.data.calendarHeight
                journeyHeight: wx.getSystemInfoSync().windowHeight * 1.5 - that.data.calendarHeight
              })
            } else {
              that.setData({
                journeyHeight: (that.data.windowHeight - that.data.calendarHeight) * 2
                // journeyHeight: 400
              })
            }
          }
          // },1000)
        },
        complete(res) {
          // wx.hideLoading();
        }
      })
      this.getWeek()
    },
    detailTap: function (event) {
      let year = event.currentTarget.dataset.date.split('-')[0];
      let month = event.currentTarget.dataset.date.split('-')[1];
      let day = event.currentTarget.dataset.date.split('-')[2];
      let that = this;
      wx.navigateTo({
        url: '../index/createDaily?type=' + '' + '&date=' + new Date(year, month - 1, day) + '&scheduleHourId=' + event.currentTarget.dataset.id,
      })
    },
    addJourney: function (event) {
      let that = this;
      let year = event.currentTarget.dataset.date.split('-')[0];
      let month = event.currentTarget.dataset.date.split('-')[1];
      let day = event.currentTarget.dataset.date.split('-')[2];
      if (event.currentTarget.dataset.id === null) {
        wx.navigateTo({
          url: '../index/createDaily?type=' + '' + '&date=' + new Date(year, month - 1, day),
        })
      } else {
        wx.navigateTo({
          url: '../index/createDaily?type=' + '' + '&date=' + new Date(year, month - 1, day) + '&scheduleHourId=' + event.currentTarget.dataset.id,
        })
      }
      // let that = this;
      //   wx.navigateTo({
      //       url: '../index/createDaily?type='+'' + '&date=' + new Date(that.data.year+'-'+that.data.month+'-'+that.data.day),
      //     })
    },
    dianji: function (e) {
      let month = this.data.month;
      let year = this.data.year;
      let day = e.currentTarget.dataset['day']
      if (e.currentTarget.dataset['day'] !== '') {
        this.setData({
          select: year + '-' + month + '-' + day,
          year: year,
          month: month,
          day: day,
          currentPage: day - 1,
          dian: 1,
          clickNum: day,
        })
      }

      this.getWeek()
    },
    // 获取今日数据
    toDate() {
      this.todayDate()
      setTimeout(() => {
        this.todayDate()
      }, 400)
    },
    todayDate() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let days = new Date(year, month, 0).getDate();

      this.setData({
        year,
        month,
        day,
        dateTip: year + '年' + (month) + '月',
        currentPage: day - 1,
        todayselect: true
      })
      this.setData({
        currMonthIndex: month - 1,
      })
      for (let i = 1; i <= 12; i++) {
        this.monthDataCalc(year, i)
      }
      this.setData({
        select: year + '-' + month + '-' + day,
        today: year + '-' + month + '-' + day
      })
      this.getSelectedData(year + '-' + month + '-' + 1, year + '-' + month + '-' + days) //当天
      if (this.data.dayList[month - 1].days.length > 35) {
        this.setData({
          calendarHeight: 600
        })
      } else if (this.data.dayList[month - 1].days.length < 28) {
        this.setData({
          calendarHeight: 400
        })
      } else {
        this.setData({
          calendarHeight: 500
        })
      }
      this.getWeek(true)
      return
    },
    // 获取月份的数据
    monthDataCalc(year, month) {
      // 总天数
      let date = new Date(year, month, 0)
      let days = date.getDate()
      let whichDay
      // 第一天星期几
      if (month - 1 < 1) {
        whichDay = new Date(year - 1, 12, 1).getDay() === 0 ? 7 : new Date(year - 1, 12, 1).getDay()
      } else {
        whichDay = new Date(year, month - 1, 1).getDay() === 0 ? 7 : new Date(year, month - 1, 1).getDay()
      }

      //  whichDay === 0? 6:whichDay
      let dayList = this.data.dayList
      let dayListItem = {
        days: [],
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
      // 补空

      for (let j = 0; j < whichDay - 1; j++) {
        let obj = {
          'day': ''
        };
        dayListItem.days.push(obj)
      }

      for (let i = 1; i <= days; i++) {
        let obj = {
          'day': i
        }
        dayListItem.days.push(obj)
      }
      dayList[month - 1] = dayListItem
      this.setData({
        dayList
      })
      this.getWeek()
    },
    // 月份切换
    monthSwiper(e, index) {
      let flag = e.currentTarget.dataset.flag || index
      let {
        currMonthIndex
      } = this.data
      let thisMonth = this.data.dayList[currMonthIndex]
      let {
        year,
        month
      } = thisMonth
      let days = new Date(year, month, 0).getDate();
      let currentPage = this.data.currentPage
      if (flag === '0') {
        let that = this;
        currMonthIndex = currMonthIndex - 1 < 0 ? 11 : currMonthIndex - 1;
        this.getSelectedData(year + '-' + (month - 1) + '-' + 1, year + '-' + (month - 1) + '-' + days)
        this.setData({
          currentPage: 0
        })
        if (currMonthIndex === 11) {
          for (let i = 1; i <= 12; i++) {
            that.monthDataCalc(that.data.year - 1, i)
          }
          that.setData({
            year: that.data.year - 1,
            month: 12,
            dateTip: (that.data.year - 1) + '年' + 12 + '月'
          })
        }
      } else {
        let that = this;
        currMonthIndex = currMonthIndex + 1 > 11 ? 0 : currMonthIndex + 1
        this.getSelectedData(year + '-' + (month + 1) + '-' + 1, year + '-' + (month + 1) + '-' + days)
        this.setData({
          currentPage: 0
        })
        if (currMonthIndex === 0) {
          for (let i = 1; i <= 12; i++) {
            that.monthDataCalc(that.data.year + 1, i)
          }
          that.setData({
            year: that.data.year - 1,
            month: 1,
            dateTip: (that.data.year + 1) + '年' + 1 + '月'
          })
        }
      }
      this.setData({
        currMonthIndex,
        year: year,
        month: (parseInt(month) + 1),
        day: 1,
        select: year + '-' + (parseInt(month) + 1) + '-' + 1
      })
      this.getWeek()
    },
    //日程切换
    dataSwiper(e) {
      // this.onShows()
      // this.data.ecurrent = e.detail.current
      // if (e.detail.current !== this.data.ecurrent) {}
      let that = this;
      let days = new Date(that.data.year, that.data.month, 0).getDate() - 1;
      if (e.detail.source) {
        if (e.detail.source === 'touch') {
          let arrows;
          if ((that.data.currentPage < e.detail.current) || (that.data.currentPage === days && e.detail.current === 0)) {
            arrows = 'left'
            // left 27 28 27 30 28 true false true
            if (this.data.day == 1) {
              if (that.data.currentPage == 29 && e.detail.current == 30 && days == 30) {
                arrows = 'right'
              }
            }
            // right 0 30 0 30 30 true false true
            if (this.data.month == 3 && e.detail.current - that.data.currentPage != 1) {
              if (e.detail.current == days) {
                arrows = 'right'
              }
            }
            // left 29 30 29 30 30 true false true
            if (days == e.detail.current && that.data.currentPage == days) {
              arrows = 'right'
            }
            if (that.data.currentPage >= days && e.detail.current != 0) {
              arrows = 'right'
            }
            if (e.detail.current == days && that.data.currentPage == 0) {
              arrows = 'right'
            }
          } else {
            arrows = 'right'
            // right 29 0 29 30 0 false false false
            if (e.detail.current >= days - 1 && that.data.currentPage == 0) {
              arrows = 'left'
            } else if (e.detail.current == 1 && that.data.currentPage >= days) {
              arrows = 'left'
            } else if (that.data.currentPage == days - 1 && e.detail.current == 1) {
              arrows = 'left'
            } else if (that.data.currentPage >= days - 1 && e.detail.current == 0) {
              arrows = 'left'
            }
            // right 2 0 2 28 0 false false false
            if (this.data.month == 3 && e.detail.current - that.data.currentPage != 1) {
              if (that.data.currentPage == 0) {
                arrows = 'left'
              }
            }
            // right 28 0 28 30 0 false false false
          }
          console.log(arrows, that.data.currentPage, e.detail.current, that.data.currentPage, days, e.detail.current, that.data.currentPage < e.detail.current, that.data.currentPage === days && e.detail.current === 0, (that.data.currentPage < e.detail.current) || (that.data.currentPage === days && e.detail.current === 0))
          if (e.detail.current === 0 && arrows === 'left') { //判断左滑并且滑到12月份之后的操作
            let nextmonth;
            let nextyear;
            if (parseInt(that.data.month) + 1 > 12) {
              nextyear = parseInt(that.data.year) + 1
              nextmonth = 1
            } else {
              nextyear = parseInt(that.data.year)
              nextmonth = parseInt(that.data.month) + 1
            }
            let days = new Date(nextyear, nextmonth, 0).getDate();
            that.getSelectedData(nextyear + '-' + nextmonth + '-' + 1, nextyear + '-' + nextmonth + '-' + days) //当天
            if (that.data.currMonthIndex + 1 > 11) {
              for (let i = 1; i <= 12; i++) {
                that.monthDataCalc(nextyear, i)
              }
            }
            let index = that.data.currMonthIndex + 1 > 11 ? 0 : that.data.currMonthIndex + 1
            that.setData({
              currMonthIndex: index,
              month: nextmonth,
              day: 1,
              select: nextyear + '-' + nextmonth + '-' + 1
            })
            return false;
          } else if ((e.detail.current === (this.data.dataList.length - 1)) && arrows === 'right') { //判断右滑并且滑到1月份之后的操作
            let prevmonth;
            let prevyear
            if (parseInt(that.data.month) - 1 < 1) {
              prevyear = parseInt(that.data.year) - 1
              prevmonth = 12
            } else {
              prevyear = that.data.year
              prevmonth = parseInt(that.data.month) - 1
            }
            let days = new Date(prevyear, prevmonth, 0).getDate();
            that.getSelectedData(prevyear + '-' + prevmonth + '-' + 1, prevyear + '-' + prevmonth + '-' + days) //当天
            if (that.data.currMonthIndex - 1 < 0) {
              for (let i = 1; i <= 12; i++) {
                that.monthDataCalc(prevyear, i)
              }
            }
            let index = that.data.currMonthIndex - 1 < 0 ? 11 : that.data.currMonthIndex - 1
            that.setData({
              currMonthIndex: index,
              month: prevmonth,
              day: days,
              select: prevyear + '-' + prevmonth + '-' + days,
              swiper: true,
              currentPage: days - 1,
              // currentPage:0
            })
            return false;
          } else {
            that.setData({
              currentPage: e.detail.current,
              select: that.data.year + '-' + that.data.month + '-' + (e.detail.current + 1),
              day: (e.detail.current + 1)
            })
            if (that.data.dataList[that.data.currentPage].scheduleDetailEOList && that.data.dataList[that.data.currentPage].scheduleDetailEOList.length > 1) {
              let i = 0;
              that.data.dataList[that.data.currentPage].scheduleDetailEOList.forEach((item, index) => {
                if (item.scheduleDetail !== null) {
                  item.scheduleDetail = item.scheduleDetail.replace(/\n/g, "<br/>")
                  i = i + that.getStrCount(item.scheduleDetail, "<br/>")
                  if (item.scheduleDetail.length > 20) {
                    i++;
                  }
                }
              })
              that.setData({
                journeyHeight: ((that.data.dataList[that.data.currentPage].scheduleDetailEOList.length) * 176) + 280 + i * 40
              })
            } else {
              if (wx.getSystemInfoSync().windowHeight > 600) {
                that.setData({
                  // journeyHeight:that.data.windowHeight - that.data.calendarHeight
                  journeyHeight: wx.getSystemInfoSync().windowHeight * 1.5 - that.data.calendarHeight
                })
              } else {
                that.setData({
                  journeyHeight: (that.data.windowHeight - that.data.calendarHeight) * 2
                  // journeyHeight: 400
                })
              }
            }
          }
        }
      } else {
        this.setData({
          currentPage: this.data.day - 1,
          select: this.data.year + '-' + this.data.month + '-' + (this.data.day),
        })
        try {
          if (that.data.dataList[that.data.currentPage].scheduleDetailEOList && that.data.dataList[that.data.currentPage].scheduleDetailEOList.length > 0) {
            let i = 0;
            that.data.dataList[that.data.currentPage].scheduleDetailEOList.forEach((item, index) => {
              if (item.scheduleDetail !== null) {
                item.scheduleDetail = item.scheduleDetail.replace(/\n/g, "<br/>")
                i = i + that.getStrCount(item.scheduleDetail, "<br/>")
                if (item.scheduleDetail.length > 20) {
                  i++;
                }
              }
            })
            that.setData({
              journeyHeight: ((that.data.dataList[that.data.currentPage].scheduleDetailEOList.length) * 176) + 280 + i * 40
            })
          } else {
            if (wx.getSystemInfoSync().windowHeight > 600) {
              that.setData({
                // journeyHeight:that.data.windowHeight - that.data.calendarHeight
                journeyHeight: wx.getSystemInfoSync().windowHeight * 1.5 - that.data.calendarHeight
              })
            } else {
              that.setData({
                journeyHeight: (that.data.windowHeight - that.data.calendarHeight) * 2
                // journeyHeight: 400
              })
            }
          }
        } catch (err) {
          console.log(err, 'err')
        }
      }
      this.data.ecurrent = e.detail.current
      this.getWeek()
    },
    getStrCount(aStr, aChar) { // 判断字符串包含某个字符次数
      var regex = new RegExp(aChar, 'g'); // 使用g表示整个字符串都要匹配
      var result = aStr.match(regex);
      var count = !result ? 0 : result.length;
      return count;
    },
    // 月份切换
    calendarSwiper(e) {
      let that = this;
      let currMonthIndex = e.detail.current
      let thisMonth = this.data.dayList[currMonthIndex]
      let {
        year,
        month
      } = thisMonth
      let otheryear = year;
      let othermonth = month;
      let day = new Date(year, month, 0).getDate();
      if (this.data.dayList[month - 1].days.length > 35) {
        this.setData({
          calendarHeight: 600
        })
        this.setData({
          dateTip: year + '年' + (month) + '月'
        })
      } else if (this.data.dayList[month - 1].days.length < 29) {
        this.setData({
          calendarHeight: 400
        })
        this.setData({
          dateTip: year + '年' + (month) + '月'
        })
      } else {
        this.setData({
          calendarHeight: 500
        })
        this.setData({
          dateTip: year + '年' + (month) + '月'
        })
      }

      //判断是滑动月历本身切换下方日程
      if (e.detail.source === 'touch') {
        let that = this;
        let arrow; //判断左滑右滑
        if ((that.data.currMonthIndex < e.detail.current && that.data.currMonthIndex !== 0) || (that.data.currMonthIndex === 11 && e.detail.current === 0)) {
          arrow = 'left'
        } else {
          arrow = 'right'
        }
        if (currMonthIndex === 11 && arrow === 'right') {
          otheryear = year - 1
          othermonth = 12
          this.setData({
            select: (year - 1) + '-' + 12 + '-' + 1,
          })
          for (let i = 1; i <= 12; i++) {
            that.monthDataCalc(year - 1, i)
          }
          that.getSelectedData((year - 1) + '-' + 12 + '-' + 1, (year - 1) + '-' + 12 + '-' + 31) //当天
          that.setData({
            year: year - 1,
            month: 12,
            dateTip: (year - 1) + '年' + 12 + '月',
            currMonthIndex: 11,
            currentPage: 0,
            day: 1
          })

          //  this.setData({ year:(year-1),month:month,day:1 })
          if (this.data.dayList[month - 1].days.length > 35) {
            this.setData({
              calendarHeight: 600
            })
            this.setData({
              dateTip: (year - 1) + '年' + (month) + '月'
            })
          } else if (this.data.dayList[month - 1].days.length < 29) {
            this.setData({
              calendarHeight: 400
            })
            this.setData({
              dateTip: (year - 1) + '年' + (month) + '月'
            })
          } else {
            this.setData({
              calendarHeight: 500
            })
            this.setData({
              dateTip: (year - 1) + '年' + (month) + '月'
            })
          }
        } else if (currMonthIndex === 0 && arrow === 'left') {
          otheryear = year + 1;
          othermonth = 1
          this.setData({
            select: (year + 1) + '-' + 1 + '-' + 1,
          })
          for (let i = 1; i <= 12; i++) {
            that.monthDataCalc(year + 1, i)
          }

          that.getSelectedData((year + 1) + '-' + 1 + '-' + 1, (year + 1) + '-' + 1 + '-' + 31) //当天
          that.setData({
            year: year + 1,
            month: 1,
            dateTip: (year + 1) + '年' + 1 + '月',
            currMonthIndex: 0,
            day: 1,
            currentPage: 0
          })
          // this.setData({,year:(year+1),month:month,day:1 })
          if (this.data.dayList[month - 1].days.length > 35) {
            this.setData({
              calendarHeight: 600
            })
            this.setData({
              dateTip: (year + 1) + '年' + (month) + '月'
            })
          } else if (this.data.dayList[month - 1].days.length < 29) {
            this.setData({
              calendarHeight: 400
            })
            this.setData({
              dateTip: (year + 1) + '年' + (month) + '月'
            })
          } else {
            this.setData({
              calendarHeight: 500
            })
            this.setData({
              dateTip: (year + 1) + '年' + (month) + '月'
            })
          }
        } else {
          this.getSelectedData(year + '-' + month + '-' + 1, year + '-' + month + '-' + day) //当天
          this.setData({
            currMonthIndex,
            currentPage: 0,
            year: year,
            month: month,
            day: day
          })
        }

      }

      //判断是滑日程导致月份切换
      if (this.data.swiper) {
        this.getSelectedData(year + '-' + month + '-' + 1, year + '-' + month + '-' + this.data.day) //当天
        this.setData({
          month: month,
          year: year,
          day: this.data.day,
          select: year + '-' + month + '-' + this.data.day,
          swiper: false
        })
      } else {
        if (that.data.todayselect) {
          this.setData({
            month: month,
            year: year,
            day: 1,
            select: year + '-' + month + '-' + this.data.day,
            todayselect: false
          })
        } else {
          this.setData({
            month: othermonth,
            year: otheryear,
            day: 1,
            select: otheryear + '-' + othermonth + '-' + 1
          })
        }
      }
      console.log(this.data.year, this.data.month, this.data.day)
      // this.todayDate()
      this.getWeek()
    },
    getWeek() {
      // var s = this.data.year + '-' + this.data.month + '-' + this.data.day
      // this.data.week = "周" + "日一二三四五六".charAt(new Date(s).getDay())
      this.setData({
        week: "周" + "日一二三四五六".charAt(new Date(this.data.year, this.data.month - 1, this.data.day).getDay())
      })
      // console.log(this.data.year, this.data.month, this.data.day)

      // return ;
    }
  }
})