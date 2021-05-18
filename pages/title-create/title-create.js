import util from '../../common/js/util'
import {TitleModel} from '../../models/title'

let SurveyType = require('../../common/js/SurveyType.js')
let titleModel = new TitleModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add_btn_text : '保 存',
    disabled : false,
    titleType : String,
    surveyType : String,
    surveyId : String,
    optionList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param = JSON.parse(options.param)
    let titleType = param.titleType
    let surveyType = param.surveyType
    if(titleType == 'single'){
      wx.setNavigationBarTitle({
        title: '单选题',
      })
    }
    if(titleType == 'multiple'){
      wx.setNavigationBarTitle({
        title: '多选题',
      })
    }
    if(titleType == 'text'){
      wx.setNavigationBarTitle({
        title: '填空题',
      })
    }
    if(titleType == 'image'){
      wx.setNavigationBarTitle({
        title: '图片上传题',
      })
    }
    let surveyId = param.surveyId
    this.setData({
      titleType : titleType,
      surveyId : surveyId,
      surveyType : surveyType
    })

    if(titleType == 'single' || titleType == 'multiple'){
      let optionList = []
      if(SurveyType.isKnowledgeCompetition(surveyType)){
        for(let i = 0; i < 2; i++){
          optionList.push({
            'optionName' : '',
            'corrected' : false
          })
        }
      }else{
        for(let i = 0; i < 2; i++){
          optionList.push({
            'optionName' : ''
          })
        }
      }
      this.setData({
        optionList
      })
    }
  },

  radioGroupChange : function(event){
    console.log('radio group change ')
    let index = event.detail.value
    let optionList = this.data.optionList

    for(let i = 0; i < optionList.length; i++){
      let option = optionList[i]
      if(index == i){
        option.corrected = !option.corrected
      }else{
        option.corrected = false
      }
    }
    this.setData({
      optionList : optionList
    })
  },

  checkboxGroupChange : function(event){
    let indexList = event.detail.value
    let optionlList = this.data.optionList
    for(let i = 0; i < indexList.length; i++){
      let optionModel = optionModelList[i]
      if(indexList.includes(i)){
        optionlList[i].corrected = true
      }else{
        optionlList[i].corrected = false
      }
    }
    this.setData({
      optionList : optionList
    })
  },

  titleAddSubmit : function(e){
    this.setData({
      disabled : true,
      add_btn_text : '保存中...'
    })
    let values = e.detail.value
    if(values.title == null ||  values.title == undefined || values.title.trim() == "" ){
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
      return
    }

    if(this.data.titleType == 'single' || this.data.titleType == 'multiple'){
      for(let i = 0; i < this.data.optionList.length; i++){
        let optionName = "option"+i
        if(values[optionName] == null || values[optionName] == undefined || values[optionName] == ""){
          this.setData({
            disabled : false,
            add_btn_text : '保 存'
          })
          wx.showToast({
            title: '选项'+(i+1)+'不能为空',
            icon: 'none'
          })
          return
        }
      }

      if(SurveyType.isKnowledgeCompetition(this.data.surveyType)){
        let optionList = this.data.optionList
        let hasAnswer = false
        for(let i = 0; i < optionList.length; i++){
          let option = optionList[i]
          if(option.corrected){
            hasAnswer = true
          }
        }
        if(!hasAnswer){
          this.setData({
            disabled : false,
            add_btn_text : '保 存'
          })
          wx.showToast({
            title: '未设置答案',
            icon: 'none'
          })
          return
        }
      }
    }
    let titleType = ''
    if(this.data.titleType == 'single'){
      titleType = '0'
    }else if(this.data.titleType == 'multiple'){
      titleType = '1'
    }else if(this.data.titleType == 'text'){
      titleType = '2'
    }else{
      titleType = '3'
    }
    let required = values.required
    let isNameColumn = values.isNameColumn
    
    let title = {
      'title' : values.title,
      'titleType' : titleType,
      'required' : required ? '1' : '0',
      'isNameColumn' : isNameColumn ? '1' : '0',
      'surveyId' : this.data.surveyId
    }


    if(titleType == '0' || titleType == '1'){
      title.optionModelList = this.data.optionList
    }
    if(titleType == '2' && SurveyType.isKnowledgeCompetition(this.data.SurveyType)){
      let answer = values.answer
      console.log('answer : '+answer)
      if(util.isNull(answer)){
        this.setData({
          disabled : false,
          add_btn_text : '保 存'
        })
        wx.showToast({
          title: '未设置答案',
          icon: 'none'
        })
        return
      }
      let answerModelList = []
      answerModelList.push({
        'answer' : answer
      })
      title.answerModelList = answerModelList
    }
    
    if(SurveyType.isKnowledgeCompetition(this.data.surveyType)){
      this.saveTitleAnswerModel(title)
    }else{
      this.saveTitleModel(title)
    }
    
  },

  saveTitleModel : function(title){
    titleModel.saveTitleModel(title).then(res=>{
      this._saveSuccessCallback(res)
    },res=>{
      this._saveFailCallback(res)
    })
  },

  saveTitleAnswerModel : function(title){
    titleModel.saveTitleAnswerModel(title).then(res=>{
      this._saveSuccessCallback(res)
    },res=>{
      this._saveFailCallback(res)
    })
  },

  deleteOptionTap : function(e){
    let index = e.currentTarget.dataset.index
    if(this.data.optionList.length <= 2){
      wx.showToast({
        title: '不能删除，至少保留两个选项',
        icon: 'none'
      })
      return
    }
    this.data.optionList.splice(index,1)
    this.setData({
      optionList : this.data.optionList
    })
    /*
    let optionList = this.data.optionList
    optionList.splice(index,1)
    this.setData({
      optionList : optionList
    })
    */
  },
  addOptionTap : function(e){
    let optionList = this.data.optionList
    optionList.push({
      'optionName' : ''
    })
    this.setData({
      optionList
    })
  },
  optionNameInput : function(e){
    
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    let optionList = this.data.optionList
    optionList[index].optionName = value
    this.setData({
      optionList
    })
  },
  _saveSuccessCallback : function(res){
    let message = res.message
      if(message == "success"){
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.showToast({
          title: message,
          icon : 'none'
        })
        this.setData({
          disabled : false,
          add_btn_text : '保 存'
        })
      }
  },
  _saveFailCallback : function(res){
    wx.showToast({
      title: '发生了一个错误，请联系管理员',
      icon : 'none'
    })
    this.setData({
      disabled : false,
      add_btn_text : '保 存'
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