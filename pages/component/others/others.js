// pages/component/others/others.js
const util = require('../../../utils/util.js')
import { urls } from "../../../utils/urls.js";
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
    group: [],
    member: [],
    currentGid: 'MH8JQV5TSN',
    showSearch: false,
    search: '',
    focused: false,
    searchContent: "",
    _lastTime:0
  },

  attached() {
    let _this = this;
    this.setData({
      showSearch: !this.data.showSearch,
      focused: false,
      searchContent: ""
    }, function () {
      _this.onLoads();
    });

  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoads: function () {
      let that = this;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        // 获取openid
        url: urls.baseUrl + urls.queryUserNum(that.data.currentGid),
        method: 'GET',
        success(res) {
          that.setData({
            group: res.data.data
          })
          if (that.data.group.length === 0) {
            wx.request({
              // 获取openid
              url: urls.baseUrl + urls.allUser,
              method: 'GET',
              success(res) {
                that.setData({
                  member: res.data.data
                })
              }
            })
          } else {
            wx.request({
              // 获取openid
              url: urls.baseUrl + urls.queryUser,
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
      let url;
      if (search === '') {
        if (that.data.currentGid == 'MH8JQV5TSN') {
          //如果条件
          url = urls.baseUrl + urls.queryUser();
        } else {
          url = urls.baseUrl + urls.queryUserById(that.data.currentGid);
        }
        //return;
        //url = 'https://ics.evtbts.org/infoApp/api/smallProgram/UserOrgController/queryUser/' + that.data.currentGid;
      } else {
        url = urls.baseUrl + urls.findUserByName(that.data.search, that.data.currentGid);
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
      console.log('others goSchedule');
      let _this = this;
      let nowDate = new Date();
      if (!util.throwQuickClick(nowDate, _this.data._lastTime, 2000)) {
        return;
      }
      let mid = e.currentTarget.dataset.mid;
      let usname = e.currentTarget.dataset.usname;
      wx.navigateTo({
        url: '../others/otherCalendar?mid=' + mid + "&usname=" + usname,
      })
      _this.setData({
        _lastTime: new Date()
      })
    },
    refreshMember: function (e) {
      console.log('others refreshMember');
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
  }
})
