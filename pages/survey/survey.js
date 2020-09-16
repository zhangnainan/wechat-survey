import {SurveyModel} from '../../models/survey-p'
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
   
    wx.setNavigationBarTitle({
      title: '问卷列表',
    })
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
    let that = this
    let surveyId = this.data.currentSurvey.id
    wx.showModal({
      title : '提示',
      content : '确定删除 ['+this.data.currentSurvey.surveyName+']?',
      success(res){
        if(res.confirm){
          that._deleteSurvey(surveyId)
        }
      }
    })
  },
  _deleteSurvey : function(surveyId){
    wx.showLoading({
      title : '删除中...'
    })
    surveyModel.deleteSurvey(surveyId).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        wx.showToast({
          title: '删除成功',
          icon :'none',
          duration : 2000
        })
        this._getSurveyList()
      }else{
        wx.showToast({
          title: message,
          icon :'none',
          duration : 2000
        })
      }
    },res=>{
      
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon: 'none'
      })
    })

  },
  _getSurveyList : function(){
    wx.showLoading({
      title: '加载中...',
    })
    const userId = getApp().globalData.userId
    surveyModel.getSurveyList(userId).then((res)=>{
      wx.hideLoading()
      if(res.data != null && res.data != undefined ){
        this.setData({
          surveyList:res.data,
          isLoading : false
        })
      }else{
        this.setData({
          surveyList:[],
          isLoading : false
        })
      }
    },(res)=>{
      
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon : 'none'
      })
    })
    /*
    surveyModel.getSurveyList((res)=>{
      this.setData({
        surveyList:res.data,
        isLoading : false
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
    return {
      title:this.data.currentSurvey.surveyName,
      imageUrl:'../survey/images/survey1.png',
      path:'pages/survey-detail/survey-detail?surveyId='+this.data.currentSurvey.id
    }
  }
})