const urls = {
  /**
   * url基类
   */
  // baseUrl: "https://ics.evtbts.org/infoApp/",
   baseUrl: "http://www.catarc.info/infoAppTest/", 
  // baseUrl: "http://192.168.10.78:8081/",
  /**
   * 修改支持的状态PUT /infoApp/api/smallprogram/scheduleSupport 我请求的支持
   */
  updatescheduleSupport:'api/smallprogram/scheduleSupport',
  //请求我的支持
  updatescheduleMySupport: 'api/smallprogram/scheduleSupportUser',
  /**
   * 创建请求POST /infoApp/api/smallprogram/scheduleSupport
   */
  scheduleSupport:'api/smallprogram/scheduleSupport',
  /**
   * 获取接收人列表
   */
  getPersons:'api/sys/user/getUserByRoleCode',

  /**
   * GET /infoApp/api/smallprogram/scheduleSupport/page 我请求的支持
   */
  myscheduleSupport:'api/smallprogram/scheduleSupport/page',
  //请求我的支持
  myscheduleMySupport: 'api/smallprogram/scheduleSupport/selectPageByReceiveUserId',
  /**
   * PUT /infoApp/api/smallprogram/scheduleMeetUser/finish
   */
  updatescheduleMeetUser:'api/smallprogram/scheduleMeetUser/finish',
  /**
   * 删除会议
   */
  delMeet: function (id) {
    return '/api/smallprogram/scheduleSupport/' + id
  },
/**
 * 查看支持详情
 */
supprotDetail: function (id) {
    return 'api/smallprogram/scheduleSupport/' + id
  },
  supprotMyDetail: function (supportId, receiveUserId) {
    return 'api/smallprogram/scheduleSupport/selectBySupportIdAndReceiveUserId/' + supportId + '/' + receiveUserId
  },
  /**
   * 查看全部党委会
   */
  allPartyCommittee:"api/smallprogram/scheduleMeet/queryByPageAll",

/**
 * 查看党委会详情/infoApp/api/smallprogram/scheduleMeet/selectById/
 */
  partyCommitteeDetail:function(id) {
    return 'api/smallprogram/scheduleMeet/selectById/' + id
  },
  /**
   *查看我的党会GET /infoApp/api/smallprogram/scheduleMeet/selectPageByReceiveUserId
   */
  minePartyCommittee:"api/smallprogram/scheduleMeet/selectPageByReceiveUserId",

  /**
   * 解绑微信  GET /infoApp/api/smallProgram/WeixinController/logout
   */

  unbindWeixin:"api/smallProgram/WeixinController/logout",

  /**
   * 修改密码 POST /infoApp/api/smallProgram/UserOrgController/updateUserEOPwd
   */
  updatePassword:"api/smallProgram/UserOrgController/updateUserEOPwd",

  /**
   *修改用户信息
   */
  updateUserUrl:"api/smallProgram/UserOrgController/updateUserEO",

  /**
   * 登录url
   */
  loginUrl: 'api/smallProgram/SmallUserController/checkeUser',
  
  /**
   *  获取openid
   */
  openidUrl: 'api/smallProgram/WeixinController/getOpenId',

  /**
   * 创建日程
   */
  saveScheduleHourUrl: 'api/smallprogram/scheduleDetail',

  /**
   * 获取日程
   */
  getSchedule: 'api/smallProgram/ScheduleHourController/getSchedule',
 /**
   * 获取其他人的openid
   */
  queryUserNum:function(id){
    return 'api/smallProgram/UserOrgController/queryUserNum/' +id
  },
  /**
   * queryUserById
   */
  queryUserById: function (id) {
    return 'api/smallProgram/UserOrgController/queryUser/' + id
  },

/**
 * 搜索（根据姓名和部门）
 */
  findUserByName: function (search, currentGid) {
    return 'api/smallProgram/UserOrgController/findUserByName/' + search + '/' + currentGid
  },
/**
 * queryAllUser
 */
  queryAllUser: function (currentGid) {
    return 'api/smallProgram/UserOrgController/queryAllUser/' + currentGid
  },
  /**
   * allUser
   */
  allUser: 'api/smallProgram/UserOrgController/findUserByName/1/allUser',
  
  /**
   * USW7ASDVED
   */
  queryUser: 'api/smallProgram/UserOrgController/queryUser/USW7ASDVED',
  /**
   * 删除日程
   */  
  deleteDailyUrl: function(id) {
    return 'api/smallProgram/ScheduleHourController/deleteById/' + id 
    },
/**
 * getScheduleHour
 */
  getScheduleHour:function(id){
    return 'api/smallprogram/scheduleDetail/find'
   // return 'infoApp/api/smallProgram/ScheduleHourController/getById/' + id
  },

/**
 * getScheduleNext
 */
  getScheduleNext: 'api/smallprogram/scheduleDetail/findOther',
/**
 * getUser
 */
  getUser:function(id){
    return 'api/smallProgram/SmallUserController/getUserByOpenId/' + id 
  },
  /**
   * 获取某人某周的日程
   */
  getPageData: function (usid, weekNum){
    return 'api/smallProgram/ScheduleHourController/list/'+ usid+ '/' + weekNum
  },
  /**
   * 获取某人某日的日程
   */
  getPersonData:'api/smallProgram/ScheduleHourController/calenderQuery',
  /**
   * 获取重点工作接口
   */
  getImportDataUrl: function () {
    return '/api/smallprogram/scheduleImportant/page'
  },
  /**
   * 获取重点工作接口
   */
  getDownDataUrl: function (fileId) {
    return '/api/sys/file/' + fileId+'/download'
  },
  /**
   * 获取科委会全部工作要点接口
   */
  getAllScienceUrl: function (fileId) {
    return '/api/smallprogram/scheduleResearch/getResearchVOByPage'
  },
  /**
   * 获取科委会工作要点收藏置顶接口
   */
  setScienceTopOrCollectUrl: function (fileId) {
    return '/api/smallprogram/scheduleResearchMark/updateTopOrCollect'
  },
  /**
   * 获取科委会全部工作要点详情接口
   */
  getAllScienceDetailUrl: function (id) {
    return '/api/smallprogram/scheduleResearchUser/selectByResearchIdAndStatus?status=1&researchId='+id
  },
  /**
   * 获取科委会全部工作要点详情完成情况接口
   */
  getAllScienceDetailStatusUrl: function (id) {
    return '/api/smallprogram/scheduleResearchUser/queryFinishList?researchId='+id
  },
  /**
   * 获取科委会个人工作要点详情接口
   */
  getPersonScienceDetailUrl: function (item) {
    return '/api/smallprogram/scheduleResearchUser/page?createUserId='+item.createUserId+"&researchId="+item.id
  },
  /**
   * 获取科委会个人工作要点编辑接口
   */
  setPersonScienceDetailUrl: function (item) {
    return '/api/smallprogram/scheduleResearchUser';
  },
}

export { urls}