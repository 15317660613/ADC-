
const app = getApp()
import { urls } from "../../utils/urls.js";
let util = require("../../utils/util.js");
Page({
  data: {
    currentTab: 0,
    //这里只做tab名和显示图标
    items: [
      {
        "text": "首页",
        "iconPath": "/assects/zhuye.png",
        "selectedIconPath": "/assects/zhuye2.png",
        
      },
      {
        "text": "我的",
        "iconPath": "/assects/wode1.png",
        "selectedIconPath": "/assects/wode2.png",
        
      }
    ]
  },
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
 
  
  onLoad: function (option) {
   
  },

  
})
