// pages/createrequest/createrequest.js
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
    old_focus: false,
    old_focus_value: "",
    confirm_focus: false,
    confirm_focus_value: "",
    detail:'',
    persons:[],
    multiIndex: [0, 0, 0, 0, 0, 0],
    index: 0,
    multiArray: [],
    year: "",
    month: "",
    day: "",
    startHour: "",
    endHour: "",
    orderData: "点击选择参加时间",
    visible: false,
    chooseContent:"",
    name:"点击添加接收人",
    lock:true,
    currentReceiveUserId:''
  },


  // 获取详情的值
  bindEquipment: function (e) {

    console.log(e)
    var value = e.detail.value;
    this.setData({//更新备注内容
      detail: value
    }),
      console.log(value,'bindEquipment')

  },

  oldonInputEvent: function (e) {
    this.setData({
      old_focus_value: e.detail.value

    });
},
  confirmonInputEvent: function (e) {
    this.setData({
      confirm_focus_value: e.detail.value
    });
  },
  listenerRadioGroup: function (e) {
    var that = this;

    if (e.detail){
      let value = e.detail.value;
      console.log(value, 'listenerRadioGroup');
      that.setData({
        chooseContent: value,
        chooseName: e.detail.value.split(':')[1],
        currentReceiveUserId: e.detail.value.split(':')[0]
      })
      console.log(that.data.chooseName,'that.data.chooseName');
    }

  },



  //月份计算
  surplusMonth: function (year) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var monthDatas = [];
    if (year == year2) {
      var surplusMonth = 12 - month;
      monthDatas.push(month + "月")
      for (var i = month; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    } else {
      for (var i = 0; i < 12; i++) {
        monthDatas.push(i + 1 + "月")
      }
    }

    return monthDatas;
  },
  //天数计算
  surplusDay: function (year, month, day) {
    var days = 31;
    var dayDatas = [];
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1

    switch (parseInt(month)) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        days = 31;

        break;
      //对于2月份需要判断是否为闰年
      case 2:
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
          days = 29;

          break;
        } else {
          days = 28;

          break;
        }

      case 4:
      case 6:
      case 9:
      case 11:
        days = 30;

        break;

    }
    if (year == year2 && month == month2) {
      dayDatas.push(day + "日")
      for (var i = day; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    } else {
      console.log(month + "月" + days + "天")
      for (var i = 0; i < days; i++) {
        dayDatas.push(i + 1 + "日")
      }
    }
    return dayDatas;
  },
  //时间计算
  surplusHour: function (year, month, day, hour) {
    var date = new Date();
    var year2 = date.getFullYear()
    var month2 = date.getMonth() + 1
    var day2 = date.getDate();
    var hourEnd = ['00:00时', '00:30时', '01:00时', '01:30时', '02:00时', '02:30时', '03:00时', '03:30时', '04:00时', '04:30时', '05:00时', '05:30时', '06:00时', '06:30时', '07:00时', '07:30时', '08:00时', '08:30时', '09:00时', '09:30时', '10:00时', '10:30时', '11:00时', '11:30时', '12:00时', '12:30时', '13:00时', '13:30时', '14:00时', '14:30时', '15:00时', '15:30时', '16:00时', '16:30时', '17:00时', '17:30时', '18:00时', '18:30时', '19:00时', '19:30时', '20:00时', '20:30时', '21:00时', '21:30时', '22:00时', '22:30时', '23:00时', '23:30时', '24:00时'];
    var hours = [['00:00时', '00:30时', '01:00时', '01:30时', '02:00时', '02:30时', '03:00时', '03:30时', '04:00时', '04:30时', '05:00时', '05:30时', '06:00时', '06:30时', '07:00时', '07:30时', '08:00时', '08:30时', '09:00时', '09:30时', '10:00时', '10:30时', '11:00时', '11:30时', '12:00时', '12:30时', '13:00时', '13:30时', '14:00时', '14:30时', '15:00时', '15:30时', '16:00时', '16:30时', '17:00时', '17:30时', '18:00时', '18:30时', '19:00时', '19:30时', '20:00时', '20:30时', '21:00时', '21:30时', '22:00时', '22:30时', '23:00时', '23:30时', '24:00时'], ['00:00时', '00:30时', '01:00时', '01:30时', '02:00时', '02:30时', '03:00时', '03:30时', '04:00时', '04:30时', '05:00时', '05:30时', '06:00时', '06:30时', '07:00时', '07:30时', '08:00时', '08:30时', '09:00时', '09:30时', '10:00时', '10:30时', '11:00时', '11:30时', '12:00时', '12:30时', '13:00时', '13:30时', '14:00时', '14:30时', '15:00时', '15:30时', '16:00时', '16:30时', '17:00时', '17:30时', '18:00时', '18:30时', '19:00时', '19:30时', '20:00时', '20:30时', '21:00时', '21:30时', '22:00时', '22:30时', '23:00时', '23:30时', '24:00时']];

    if (year == year2 && month == month2 && day == day2) {
      var hour2 = hour
      var j = 0;
      for (var i = 0; i < hourEnd.length; i++) {
        console.log("离24点还" + (hourEnd[i] - hour))
        if ((hourEnd[i] - hour) > 0) {
          console.log("i" + i)
          j = i;
          break;
        }
      }
      var surplusHours = [[], []];
      for (var i = j; i < hours[0].length; i++) {
        console.log(hours[0][i])
        surplusHours[0].push(hours[0][i]);
      }
      for (var i = j; i < hours[1].length; i++) {
        console.log(hours[1][i])
        surplusHours[1].push(hours[1][i]);
      }

      hours = surplusHours;
    }
    return hours;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getList();  //获取列表数据的方法
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()


    var surplusMonth = this.surplusMonth(year);
    console.log(surplusMonth)
    var surplusDay = this.surplusDay(year, month, day);
    console.log(surplusDay)
    var surplusHour = this.surplusHour(year, month, day, hour)
    console.log(surplusHour)

    this.setData({
      multiArray: [[year + '年', (year + 1) + '年', (year + 2) + '年'],
        surplusMonth,
        surplusDay,
      surplusHour[0],
      ['-'],
      surplusHour[1]
      ],

      year: year,
      month: month,
      day: day,
      startHour: surplusHour[0][0],
      endHour: surplusHour[1][0],
    })
  },
  varietiesChange: function (e) {
    var Varieties = this.data.array[parseInt(e.detail.value)]
    console.log(Varieties)
    this.setData({
      Varieties: Varieties
    })
  },
  warehouseChange: function (e) {
    var Warehouse = this.data.array[parseInt(e.detail.value)]
    console.log(Warehouse)
    this.setData({
      Warehouse: Warehouse
    })
  },

  addPerson: function (e) {
    console.log(this.data.chooseContent,'addPerson');
  
    this.setData({
      visible: true
    })

  },
 // chooseContent :"",
      // currentReceiveUserId:"",
      // name: '点击添加接收人'
  closeModal: function () {
    console.log( 'closeModal');
    this.setData({
      visible: false,
    })
  },

  submit2: function () {
    var that = this;
   if (that.data.chooseContent === "") {
      wx.showToast({
        icon: 'none',
        title: '请选择接收人',
      })
      return;
    }
    if (that.data.chooseContent.split(":")[0] === app.globalData.userInfo.usid){
      wx.showToast({
        icon: 'none',
        title: '接收人不能选择自己',
      })
      return;
    }
    console.log(that.data.chooseContent, 5555, app.globalData)
    this.setData({
      visible: false,
      name: that.data.chooseContent.split(":")[1]

    })
  },
  //某一列的值改变时触发
  bindMultiPickerColumnChange: function (e) {
    var date = new Date();
    var year1 = date.getFullYear()
    var month1 = date.getMonth() + 1
    var day1 = date.getDate()
    var hour1 = date.getHours()
    console.log("当前年份" + this.data.month + '修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
      startHour: this.data.startHour,
      endHour: this.data.startHour,
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        var yearStr = data.multiArray[e.detail.column][e.detail.value];
        var year = yearStr.substring(0, yearStr.length - 1)
        data.year = parseInt(year);
        var surplusMonth = this.surplusMonth(year);
        data.multiArray[1] = surplusMonth;

        if (data.year == year1) {
          data.month = month1;
        } else {
          data.month = 1;
        }
        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        var surplusDay = this.surplusDay(data.year, data.month, data.day);

        data.multiArray[2] = surplusDay;
        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }

        console.log(surplusHour)

        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];


        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];

        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      case 1:
        console.log('选择月份' + data.multiArray[e.detail.column][e.detail.value]);

        var monthStr = data.multiArray[e.detail.column][e.detail.value];
        var month = monthStr.substring(0, monthStr.length - 1);

        data.month = month;
        data.day = 1;

        if (data.year == year1 && month1 == data.month) {
          data.day = day1;
        } else {
          data.day = 1;
        }

        var surplusDay = this.surplusDay(data.year, data.month, data.day);

        data.multiArray[2] = surplusDay;

        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }


        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];


        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      case 2:
        console.log('选择日' + data.multiArray[e.detail.column][e.detail.value]);
        var dayStr = data.multiArray[e.detail.column][e.detail.value];
        var day = dayStr.substring(0, dayStr.length - 1);
        data.day = day;

        var surplusHour;
        if (data.year == year1 && month1 == data.month && data.day == day1) {
          surplusHour = this.surplusHour(data.year, data.month, data.day, hour1)
        } else {
          surplusHour = this.surplusHour(data.year, data.month, data.day, 1)
        }


        data.multiArray[3] = surplusHour[0];
        data.multiArray[5] = surplusHour[1];



        data.startHour = surplusHour[0];
        data.endHour = surplusHour[1];

        data.multiIndex[3] = 0;
        data.multiIndex[5] = 0;
        break;
      // case 3:
      //   console.log('起始时间' + data.multiArray[e.detail.column][e.detail.value]);

      //   var hourStr = data.multiArray[e.detail.column][e.detail.value];
      //   var hour = hourStr.substring(0, hourStr.length - 1);
      //   data.startHour = hour;
      //   console.log('起始时间' + hour);
      //   var endhours2 = [];
      //   if (data.year == year1 && data.month == month1 && data.day == day1) {
      //    // var surplusHour = this.surplusHour(data.year, data.month, data.day, hour);
      //     endhours2 = surplusHour[1]
      //   } else {
      //     // var end = ['04时', '08时', '12时', '16时', '20时', '24时'];
      //     // for (var i = e.detail.value; i < end.length; i++) {
      //     //   endhours2.push(end[i]);
      //     // }
      //   }


      //   data.multiArray[5] = endhours2;
      //   data.multiIndex[5] = 0;

      //   break;
      case 5:
        // var hourStr = data.multiArray[e.detail.column][e.detail.value];
        // var hour = hourStr.substring(0, hourStr.length - 1);
        // data.endHour = hour;
        // console.log('结束时间' + data.multiArray[e.detail.column][e.detail.value]);
        // break;
    }
    this.setData(data)

  },
  //value 改变时触发 change 事件
  bindMultiPickerChange: function (e) {



    var dateStr =
      this.data.multiArray[0][this.data.multiIndex[0]] +
      this.data.multiArray[1][this.data.multiIndex[1]] +
      this.data.multiArray[2][this.data.multiIndex[2]] +
      this.data.multiArray[3][this.data.multiIndex[3]] +
   "-" +
      this.data.multiArray[5][this.data.multiIndex[5]];


    if ((parseInt(this.data.multiArray[3][this.data.multiIndex[3]].split(":")[0]) * 60 + parseInt(this.data.multiArray[3][this.data.multiIndex[3]].split(":")[1])) - (parseInt(this.data.multiArray[5][this.data.multiIndex[5]].split(":")[0]) * 60 + parseInt(this.data.multiArray[5][this.data.multiIndex[5]].split(":")[1]))>=0){
      wx.showToast({
        icon: 'none',
        title: '截止时间应大于开始时间,请重新选择',
      })
      return;
}

    var a = dateStr.replace("年", "-").replace("月", "-").replace("日", " ").replace("时", "").replace("时", "")
    console.log('picker发送选择改变，携带值为', a)

    this.setData({
      orderData: a
    })
  },

  submit: function (options) {
    var that = this;
    if (this.data.old_focus_value.trim() === "") {
      wx.showToast({
        icon: 'none',
        title: '请输入主题',
      })
      return;
    } else if (this.data.orderData === "点击选择参加时间") {
      wx.showToast({
        icon: 'none',
        title: '请点击选择参加时间',
      })
      return;
    }
    else if (this.data.confirm_focus_value.trim() === "") {
      wx.showToast({
        icon: 'none',
        title: '请输入活动地点',
      })
      return;
    }
    else if (this.data.chooseContent.trim() === "") {
      wx.showToast({
        icon: 'none',
        title: '请选择接收人',
      })
      return;
    } else if (this.data.name === "点击添加接收人") {
      wx.showToast({
        icon: 'none',
        title: '请选择接收人',
      })
      return;
    }
    else if (this.data.detail.trim() === "") {
      wx.showToast({
        icon: 'none',
        title: '请输入事项',
      })
      return;
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (!this.data.lock){ return ;}
    console.log(that.data.old_focus_value);
    console.log(that.data.confirm_focus_value);
    that.setData({
      lock: false
    });
    wx.request({
      url: urls.baseUrl + urls.scheduleSupport,
      method: "POST",
      data: {
        createUserId: app.globalData.userInfo.usid,
        createUserName: app.globalData.userInfo.usname,
        title: that.data.old_focus_value,
        dateSection: that.data.orderData,
        detail: that.data.detail,
        receiveUserId: that.data.chooseContent.split(":")[0],
        receiveUserName: that.data.chooseContent.split(":")[1],
        address: that.data.confirm_focus_value,
        status:0
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          lock: true
        });
        if (res.data.respCode == 0) {
          // wx.navigateTo({
          //   url: '../sopport2/sopport2?tab=1'
          // })
          wx.reLaunch({
            url: '../sopport2/sopport2?tab=1'
          })
          wx.showToast({
            title: '创建成功',
          })
        }
      },
      fail: function () {
        that.setData({
          lock: true
        });
        wx.hideLoading();
      },
      complete(res) {
        // wx.hideLoading();
      }
    })

  },

  getList: function (options) {
    var that = this;
    wx.request({
      url: urls.baseUrl + urls.getPersons +'/ZHU_REN,BEN_BU_ZHANG',
      method: "GET",

      success: function (res) {
        that.setData({
        persons: res.data.data
        });

        console.log(that.data.persons);
      },
      fail: function () {

      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

})
