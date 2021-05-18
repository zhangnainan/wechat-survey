import {SurveyModel} from '../../models/survey-p'
import {TitleModel} from '../../models/title'
import {SubmitModel} from '../../models/submit'
import {config} from '../../config.js'
let surveyModel = new SurveyModel();
let titleModel = new TitleModel();
let submitModel = new SubmitModel();
let util = require('../../common/js/util.js')
let dateFormat = require('../../common/js/dateFormat.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    surveyId : '',
    survey:Object,
    surveySubmit : Object,
    titleList : [],
    isSubmitted : false,
    submitBgColor : 'before-submit-bgcolor',
    submitText : '提交',
    isSuccess : false,
    isNotStart : false,
    isTimeOut : false,
    isCompleted : false,
    alreadySubmit : true,
    beforeAnswer : false,
    loading : true,
    /* test */
    ismask : Object,
    wxNickname : '',
    wxOpenId : String,
    canIUseGetUserProfile : false,
    isAuthorizing : false,
    /* contest */
    submitter : '',
    hour : '00',
    minute : '00',
    second : '00',
    surveySubmit : Object,
    timeCounter : Object
  },

  
  closeHide:function(e){
    this.setData({
      ismask: 'none'
    });
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
    })
    
    const surveyId = options.surveyId
    let canIUseGetUserProfile = false
    if(wx.getUserProfile){
      canIUseGetUserProfile = true
    }
    this.setData({
      surveyId : surveyId,
      canIUseGetUserProfile : canIUseGetUserProfile
    })
    this.login()
  },

  login : function(){
    wx.showLoading({
      title : '加载中...',
      icon : 'none'
    })
    let that = this
    this._authBtnLock()
    wx.login({
      complete: (res) => {
        let errMsg = res.errMsg
        if(errMsg == 'login:ok'){
          that.getOpenId(res.code)
        }else{
          wx.showToast({
            title: '请检查网络是否连接',
            icon : 'none'
          })
        }
      },
    })
  },

  getOpenId : function(code){
    surveyModel.getOpenId(code).then(res=>{
      let message = res.message
      if(message == 'success'){
        let wxOpenId = res.data
        this._authBtnUnlock()
        this.setData({
          wxOpenId : wxOpenId
        })
        wx.hideLoading()
        if(!this.data.canIUseGetUserProfile){
          this.getSettingAndLoadData()
        }
      }else{
        wx.showToast({
          title: '服务端发生了错误',
        }) 
      }
    },res=>{
    //  wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
    })
  },

  bindGetUserInfo : function(res){
    if(this.data.isAuthorizing){
      return
    }
    this._authBtnLock()
    this.getSettingAndLoadData()
  },

  getSettingAndLoadData : function(){
    let that = this
    if(!this.data.canIUseGetUserProfile){
      wx.getSetting({
        success: res => {        
          if (res.authSetting['scope.userInfo']){
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框          
            wx.getUserInfo({
              success: res => {
                that.setData({
                  ismask: 'none',
                  wxNickname : res.userInfo.nickName
                });
                that.getSurveyAndSubmit()
              }
            })
            
          }else{
            this.setData({
              ismask: 'block'
            });
          }
        }
      });
    }else{
      wx.getUserProfile({
        desc: '用于获取昵称', 
        success: (res) => {
          that.setData({
            ismask: 'none',
            wxNickname : res.userInfo.nickName
          });
          that.getSurveyAndSubmit()
        }
      })
    }
  },

  getSurveyAndSubmit : function(){
    wx.showLoading({
      title : '加载中...'
    })
    let surveyId = this.data.surveyId
    let wxOpenId = this.data.wxOpenId
    const surveySubmit = submitModel.getSurveySubmitList(surveyId,wxOpenId)
    const surveyInfo = surveyModel.getSurveyInfo(surveyId)

    Promise.all([surveySubmit,surveyInfo]).then(res=>{
      wx.hideLoading()
      this._beforeAnswer()
      let surveySubmit = null
      let survey = null
      let alreadySubmit = true
      if(res[0].message == 'success'){
        surveySubmit = res[0].data
      }
      if(res[1].message == 'success'){
        survey = res[1].data
        let surveyName = survey.surveyName
        if(!util.isNull(surveyName)){
          wx.setNavigationBarTitle({
            title : surveyName
          })
        }
      }
      if(surveySubmit == null || surveySubmit == undefined || surveySubmit.length == 0){
        alreadySubmit = false
      }
      let currentDateTime = dateFormat.dateFormat('yyyy-MM-dd hh:mm:ss', new Date())
      let beginDateTime = survey.beginDateTime
      let endDateTime = survey.endDateTime
      if(!util.isNull(beginDateTime) && !util.isNull(endDateTime)){
        this.setData({
          isNotStart : beginDateTime > currentDateTime ? true : false,
          isTimeOut : endDateTime < currentDateTime ? true : false
        })
        if(this.data.isNotStart || this.data.isTimeOut){
          this._answered()
        }
      }
      this.setData({
        surveySubmit : surveySubmit,
        survey : survey,
        alreadySubmit : alreadySubmit
      })
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
        icon : 'none'
      })
    })
  },

  getContestTitleList : function(surveyId,answerTitleNum){
    wx.showLoading({
      title: '题目加载中...',
    })
    titleModel.getContestTitleList(surveyId, answerTitleNum).then(res=>{
      let message = res.message
      wx.hideLoading()
      if(res.message != 'success'){
        wx.showToast({
          title: res.message,
          icon:'none'
        })
      }else{
        let titleList = res.data
        this.setData({
          titleList : titleList,
          loading : false,
          beforeAnswer : false
        })
        this.updateTime()
      }

    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon : 'none'
      })
    })

  },

  submitterInput : function(e){
    let submitter = e.detail.value
    this.setData({
      submitter : submitter
    })
  },

  beginAnswerTap : function(e){
    let submitter = this.data.submitter
    if(util.isNull(submitter)){
      wx.showToast({
        title: '请填写姓名!',
        icon : 'none'
      })
      return
    }
    this.getContestTitleList(this.data.surveyId,this.data.survey.answerTitleNum)
  },

  lookRankTap : function(e){
    wx.navigateTo({
      url: `/pages/contest-rank/contest-rank?survey=`+JSON.stringify(this.data.survey),
    })
  },

  updateTime : function(){
    const that = this 
    let h = that.data.hour
    let m = that.data.minute
    let s = that.data.second
    
    let timeCounter = setInterval(function(){
      s++
      if(s >= 60){
        s = 0
        m++
        if(m >= 60){
          m = 0
          h++
          that.setData({
            hour:(h<10?'0'+h : h)
          })
        }else{
          that.setData({
            minute : m < 10?'0'+m : m
          })
        }
      }else{
        that.setData({
          second : s < 10?'0'+s : s
        })
      }
    },1000)

    this.setData({
      timeCounter : timeCounter
    })
  },

  radiotap : function(event){
    let titleId = event.currentTarget.dataset.titleid
    let optionId = event.currentTarget.dataset.optionid
    let titleList = this.data.titleList
    for(let i = 0; i < titleList.length; i++){
      let title = titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(option.id == optionId){
            if(option.selected){
              option.selected = false
            }else{
              option.selected = true
            }
          }else{
            option.selected = false
          }
        }
        this.setData({
          titleList : titleList
        })
        break
      }
    }
  },

  radioChange : function(event){
    /*
    const titleId = event.currentTarget.dataset.titleid
    const optionId = event.detail.value
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(option.id == optionId){
            option.selected = !option.selected
          }else{
            option.selected = false
          }
        }
        this.setData({
          survey
        })
        break
      }
    }*/
  },

  checkboxChange:function(event){
    const titleId = event.currentTarget.dataset.titleid
    const optionIdList = event.detail.value
    const titleList = this.data.titleList
    for(let i = 0; i < titleList.length; i++){
      let title = titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(optionIdList.includes(option.id)){
            option.selected = true
          }else{
            option.selected = false
          }
        }
        this.setData({
          titleList : titleList
        })
        break
      }
    }
  },

  inputChange:function(event){
    const titleId = event.currentTarget.dataset.titleid
    const text = event.detail.value
    const titleList = this.data.titleList
    for(let i = 0; i < titleList.length; i++){
      let title = titleList[i]
      if(titleId == title.id){
        title.text = text
        this.setData({
          titleList : titleList
        })
        break
      }
    }
    
  },

  submit:function(){
    if(this.data.isSubmitted){
      return
    }
    let checkResult = this.checkData()
    if(!checkResult.isLegal){
      wx.showToast({
        title: checkResult.message,
        icon : 'none'
      })
      return
    }
    let timeCounter = this.data.timeCounter
    clearInterval(timeCounter)
    this.commitToServer()
  },

  checkData:function(){
    let checkResult ={
      'isLegal':true,
      'message':''
    }
    let titleList = this.data.titleList
    if( titleList == null || titleList.length == 0){
      checkResult.isLegal = false
      checkResult.message = '当前问卷没有题目可以作答！'
      return checkResult;
    }
    for(let i = 0; i < titleList.length; i++){
      let title = titleList[i]
      if(util.isNull(title.required) || title.required == '0'){
        continue
      }
      if(title.titleType == '0' || title.titleType == '1'){ //single
        let isAnswered = false
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(option.selected){
            isAnswered = true
            break
          }
        }
        if(!isAnswered){
          checkResult.isLegal = false
          checkResult.message = '第'+title.titleSequence+'题为必答题，请作答'
          return checkResult
        }
      }
      
      if(title.titleType == '2' || title.titleType == '3'){ // 填空题或者文件上传题
        let isAnswered = false
        if(title.text.trim() != ''){
          isAnswered = true
        }
        if(!isAnswered){
          checkResult.isLegal = false
          checkResult.message = '第'+title.titleSequence+'题为必答题，请作答'
          return checkResult
        }
      }
    }
    return checkResult
  },
  
  commitToServer:function(){
    this.setData({
      submitBgColor:'after-submit-bgcolor',
      submitText:'提交中...',
      isSubmitted:true
    })
    wx.showLoading({
      title : '提交中...'
    })
    let titleList = this.data.titleList
    let surveyId = this.data.surveyId
    let submitter = this.data.submitter
    let timeCount = this.data.hour+':'+this.data.minute+':'+this.data.second
    let wxNickName = this.data.wxNickname
    let wxOpenId = this.data.wxOpenId
    surveyModel.submitContest(titleList,surveyId,submitter,timeCount,wxNickName,wxOpenId).then(res=>{
      wx.hideLoading()
      if(res.message != 'success'){
        wx.showToast({
          title: res.message,
          icon:'none'
        })
        this.setData({
          submitBgColor:'before-submit-bgcolor',
          submitText : '提交',
          isSubmitted : false
        })
        
      }else{
        this.setData({
          surveySubmit : res.data,
          isSuccess : true
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
      this.setData({
        submitBgColor:'before-submit-bgcolor',
        submitText : '提交',
        isSubmitted : false
      })
    })
    /*
    surveyModel.submitSurvey(this.data.survey, this.data.wxNickname, this.data.wxOpenId).then(res=>{
      wx.hideLoading()
      if(res.message != 'success'){
        wx.showToast({
          title: res.message,
          icon:'none'
        })
        this.setData({
          submitBgColor:'before-submit-bgcolor',
          submitText : '提交',
          isSubmitted : false
        })
        
      }else{
        this.setData({
          isSuccess : true
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
      this.setData({
        submitBgColor:'before-submit-bgcolor',
        submitText : '提交',
        isSubmitted : false
      })
    })*/
  },

  _authBtnLock : function(){
    if(this.data.isAuthorizing){
      return
    }
    this.setData({
      isAuthorizing : true
    })
  },

  _authBtnUnlock : function(){
    this.setData({
      isAuthorizing : false
    })
    
  },
  _beforeAnswer : function(){
    this.setData({
      beforeAnswer : true
    })
  },
  _afterAnswer : function(){
    this.setData({
      beforeAnswer : false
    })
  },
  _answered : function(){
    this.setData({
      beforeAnswer : false
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