import {SurveyModel} from '../../models/survey'
let surveyModel = new SurveyModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    survey:Object,
    isSubmitted : false,
    submitBgColor:'before-submit-bgcolor',
    submitText:'提交',
    isSuccess:false,
    loading : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const surveyId = options.surveyId
    wx.showLoading()
    surveyModel.getSurvey(surveyId,(res)=>{
      this.setData({
        survey:res.data,
        loading : false
      })
      wx.hideLoading()
    })
   
  },

  radioChange:function(event){
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