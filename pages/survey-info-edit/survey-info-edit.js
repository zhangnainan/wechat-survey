import {SurveyModel} from '../../models/survey-p'

let surveyModel = new SurveyModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    survey : Object,
    submitBgColor: 'before-submit-bgcolor',
    disabled : false,
    saveBtnText : '保 存'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '问卷信息编辑',
    })
    let survey = JSON.parse(options.survey)
    this.setData({
      survey
    })
  }, 

  saveSurveyTap : function(e){
    this.setData({
      disabled : true,
      saveBtnText : '提交中...'
    })
    let isLegal = this.checkDataIsLegal()

    if(!isLegal){
      this._btnReset()
      return
    }

    surveyModel.updateSurvey(this.data.survey).then(res=>{
      let message = res.message
      if(message == 'success'){
        wx.showToast({
          title: '保存成功',
          icon : 'none',
          duration : 3000
        })
        wx.navigateBack({
          delta:1
        })
      }else{
        if(message == 'error.exists'){
          wx.showToast({
            title: this.data.survey.surveyName+'已经存在！',
            icon : 'none'
          })
        }else{
          wx.showToast({
            title: message,
            icon : 'none'
          })
        }
        
      }
      this._btnReset()
    },res=>{
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon : 'none'
      })
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })
    })

  },

  surveyNameInput : function(e){
    let surveyName =  e.detail.value
    let survey = this.data.survey
    survey.surveyName = surveyName
    this.setData({
      survey
    })
  },

  surveyNotesInput : function(e){
    let surveyNotes = e.detail.value
    let survey = this.data.survey
    survey.notes = surveyNotes
    this.setData({
      survey
    })
  },

  checkDataIsLegal : function(){
    const surveyName = this.data.survey.surveyName
    if(surveyName == null || surveyName == undefined || surveyName.trim() == '' ){
      wx.showToast({
        title: '问卷名称为必填选项！',
        icon : 'none'
      })
      return false
    }
    return true
  },

  _btnReset : function(){
    this.setData({
      disabled : false,
      saveBtnText : '保 存'
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