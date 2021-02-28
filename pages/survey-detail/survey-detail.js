import {SurveyModel} from '../../models/survey-p'
let surveyModel = new SurveyModel();
let util = require('../../common/js/util.js')
let dateFormat = require('../../common/js/dateFormat.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    surveyId : '',
    survey:Object,
    isSubmitted : false,
    submitBgColor : 'before-submit-bgcolor',
    submitText : '提交',
    isSuccess : false,
    isNotStart : false,
    isTimeOut : false,
    loading : true,
    /* test */
    ismask : Object,
    wxNickname : '',
    res : Object
  },

  
  closeHide:function(e){
    this.setData({
      ismask: 'none'
    });
    console.log('ismask : '+this.data.ismask)
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
    })
    const surveyId = options.surveyId
    this.setData({
      surveyId : surveyId
    })
    this.getSettingAndLoadData()
  },
  bindGetUserInfo : function(res){
    this.getSettingAndLoadData()
  },
  getSettingAndLoadData : function(){
    let that = this
    wx.getSetting({
      success: res => {        
        if (res.authSetting['scope.userInfo']){
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框          
          wx.getUserInfo({
            success: res => {
              that.setData({
                ismask: 'none',
                wxNickname : res.userInfo.nickName,
                res : res
              });
              that.loadSurveyData(this.data.surveyId, that.data.wxNickname)
            }
          })
        }else{
          this.setData({
            ismask: 'block'
          });
        }
      }
    });
  },

  loadSurveyData : function(surveyId, wxNickname){
    wx.showLoading({
      title : '加载中...'
    })
    
    surveyModel.loadSurveyByIdAndUserNickName(surveyId, wxNickname).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        wx.setNavigationBarTitle({
          title: res.data.surveyName,
        })
        let currentDateTime = dateFormat.dateFormat('yyyy-MM-dd hh:mm:ss', new Date())
        let beginDateTime = res.data.beginDateTime
        let endDateTime = res.data.endDateTime
        if(!util.isNull(beginDateTime) && !util.isNull(endDateTime)){
          this.setData({
            survey:res.data,
            loading : false,
            isNotStart : beginDateTime > currentDateTime ? true : false,
            isTimeOut : endDateTime < currentDateTime ? true : false
          })
        }else{
          this.setData({
            survey:res.data,
            loading : false
          })
        }
      }else{
        wx.showToast({
          title: '服务端发生了错误',
        })
        this.setData({
          loading : false
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
    })
  },

  radioChange : function(event){
    const titleId = event.currentTarget.dataset.titleid
    const optionId = event.detail.value
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(option.id == optionId){
            option.selected = true
          }else{
            option.selected = false
          }
        }
      }
    }
    this.setData({
      survey
    })
    
  },

  checkboxChange:function(event){
    const titleId = event.currentTarget.dataset.titleid
    const optionIdList = event.detail.value
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(optionIdList.includes(option.id)){
            option.selected = true
          }else{
            option.selected = false
          }
        }
      }
    }
    this.setData({
      survey
    })
      
  },

  inputChange:function(event){
    const titleId = event.currentTarget.dataset.titleid
    const text = event.detail.value
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        title.text = text
      }
    }
    this.setData({
      survey
    })
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
    this.commitToServer()
  },

  checkData:function(){
    let checkResult ={
      'isLegal':true,
      'message':''
    }
    const survey = this.data.survey
    if( survey.titleList == null || survey.titleList.length == 0){
      checkResult.isLegal = false
      checkResult.message = '当前问卷没有题目可以作答！'
      return checkResult;
    }
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(title.required == '0'){
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
      
      if(title.titleType == '2'){ // text
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
    
    surveyModel.submitSurvey(this.data.survey, this.data.wxNickname).then(res=>{
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
    })
    /*
    surveyModel.submitSurvey(this.data.survey,(res)=>{
      console.log(res)
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
    },(err)=>{
      console.log('err')
      console.log(err)
      this.setData({
        submitBgColor:'before-submit-bgcolor',
        submitText : '提交',
        isSubmitted : false
      })
    })*/
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