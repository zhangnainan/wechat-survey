import {SurveyModel} from '../../models/survey'
let surveyModel = new SurveyModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveySummary : Object,
    currentTab : 0,
    summaryCountCls : "nav-item is-active",
    summaryDetailCls:"nav-item"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    const surveyId = options.surveyId
    surveyModel.getSurveySummary(surveyId,(res)=>{
      this.setData({
        surveySummary:res.data
      })
    })
  },
  navItemTap : function(event){
    
    const idx = event.currentTarget.dataset.idx
    this.setData({
      currentTab : idx
    })
    
  },
  textSummaryViewTap : function(event){
    const answerList = event.target.dataset.answerlist
    wx.navigateTo({
      url: `/pages/text-summary/text-summary?answerList=`+JSON.stringify(answerList)
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