import {SurveyModel} from '../../models/survey-p'

let surveyModel = new SurveyModel();
let SurveyType = require('../../common/js/SurveyType.js')
let util = require('../../common/js/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    survey : Object,
    surveyNameLabel : '',
    submitBgColor: 'before-submit-bgcolor',
    disabled : false,
    saveBtnText : '保 存'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let survey = JSON.parse(options.survey)
    this.setData({
      survey
    })
    if(SurveyType.isQuestionnaire(survey.surveyType)){
      wx.setNavigationBarTitle({
        title: '问卷信息编辑',
      })
      this.setData({
        surveyNameLabel : '问卷名称'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '知识竞赛信息编辑',
      })
      this.setData({
        surveyNameLabel : '知识竞赛名称'
      })
    }
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

  answerTitleNumInput : function(e){
    let answerTitleNum =  e.detail.value
    let survey = this.data.survey
    survey.answerTitleNum = answerTitleNum
    this.setData({
      survey
    })
  },

  scoreScaleInput : function(e){
    let scoreScale =  e.detail.value
    let survey = this.data.survey
    survey.scoreScale = scoreScale
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

    if(SurveyType.isKnowledgeCompetition(this.data.survey.surveyType)){
      const answerTitleNum = this.data.survey.answerTitleNum
      if(util.isNull(answerTitleNum)|| answerTitleNum <=0){
        wx.showToast({
          title: '答题数设置非法!',
          icon : 'none'
        })
        return false
      }
    }

    if(SurveyType.isKnowledgeCompetition(this.data.surveyType)){
      let scoreScale = this.data.survey.scoreScale
      if(util.isNull(scoreScale) ||  scoreScale <=0 ){
        wx.showToast({
          title: '分制设置非法!',
          icon : 'none'
        })
        return false
      }
      if(scoreScale%this.data.survey.answerTitleNum != 0){
        wx.showToast({
          title: '分制必须被答题数整除!',
          icon : 'none'
        })
        return false
      }
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