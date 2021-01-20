//logs.js
const util = require('../../utils/util.js')
import { urls } from "../../utils/urls.js";
Page({
  data: {
    group: [],
    member: [],
    currentGid: 'MH8JQV5TSN',
    search:'',
    showSearch: false,
    search: '',
    focused: false,
    option:{},
    searchContent:'',
    _lastTime:0
  },
  onLoad: function (option) {
    let currentGid = option.gid;
    let currentGname = option.gname;
    this.setData({option});
    let that = this;
    wx.setNavigationBarTitle({
      title: currentGname
    })
    that.setData({
      currentGid
    });

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.request({
      // 获取openid
      url: urls.baseUrl +urls.queryUserNum(that.data.currentGid),
      method: 'GET',
      success(res) {
        that.setData({
          group: res.data.data
        })
        if(that.data.group.length === 0){
          wx.request({
            // 获取openid
            url: urls.baseUrl +urls.queryAllUser(that.data.currentGid),
            method: 'GET',
            success(res) {
              that.setData({
                member: res.data.data
              })
            }
          })
        }else{
          wx.request({
            // 获取openid
            url: urls.baseUrl +urls.queryUserById(that.data.currentGid),
            method: 'GET',
            success(res) {
              that.setData({
                member: res.data.data
              })
            }
          })
        }
        wx.hideLoading();
      }
    })
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
      searchContent:""
    }, function () {
      _this.onLoad(_this.data.option);
    });

  },
  searchMember: function (e) {
    let that = this;
    let search = e.detail.value;
    that.setData({
      search
    })
    let url;
    if (search === '') {
      //return;
      url = urls.baseUrl +urls.queryUserById(that.data.currentGid);
    } else {
      url = urls.baseUrl +urls.findUserByName(that.data.search ,that.data.currentGid);
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      // 获取openid
      url: url,
      method: 'GET',
      success(res) {
        that.setData({
          member: res.data.data
        })
        wx.hideLoading();
      }
    })
  },
  goSchedule: function (e) {
    let _this = this;
    let nowDate = new Date();
    if (!util.throwQuickClick(nowDate, _this.data._lastTime, 2000)) {
      return;
    }
    let id = e.currentTarget.dataset.id;
    let mid = e.currentTarget.dataset.mid;
    let usname = e.currentTarget.dataset.usname;
    wx.navigateTo({
      url: './otherCalendar?mid=' + mid + "&usname=" + usname + "&id=" + id,
    })
    _this.setData({
      _lastTime: new Date()
    })
  },
  refreshMember: function (e) {
    let _this = this;
    let nowDate = new Date();
    if (!util.throwQuickClick(nowDate, _this.data._lastTime, 2000)) {
      return;
    }
    let gid = e.currentTarget.dataset.gid;
    let gname = e.currentTarget.dataset.gname;
    wx.navigateTo({
      url: '../others/otherSecond?gid=' + gid + '&gname=' + gname
    })
    _this.setData({
      _lastTime: new Date()
    })
  }
})
