import {SurveyModel} from '../../models/survey-p'

let surveyModel = new SurveyModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitBgColor: 'before-submit-bgcolor',
    surveyName : '',
    surveyNotes : '',
    disabled : false,
    saveBtnText : '保 存'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    surveyModel.saveSurvey(this.data.surveyName,this.data.surveyNotes).then(res=>{
      let message = res.message
      console.log(message)
      if(message == 'success'){
        const surveyId = res.data.id
        wx.showToast({
          title: '保存成功',
          icon : 'none',
          duration : 3000
        })
        wx.redirectTo({
          url: '/pages/survey-edit/survey-edit?surveyId='+surveyId,
        })
      }else{
        if(message == 'error.exists'){
          wx.showToast({
            title: this.data.surveyName+'已经存在！',
            icon : 'none'
          })
        }else{
          wx.showToast({
            title: message,
            icon : 'none'
          })
        }
        this._btnReset()
      }
      
    })

  },

  surveyNameInput : function(e){
    let surveyName =  e.detail.value
    this.setData({
      surveyName
    })
  },

  surveyNotesInput : function(e){
    let surveyNotes = e.detail.value
    this.setData({
      surveyNotes
    })
  },

  checkDataIsLegal : function(){
    const surveyName = this.data.surveyName
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