//logs.js
const util = require('../../utils/util.js')
import { urls } from "../../utils/urls.js";
Page({
  data: {
    group:[],
    member:[],
    currentGid: 'MH8JQV5TSN',
    showSearch:false,
    search:'',
    focused:false,
    searchContent:""
  },
  onLoad: function () {
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
      searchContent:""
    },function(){
      _this.onLoad();
    });

  },
  searchMember: function(e) {
    let that = this;
    let search = e.detail.value;
    that.setData({
      search
    })
    let url ;
    if(search===''){
      if (that.data.currentGid == 'MH8JQV5TSN'){
      //如果条件
        url = urls.baseUrl + urls.queryUser();
      }else{
        url = urls.baseUrl + urls.queryUserById(that.data.currentGid);
      }
      //return;
      //url = 'https://ics.evtbts.org/infoApp/api/smallProgram/UserOrgController/queryUser/' + that.data.currentGid;
    }else{
      url = urls.baseUrl + urls.findUserByName(that.data.search, that.data.currentGid) ;
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
  goSchedule: function(e){
    console.log('点击了')
    let mid = e.currentTarget.dataset.mid;
    let usname = e.currentTarget.dataset.usname;
    // wx.navigateTo({
    //   url: './othersDaily?mid=' + mid + "&usname=" + usname,
    // })
    wx.navigateTo({
      url: './otherCalendar?mid=' + mid + "&usname=" + usname,
    })
  },
  refreshMember: function (e) {
    let gid = e.currentTarget.dataset.gid;
    let gname = e.currentTarget.dataset.gname;
    wx.navigateTo({
      url: '../others/otherSecond?gid=' + gid + '&gname=' + gname
    })
  }
})
