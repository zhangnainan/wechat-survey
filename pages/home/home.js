// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageDict : {
      'questionnaire' : '/pages/survey/survey',
      'knowledge' : '/pages/knowledge/'
   }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  itemTap : function(event){
    let surveyType = event.currentTarget.dataset.surveytype
    wx.navigateTo({
      url: '/pages/survey/survey?surveyType='+surveyType,
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