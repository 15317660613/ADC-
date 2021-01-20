const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
}
function getWeek(dates) {
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  let day = date.getDay();
  return show_day[day];
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function goTop () {
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
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * ts: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function tsFormatTime(timestamp, format) {

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];

  let date = new Date(timestamp);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  returnArr.push(year, month, day, hour, minute, second);

  returnArr = returnArr.map(formatNumber);

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;

}

function showMyToast(that,message){
  setTimeout(() => {
    wx.showToast({
      title: message,
    });
    setTimeout(() => {
      // wx.hideToast();
      if(that!==''){
        that.getData();
      }
    }, 2000)
  }, 0);
}

function throwQuickClick(date1,date2,timeout) {
  console.log(date1,date2,date1-date2>timeout);
  if(date1 - date2 >= timeout){
      return true;
    }else{
      return false;
    }
}
function getNowDate (date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month,day].map(formatNumber).join('-');
}
function htmlDecodeByRegExp (str) {
  var s = "";
  if(str.length == 0||typeof str === 'number') return str;
  s = str.replace(/&amp;/g,"&");
  s = s.replace(/&lt;/g,"<");
  s = s.replace(/&gt;/g,">");
  s = s.replace(/&nbsp;/g," ");
  s = s.replace(/&#39;/g,"\'");
  s = s.replace(/&quot;/g,"\"");
  return s;
}

module.exports = {
  formatTime: formatTime,
  getWeek: getWeek,
  tsFormatTime: tsFormatTime,
  showMyToast: showMyToast,
  throwQuickClick: throwQuickClick,
  getNowDate:getNowDate,
  htmlDecodeByRegExp:htmlDecodeByRegExp
}
