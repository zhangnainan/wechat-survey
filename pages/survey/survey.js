import {SurveyModel} from '../../models/survey'
let surveyModel = new SurveyModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyList:[],
    maskFlag:true,
    currentSurvey:Object,
    submitBgColor : 'before-submit-bgcolor',
    isLoading : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSurveyList()
  },

  onTap:function(event){
    this.setData({
      maskFlag:false,
      currentSurvey:event.currentTarget.dataset.survey
    })
    /*
    const surveyId = event.currentTarget.dataset.survey.id
    wx.navigateTo({
      url: `/pages/survey-detail/survey-detail?surveyId=${surveyId}`,
    })*/
  },
  maskTap:function(event){
    this.setData({
      maskFlag:true
    })
  },
  editTap:function(event){
    const surveyId = this.data.currentSurvey.id
    wx.navigateTo({
      url: `/pages/survey-edit/survey-edit?surveyId=${surveyId}`,
    })
  },
  shareTap:function(event){
    this.onShareAppMessage()
  },
  resultTap:function(event){
    const surveyId = this.data.currentSurvey.id
    /*
    wx.navigateTo({
      url: `/pages/tab/tab`,
    }) */
    
    wx.navigateTo({
      url: `/pages/survey-summary/survey-summary?surveyId=${surveyId}`,
    })
  },

  viewTap : function(event){
    const surveyId = this.data.currentSurvey.id
    wx.navigateTo({
      url: `/pages/survey-detail/survey-detail?surveyId=${surveyId}`,
    })
  },

  createNewSurveyTap : function(event){
    wx.navigateTo({
      url: `/pages/survey-create/survey-create`,
    })
  },

  deleteTap:function(event){

  },
  _getSurveyList : function(){
    surveyModel.getSurveyList((res)=>{
      this.setData({
        surveyList:res.data,
        isLoading : false
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
    this._getSurveyList()
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function(){

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
    console.log('onShareAppMessage')
    return {
      title:this.data.currentSurvey.surveyName,
      imageUrl:'../survey/images/survey1.png',
      path:'pages/survey-detail/survey-detail?surveyId='+this.data.currentSurvey.id
    }
  }
})