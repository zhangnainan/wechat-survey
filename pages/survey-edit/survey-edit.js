import {SurveyModel} from '../../models/survey-p'
import {TitleModel} from '../../models/title';
let surveyModel = new SurveyModel();
let titleModel = new TitleModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    survey : Object,
    hiddenFlagMap : null,
    maskFlag : true,
    isLoading : true,
    isNavigateBack : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    wx.setNavigationBarTitle({
      title: '问卷编辑',
    })  
    const surveyId = options.surveyId
    this._getSurvey(surveyId)
    /*
    wx.showLoading()
    surveyModel.getSurvey(surveyId).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        this._initHiddenFlag(res.data)
        this.setData({
          survey:res.data,
          isLoading : false
        })
      }else{
        wx.showToast({
          title: '发生了一个错误',
        })
        this.setData({
          survey:null,
          isLoading : false
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
      this.setData({
        survey:null,
        isLoading : false
      })
    })
    */
    /*
    surveyModel.getSurvey(surveyId,(res)=>{
      wx.hideLoading()
      this._initHiddenFlag(res.data)
      this.setData({
        survey:res.data,
        isLoading : false
      })
    })
    */
  },

  containerTap : function(e){
    const id = e.currentTarget.dataset.id
    const hiddenFlag = this.data.hiddenFlagMap[id]
    let hiddenFlagMap = this.data.hiddenFlagMap
    let keys = Object.keys(hiddenFlagMap)
    for(let i = 0; i < keys.length; i++){
      if(keys[i] != id){
        hiddenFlagMap[keys[i]] = false
      }
    }
    hiddenFlagMap[id] = !hiddenFlag
    this.setData({
      hiddenFlagMap
    })
  },

  surveyNameEditTap : function(e){
    let surveyJson  = JSON.stringify(this.data.survey)
    wx.navigateTo({
      url: '/pages/survey-info-edit/survey-info-edit?survey='+surveyJson,
    })
  },

  titleEditTap : function(e){
    let title = e.currentTarget.dataset.title
    let titleJson = JSON.stringify(title)
    wx.navigateTo({
      url: '/pages/title-edit/title-edit?title='+titleJson,
    })
  },

  titleDeleteTap : function(e){
    let title = e.currentTarget.dataset.title
    let titleName = title.title
    let that = this
    wx.showModal({
      title : '提示',
      content : '确定删除 ['+titleName+']?',
      success(res){
        if(res.confirm){
          that._deleteTitle(title)
        }
      }
    })
  },

  addBtnTap : function(e){
    this.setData({
      maskFlag : false
    })
  },

  addTitleTap : function(e){
    const titleType = e.currentTarget.dataset.titleType
    let paramObj = {
      'titleType' : titleType,
      'surveyId'  : this.data.survey.id
    }
    let paramJson = JSON.stringify(paramObj)
    wx.navigateTo({
      url: '/pages/title-create/title-create?param='+paramJson,
    })
  },

  maskTap : function(e){
    this.setData({
      maskFlag : true
    })
  },
  _getSurvey : function(surveyId){
    wx.showLoading()
    surveyModel.getSurvey(surveyId).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        this._initHiddenFlag(res.data)
        this.setData({
          survey:res.data,
          isLoading : false
        })
      }else{
        wx.showToast({
          title: '发生了一个错误',
          icon: 'none'
        })
        this.setData({
          survey:null,
          isLoading : false
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
        icon: 'none'
      })
      this.setData({
        survey:null,
        isLoading : false
      })
    })
  },
  _initHiddenFlag : function(survey){
    let hiddenFlagMap = {}
    hiddenFlagMap[survey.id] = false
    const titleList = survey.titleList
    for(let i = 0; i < titleList.length; i++){
      let title = titleList[i]
      hiddenFlagMap[title.id] = false
    }
    this.setData({
      hiddenFlagMap
    })
  },

  _deleteTitle : function(title){
    wx.showLoading({
      title : '删除中...'
    })
    titleModel.deleteTitleModel(title).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        wx.showToast({
          title: '删除成功',
          icon :'none',
          duration : 2000
        })
        wx.showLoading()
        this._getSurvey(this.data.survey.id)
        /*
        surveyModel.getSurvey(this.data.survey.id,(res)=>{
          wx.hideLoading()
          this._initHiddenFlag(res.data)
          this.setData({
            survey:res.data,
            isLoading : false
          })
        })*/
      }else{
        wx.showToast({
          title: message,
          icon :'none'
        })
      }
    },res=>{
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon: 'none'
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
    let surveyId = this.data.survey.id
    if(surveyId != null && surveyId != undefined && surveyId != ''){
      console.log('reload survey')
      this._getSurvey(this.data.survey.id)
      /*
      wx.showLoading()
      surveyModel.getSurvey(this.data.survey.id,(res)=>{
        wx.hideLoading()
        console.log(res.data)
        this._initHiddenFlag(res.data)
        this.setData({
          survey:res.data,
          isLoading : false,
          isNavigateBack : false
        })
      })*/
    }
    /*
    if(this.data.isNavigateBack){
      wx.showLoading()
      surveyModel.getSurvey(this.data.survey.id,(res)=>{
        wx.hideLoading()
        console.log(res.data)
        this._initHiddenFlag(res.data)
        this.setData({
          survey:res.data,
          isLoading : false,
          isNavigateBack : false
        })
      })
    }*/
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