import {SurveyModel} from '../../models/survey-p'
let surveyModel = new SurveyModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyId : String,
    surveySummary : Object,
    surveySubmitDetailList : Object,
    surveyStatistics : Object,
    currentTab : 0,
    unfoldInx: 0,
    maskHiddenFlag:true,
    statisticTitle : Object,
    byNameStatistics : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    wx.setNavigationBarTitle({
      title: '问卷调查结果',
    })
    const surveyId = options.surveyId
    this.setData({
      surveyId
    })
    this._getSurveySummary()
  },
  navItemTap : function(event){
    
    const idx = event.currentTarget.dataset.idx
    this.setData({
      currentTab : idx
    })
    if(this.data.currentTab == 0){
      this._getSurveySummary()
    }else{
      this._getSurveySubmitDetail()
    }
  },
  moreTap : function(event){
    this.setData({
      maskHiddenFlag:false
    })
  },
  maskTap:function(event){
    this.setData({
      maskHiddenFlag:true
    })
  },
  textSummaryViewTap : function(event){
    const answerList = event.target.dataset.answerlist
    wx.navigateTo({
      url: `/pages/text-summary/text-summary?answerList=`+JSON.stringify(answerList)
    })
  },
  textNameStatisticsTap : function(event){
    const currentTapTitle = event.target.dataset.currenttaptitle
    let data = {
      'currentTapTitle' : currentTapTitle,
      'statisticTitle' : this.data.statisticTitle
    }
    wx.navigateTo({
      url: `/pages/text-name-statistics/text-name-statistics?params=`+JSON.stringify(data)
    })
  },
  
  nameSelectionTap : function(event){
    wx.navigateTo({
      url: '/pages/title-selection/title-selection?surveyId='+this.data.surveyId,
    })
  },
  modifyConditionTap : function(event){
    wx.navigateTo({
      url: '/pages/title-selection/title-selection?surveyId='+this.data.surveyId,
    })
  },
  clearConditionTap : function(event){
    this.setData({
      byNameStatistics : false
    })
    this._getSurveySummary()
  },

  openDetail: function(event){
    this.setData({
      unfoldInx: event.currentTarget.dataset.index
    });
  },
  closeDetail: function (event) {
    this.setData({
      unfoldInx: -1
    });
  },
  _getSurveySummary : function(){
    surveyModel.getSurveySummary(this.data.surveyId).then(res=>{
      this.setData({
        surveySummary:res.data
      })
    },res=>{
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon : 'none'
      })
      /*
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })*/
    })
    /*
    surveyModel.getSurveySummary(this.data.surveyId,(res)=>{
      this.setData({
        surveySummary:res.data
      })
    })
    */ 
  },
  _getSurveySubmitDetail : function(){
    surveyModel.getSurveySubmitDetail(this.data.surveyId).then(res=>{
      this.setData({
        surveySubmitDetailList:res.data
      })
    },res=>{
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon : 'none'
      })
      /*
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })
      */
    })
    /*
    surveyModel.getSurveySubmitDetail(this.data.surveyId,(res)=>{
      this.setData({
        surveySubmitDetailList:res.data
      })
    })
    */
  },
  _getSurveyAll : function(){
    
    const statics = surveyModel.getSurveyStatics(this.data.surveyId,this.data.statisticTitle.id)
    const submitDetail = surveyModel.getSurveySubmitDetail(this.data.surveyId)
    const summary = surveyModel.getSurveySummary(this.data.surveyId)
    Promise.all([statics,submitDetail,summary]).then(res=>{
      this.setData({
        surveyStatistics : res[0].data,
        surveySubmitDetailList : res[1].data,
        surveySummary : res[2].data      
      })
    },res=>{
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon : 'none'
      })
      /*
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })*/
    })
    /*
    surveyModel.getSurveyStatics(this.data.surveyId,this.data.statisticTitle.id,(res)=>{
      this.setData({
        surveyStatistics:res.data
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
    console.log('byNameStatistics')
    if(this.data.byNameStatistics){
      console.log(this.data.statisticTitle)
      this._getSurveyAll()
    }
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