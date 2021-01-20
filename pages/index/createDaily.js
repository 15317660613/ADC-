// pages/index/createDaily.js
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

    // 时间选择器
    multiArray: [
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      ['00', '30'],
      [' - '],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      ['00', '30']
    ],

    multiArray2: [
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
      [' - '],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    ],
    multiIndex: [8, 0, 2, 17, 0],

    // 日程详情
    addSchedule: [{
      scheduleDetail: '',
      // detailType:0,
      scheduleTime: '',
      scheduleTFirst: '0',
      currentWordNumber: 0,
      beginTime: '',
      endTime: '',
      extInfo1: '', //地点
      extInfo2: '', //用户id
      extInfo3: '', //用户名
      extInfo4: '1', //用户名
      timeLimit: '请选择时间段',
      orderNumber: 0

    }],
    ids: [],
    time: '',
    selects: ['东丽', '西青', '出差', '出国', '休假'],
    button: "",
    chooseType: "",
    id: '',
    type: 0,
    date: '',
    city: '',
    complete: false,
    scheduleDesc: null,
    item: '',
    activeItem: "",
    address: '',
    currentWordNumberClass: 'currentWordNumber',
    max: 80,
    scheduleHourId: '',
    myAddScheduleArr: [],
    lookflag: true,
    validata: null,
    validata1: null
  },
  chooseDailyType: function (e) {
    let that = this;
    let text = e.currentTarget.dataset.text;
    switch (text) {
      case "东丽":
        text = "东丽办公";
        break;
      case "西青":
        text = "西青办公";
        break;
      case "出差":
        wx.navigateTo({
          url: '/pages/index/selectCity',
        });
        wx.hideLoading();
        return;
      case "休假":
        text = "休假";
        break;
      case "出国":
        text = "出国";
        break;
    }
    that.setData({
      activeItem: e.currentTarget.dataset.text,
      chooseType: text,
      button: e.currentTarget.dataset.text
    })
    if (that.data.activeItem != "") {
      that.setData({
        complete: true,
      })
    } else {
      that.setData({
        complete: false,
        chooseType: ""
      })
    }

  },
  //点击选择日期回显当前日期
  currentValue: function (e) {
    let val = e.currentTarget.dataset.value;
    if (e.currentTarget.dataset.value !== null) {
      if (e.currentTarget.dataset.value.indexOf('-') !== -1) {
        let one = this.data.multiArray[0].indexOf(val.split('-')[0].split(':')[0].trim())
        let two = this.data.multiArray[1].indexOf(val.split('-')[0].split(':')[1].trim())
        let three = this.data.multiArray[3].indexOf(val.split('-')[1].split(':')[0].trim())
        let four = this.data.multiArray[4].indexOf(val.split('-')[1].split(':')[1].trim())
        this.setData({
          multiIndex: [one, two, 0, three, four],
        })
      }
    }
  },
  multiBindchange: function (e) {
    let that = this;
    let tag = that.data.type;
    if (this.data.type == 0) {
      var objDate1 = this.data.multiArray[0][e.detail.value[0]] * 60 + this.data.multiArray[1][e.detail.value[1]]
      var objDate2 = this.data.multiArray[3][e.detail.value[3]] * 60 + this.data.multiArray[4][e.detail.value[4]]
      // if ((this.data.multiArray[0][e.detail.value[0]] == "12" && this.data.multiArray[1][e.detail.value[1]] != "00") || (this.data.multiArray[3][e.detail.value[3]] == "12" && this.data.multiArray[4][e.detail.value[4]] != "00")){
      //     wx.showToast({
      //         icon: 'none',
      //         title: '您填写的上午时间段不能超过12:00',
      //     })
      //     return;
      // }
      if (objDate2 - objDate1 <= 0) {
        wx.showToast({
          icon: 'none',
          title: '您的日程截止时间应大于起始时间',
        })
        return;
      }
      if (this.data.addSchedule.length > 1) {
        //最小的和最大的在其他时间段之间即可，否则有时间交叉，需重新选择
        for (let i = 0; i < this.data.addSchedule.length; i++) {
          if (e.currentTarget.dataset.index != i) {
            if (this.data.addSchedule[i].timeLimit !== '请选择时间段' && this.data.addSchedule[i].timeLimit !== null) {
              let startTime = this.data.addSchedule[i].timeLimit.split(" - ")[0].split(":")[0] * 60 + this.data.addSchedule[i].timeLimit.split(" - ")[0].split(":")[1];
              let endTime = this.data.addSchedule[i].timeLimit.split(" - ")[1].split(":")[0] * 60 + this.data.addSchedule[i].timeLimit.split(" - ")[1].split(":")[1];
              if ((parseInt(objDate1) >= parseInt(startTime) && parseInt(objDate1) < parseInt(endTime)) || (parseInt(objDate1) < parseInt(startTime) && parseInt(objDate2) > parseInt(startTime))) {
                wx.showToast({
                  icon: 'none',
                  title: '您的日程时间段与其他时间段存在交叉，请重新选择',
                })
                return;
              } else if ((parseInt(objDate2) > parseInt(startTime) && parseInt(objDate2) < parseInt(endTime))) {
                wx.showToast({
                  icon: 'none',
                  title: '您的日程时间段与其他时间段存在交叉，请重新选择',
                })
                return;
              }
            }
          }
        }
      }

      let index = e.target.dataset.index //数组下标
      let tag = e.target.dataset.tag //字段名称
      let array = this.data.addSchedule
      array[index]['extInfo2'] = app.globalData.userInfo.usid; //赋值
      array[index]['extInfo3'] = app.globalData.userInfo.usname; //赋值
      array[index]['extInfo4'] = '1'; //赋值
      array[index]['orderNumber'] = index; //赋值
      array[index][tag] = this.data.multiArray[0][e.detail.value[0]] + ":" + this.data.multiArray[1][e.detail.value[1]] + this.data.multiArray[2][e.detail.value[2]] + this.data.multiArray[3][e.detail.value[3]] + ":" + this.data.multiArray[4][e.detail.value[4]]
      // array[index][tag] = [e.detail.value[0], e.detail.value[1], e.detail.value[2], e.detail.value[3], e.detail.value[4]]
      this.setData({
        multiIndex: [e.detail.value[0], 0, e.detail.value[2], e.detail.value[3], 0],
        addSchedule: array
      })
    } else {
      var objDate11 = this.data.multiArray2[0][e.detail.value[0]] * 60 + this.data.multiArray2[1][e.detail.value[1]]

      var objDate22 = this.data.multiArray2[3][e.detail.value[3]] * 60 + this.data.multiArray2[4][e.detail.value[4]]
      if (objDate22 - objDate11 <= 0) {
        wx.showToast({
          icon: 'none',
          title: '您的日程截止时间应大于起始时间',
        })
        return;
      }
      if (this.data.addSchedule.length > 1) {
        //最小的和最大的在其他时间段之间即可，否则有时间交叉，需重新选择
        for (let i = 0; i < this.data.addSchedule.length; i++) {
          if (e.currentTarget.dataset.index != i) {
            if (this.data.addSchedule[i].timeLimit !== '请选择时间段') {
              let startTime = this.data.addSchedule[i].timeLimit.split(" - ")[0].split(":")[0] * 60 + this.data.addSchedule[i].timeLimit.split(" - ")[0].split(":")[1];
              let endTime = this.data.addSchedule[i].timeLimit.split(" - ")[1].split(":")[0] * 60 + this.data.addSchedule[i].timeLimit.split(" - ")[1].split(":")[1];
              if ((parseInt(objDate1) >= parseInt(startTime) && parseInt(objDate1) < parseInt(endTime)) || (parseInt(objDate1) < parseInt(startTime) && parseInt(objDate2) > parseInt(startTime))) {
                wx.showToast({
                  icon: 'none',
                  title: '您的日程时间段与其他时间段存在交叉，请重新选择',
                })
                return;
              } else if ((parseInt(objDate2) > parseInt(startTime) && parseInt(objDate2) < parseInt(endTime))) {
                wx.showToast({
                  icon: 'none',
                  title: '您的日程时间段与其他时间段存在交叉，请重新选择',
                })
                return;
              }
            }
          }
        }


      }


      let index = e.target.dataset.index //数组下标
      let tag = e.target.dataset.tag //字段名称
      let array = this.data.addSchedule
      array[index]['extInfo2'] = app.globalData.userInfo.usid; //赋值
      array[index]['extInfo3'] = app.globalData.userInfo.usname; //赋值
      array[index]['extInfo4'] = '1'; //赋值
      array[index]['orderNumber'] = index; //赋值
      array[index][tag] = this.data.multiArray2[0][e.detail.value[0]] + ":" + this.data.multiArray2[1][e.detail.value[1]] + this.data.multiArray2[2][e.detail.value[2]] + this.data.multiArray2[3][e.detail.value[3]] + ":" + this.data.multiArray2[4][e.detail.value[4]]
      // array[index][tag] = [e.detail.value[0], e.detail.value[1], e.detail.value[2], e.detail.value[3], e.detail.value[4]]
      this.setData({
        multiIndex: [e.detail.value[0], 0, e.detail.value[2], e.detail.value[3], 0],
        addSchedule: array
      })
    }


  },
  validate: function (scheduleDetailArr) {
    if (scheduleDetailArr == null) {
      return true;
    }
    for (let i = 0; i < scheduleDetailArr.length - 1; i++) {
      for (let j = i + 1; j < scheduleDetailArr.length; j++) {
        if (scheduleDetailArr[i].timeLimit == null) {
          this.data.validata = true
        } 
        else if (scheduleDetailArr[i].timeLimit !== '请选择时间段') {
            try {
              let A = this.data.addSchedule[i].timeLimit.split(" - ")[0].split(":")[0] * 60 + this.data.addSchedule[i].timeLimit.split(" - ")[0].split(":")[1];
              let B = this.data.addSchedule[i].timeLimit.split(" - ")[1].split(":")[0] * 60 + this.data.addSchedule[i].timeLimit.split(" - ")[1].split(":")[1];
              let X = this.data.addSchedule[j].timeLimit.split(" - ")[0].split(":")[0] * 60 + this.data.addSchedule[j].timeLimit.split(" - ")[0].split(":")[1];
              let Y = this.data.addSchedule[j].timeLimit.split(" - ")[1].split(":")[0] * 60 + this.data.addSchedule[j].timeLimit.split(" - ")[1].split(":")[1];
              if (Math.max(A, X) < Math.min(B, Y)) {
                this.data.validata1 = false
              }
            } catch (err) {
              this.data.validata = true
            }
        }
      }
    }
    this.data.validata = true
  },
  multiPickerColumnChange: function (e) {
    let index = e.target.dataset.index //数组下标
    let tag = e.target.dataset.tag //字段名称
    let array = this.data.addSchedule


    this.setData({
      multiIndex: [e.detail.value[0], e.detail.value[1], e.detail.value[2], e.detail.value[3], e.detail.value[4]],
      addSchedule: array
    })
  },

  changeStatus: function (e) {
    let index = e.target.dataset.index //数组下标
    let tag = e.target.dataset.tag //字段名称

    let array = this.data.addSchedule


    if (e.currentTarget.dataset.value === 0) {
      array[index][tag] = 1;
      this.setData({
        addSchedule: array
      })
    } else {
      array[index][tag] = 0
      this.setData({
        addSchedule: array
      })
    }
  },

  addSchedule: function () {

    let newArray = {
      scheduleDetail: '',
      // detailType: 0,
      timeLimit: '请选择时间段',
      scheduleTFirst: '1',
      extInfo1: '',
      extInfo2: '',
      extInfo3: ''
    }
    this.setData({
      addSchedule: this.data.addSchedule.concat(newArray)

    })
  },
  deleteSchedule: function (e) {
    if (e.currentTarget.id !== "") {
      this.data.ids.push(e.currentTarget.id)
    }

    let that = this
    let index = e.target.dataset.index //数组下标
    let arrayLength = that.data.addSchedule.length //数组长度
    let newArray = []
    if (arrayLength > 1) {
      for (let i = 0; i < arrayLength; i++) {
        if (i !== index) {
          newArray.push(that.data.addSchedule[i])
        }
      }
      that.setData({
        addSchedule: newArray

      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '必须设置一个项目',
      })
    }

  },
  setInputValue: function (e) {
    let index = e.target.dataset.index //数组下标
    let tag = e.target.dataset.tag //字段名称
    let array = this.data.addSchedule;
    array[index][tag] = e.detail.value //赋值
    array[index]['extInfo2'] = app.globalData.userInfo.usid; //赋值
    array[index]['extInfo3'] = app.globalData.userInfo.usname; //赋值
    array[index]['extInfo4'] = '1'; //赋值
    array[index]['orderNumber'] = index; //赋值
    this.setData({
      addSchedule: array
    })
  },
  addressValue: function (e) {
    let index = e.target.dataset.index //数组下标
    let address = e.target.dataset.address
    let array = this.data.addSchedule;
    array[index][address] = e.detail.value; //赋值
    array[index]['extInfo2'] = app.globalData.userInfo.usid; //赋值
    array[index]['extInfo3'] = app.globalData.userInfo.usname; //赋值
    array[index]['extInfo4'] = '1'; //赋值
    this.setData({
      addSchedule: array
    })
  },
  // 获取详情的值
  bindEquipment: function (e) {
    var value = e.detail.value;
    this.setData({ //更新备注内容
      scheduleDesc: value
    })

    // let currentWordNumberClass = 'currentWordNumber';
    // if (e.detail.value.length > this.data.max){
    //   currentWordNumberClass = 'currentWordNumberRed';
    // }

    if (this.data.activeItem != "") {
      this.setData({
        complete: true,
      })
    } else {
      this.setData({
        complete: false,
      })
    }
  },
  sucsub: function () {
    if (this.data.lookflag == true) {
      this.submit()
      this.setData({
        lookflag: false
      })
    }
    setTimeout(() => {
      this.setData({
        lookflag: true
      })
    }, 2000)
  },
  // 点击完成提交详情页内容
  submit: function () {
    let that = this;
    let activeItem = that.data.button;
    switch (activeItem) {
      case "东丽":
        activeItem = "东丽办公";
        break;
      case "西青":
        activeItem = "西青办公";
        break;
        // case "出差":
        //   activeItem = "出差";
        //   break;
      case "休假":
        activeItem = "休假";
        break;
      case "出国":
        activeItem = "出国";
        break;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.data.myAddScheduleArr = [];
    if (that.data.addSchedule.length != 0) {
      this.setData({
        scheduleDesc: "",
      })
      for (let i = 0; i < that.data.addSchedule.length; i++) {
        //if (that.data.addSchedule[i].scheduleDetail||that.data.addSchedule[i].extInfo1) {
          if ((that.data.addSchedule[i].scheduleDetail != "" && that.data.addSchedule[i].scheduleDetail != null) ||
          (that.data.addSchedule[i].extInfo1 != "" && that.data.addSchedule[i].extInfo1 != null) ||
          (that.data.addSchedule[i].timeLimit != "" && that.data.addSchedule[i].timeLimit != null)) {
          if (((that.data.addSchedule[i].scheduleDetail != "" && that.data.addSchedule[i].scheduleDetail != null) ||
              (that.data.addSchedule[i].extInfo1 != "" && that.data.addSchedule[i].extInfo1 != null)) && that.data.addSchedule[i].timeLimit === '请选择时间段') {
            wx.showToast({
              icon: 'none',
              title: '请选择时间段',
            })
            return;
          }
          if (that.data.addSchedule[i].timeLimit !== '请选择时间段') {
            that.data.myAddScheduleArr.push(that.data.addSchedule[i]);
          }
          this.setData({
            scheduleDesc: "",
          })
        }
        if (!that.data.addSchedule[i].timeLimit && !that.data.addSchedule[i].scheduleDetail && !that.data.addSchedule[i].extInfo1) {
          that.data.ids.push(that.data.addSchedule[i].id);
        }
        that.data.addSchedule[i].extInfo2 = app.globalData.userInfo.usid;
        that.data.addSchedule[i].extInfo3 = app.globalData.userInfo.usname;
      }
      console.log(that.data.myAddScheduleArr)
      this.validate(that.data.myAddScheduleArr)
      console.log(this.data.validata, this.data.validata1)
      // if (!that.validate(that.data.myAddScheduleArr)) {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '您的日程时间段与其他时间段存在交叉，请重新选择',
      //   })
      //   return;
      // }
    }
    console.log(that.data.date)
    let fullyear = new Date(that.data.date).getFullYear();
    let fullMonth = (new Date(that.data.date).getMonth() + 1) < 10 ? ('0' + (new Date(that.data.date).getMonth() + 1)) : (new Date(that.data.date).getMonth() + 1)
    let fullDay = new Date(that.data.date).getDate() < 10 ? ('0' + new Date(that.data.date).getDate()) : new Date(that.data.date).getDate()
    //   let fullHour = new Date(that.data.date).getHours()<10?('0'+new Date(that.data.date).getHours()):new Date(that.data.date).getHours()
    //   let fullMin = new Date(that.data.date).getMinutes()<10?('0'+new Date(that.data.date).getMinutes()):new Date(that.data.date).getMinutes()
    //   let fullSec = new Date(that.data.date).getSeconds()<10?('0'+new Date(that.data.date).getSeconds()):new Date(that.data.date).getSeconds()
    // 改为当天的8点 转为时间戳
    // let scheduleDate = fullyear + '-' + fullMonth + '-' + fullDay + ' ' + '08' + ':' + '00' + ':' + '00'
    let scheduleDate = new Date(fullyear, fullMonth - 1, fullDay, '08', '00', '00').getTime();
    // let scheduleDate = new Date(fullyear, fullMonth - 1, fullDay, '08', '00', '00').getTime();
    console.log(scheduleDate)
    // 1598572800000
    wx.request({
      url: urls.baseUrl + urls.saveScheduleHourUrl,
      method: "POST",
      data: {
        scheduleContent: activeItem,
        userId: app.globalData.userInfo.usid,
        scheduleDate: scheduleDate,
        scheduleHour: that.data.type,
        id: that.data.id,
        scheduleDetailEOs: that.data.myAddScheduleArr,
        scheduleDesc: that.data.scheduleDesc,
        ids: that.data.ids,
        // extInfo1:that.data.address
        updateFlag: 1,
        updateUserId: app.globalData.userInfo.usid,
        updateUserName: app.globalData.userInfo.usname,
      },
      success: function (res) {
        if (res.data.respCode === "0") {
          app.globalData.saveData = that.data.date;
          // beforePage.today(); //为页面A的方法
          //             let pages = getCurrentPages();
          //   let prevPage = pages[pages.length - 2];
          //   prevPage.setData({
          //        message: e.currentTarget.dataset.msg,
          //   })
          wx.hideLoading();
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.message,
            duration: 2000
          })
          // wx.navigateBack({
          //   delta: 1
          // })
          return;
        }

        // this.setData({
        //   complete: false
        // })
      },
      // complete(res) {
      //   wx.hideLoading();
      // }
    })
  },
  getTimeAndType: function (options) {
    var date = options.split(' ')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.scheduleHourId) {
      this.setData({
        scheduleHourId: options.scheduleHourId
      })
      wx.setNavigationBarTitle({
        title: '编辑日程'
      })
      wx.request({
        url: urls.baseUrl + urls.getScheduleHour(options.scheduleHourId),
        method: "POST",
        data: {
          userId: app.globalData.userInfo.usid,
          id: options.scheduleHourId,
          destUserId: app.globalData.userInfo.usid,
          // detailType: 0,
        },
        success: function (res) {
          let addSchedule = res.data.data.scheduleDetailEOs;
          if (addSchedule.length == 0) {
            let addSchedules = [{
              scheduleDetail: res.data.data.scheduleDesc,
              // detailType: 0,
              scheduleTime: '',
              scheduleTFirst: '0',
              currentWordNumber: 0,
              beginTime: '',
              endTime: '',
              extInfo1: '',
              extInfo2: '',
              extInfo3: '',
              extInfo4: '1     ',
              timeLimit: '请选择时间段'
            }]

            addSchedule = addSchedule.concat(addSchedules);
          }
          for (var i = 0; i < addSchedule.length; i++) {
            for (var item in addSchedule[i]) {
              if (addSchedule[i][item]) {
                addSchedule[i][item] = util.htmlDecodeByRegExp(addSchedule[i][item]);
              }
            }
          }
          let buttonType = res.data.data.scheduleContent;
          if (buttonType !== null) {
            buttonType = buttonType.slice(0, 2);
          }

          let text = "",
            activeItem = "";

          switch (buttonType) {
            case "东丽":
              activeItem = "东丽";
              text = "东丽办公"
              break;
            case "西青":
              activeItem = "西青";
              text = "西青办公"
              break;
            case "出差":
              activeItem = "出差";
              text = res.data.data.scheduleContent;
              break;
            case "休假":
              activeItem = "休假";
              text = "休假"
              break;
            case "出国":
              activeItem = "出国";
              text = "出国"
              break;
          }
          let complete = false;
          if (that.data.activeItem == "") {
            complete = true;
          }

          that.setData({
            addSchedule: addSchedule,
            activeItem: activeItem,
            chooseType: text,
            button: text,
            complete: complete
          })
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '创建日程'
      })
    }
    if (options) {
      this.setData({
        id: options.scheduleHourId,
        type: options.type,

        date: options.date,
      })
    }
    const dateArr = options.date.split(' ')
    let month = dateArr[1];
    let day = dateArr[2];
    let week = dateArr[0];
    let year = dateArr[3];
    let type = options.type;
    type = type == 0 ? "上午" : "下午"
    switch (month) {
      case "Jan":
        month = "01";
        break;
      case "Feb":
        month = "02";
        break;
      case "Mar":
        month = "03";
        break;
      case "Apr":
        month = "04";
        break;
      case "May":
        month = "05";
        break;
      case "Jun":
        month = "06";
        break;
      case "Jul":
        month = "07";
        break;
      case "Aug":
        month = "08";
        break;
      case "Sep":
        month = "09";
        break;
      case "Oct":
        month = "10";
        break;
      case "Nov":
        month = "11";
        break;
      case "Dec":
        month = "12";
        break;
    }
    switch (week) {
      case "Mon":
        week = "周一";
        break;
      case "Tue":
        week = "周二";
        break;
      case "Wed":
        week = "周三";
        break;
      case "Thu":
        week = "周四";
        break;
      case "Fri":
        week = "周五";
        break;
      case "Sat":
        week = "周六";
        break;
      case "Sun":
        week = "周日";
        break;
    }
    var this_time = year + '/' + month + '/' + day + ' ' + week + ' ';
    this.setData({
      time: this_time
    })

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
    if (app.globalData.cityData !== '') {
      let _this = this;
      _this.setData({
        city: app.globalData.cityData,
        chooseType: app.globalData.cityData,
        activeItem: app.globalData.cityData.slice(0, 2),
        button: app.globalData.cityData
      })
      app.globalData.cityData = '';
    }
    if (this.data.activeItem == "") {
      this.setData({
        complete: false,
      })
    } else {
      this.setData({
        complete: true,
      })
    }
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
    // var pages = getCurrentPages();
    // var beforePage = pages[pages.length - 2];
    // beforePage.today();
    // wx.navigateBack({
    //     delta: 1,
    // })
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