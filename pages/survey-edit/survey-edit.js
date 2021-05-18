import {SurveyModel} from '../../models/survey-p'
import {TitleModel} from '../../models/title';
let SurveyType = require('../../common/js/SurveyType.js')
let surveyModel = new SurveyModel();
let titleModel = new TitleModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyId : String,
    surveyType : String,
    survey : Object,
    /** new begin */
    titleList : [],
    pageSize : 5,
    start : 0,
    titleCount : 0,
    /** new end */
    hiddenFlagMap : null,
    maskFlag : true,
    isLoading : true,
    loadingCenter : false,
    loadMore : false,
    items: [
      {
        "iconPath": "./images/add.png",
        "text": "题目"
      },
      {
        "iconPath": "./images/setting.png",
        "text": "设置"
      }
    ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    let surveyId = options.surveyId
    let surveyType = options.surveyType
    this.setData({
      surveyId : surveyId,
      surveyType : surveyType
    })

    if(SurveyType.isQuestionnaire(surveyType)){
      wx.setNavigationBarTitle({
        title: '问卷编辑',
      }) 
    }else{
      wx.setNavigationBarTitle({
        title: '知识竞赛编辑',
      }) 
    }
     
    
    //this._getSurvey(surveyId)
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
    let survey = this.data.survey
    let surveyJson = JSON.stringify(survey)
    wx.navigateTo({
      url: '/pages/survey-info-edit/survey-info-edit?survey='+surveyJson,
    })
  },

  titleEditTap : function(e){
    let title = e.currentTarget.dataset.title
    let titleJson = JSON.stringify(title)
    console.log('titleJson:'+titleJson)
    wx.navigateTo({
      url: '/pages/title-edit/title-edit?title='+titleJson+'&surveyType='+this.data.surveyType,
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
    console.log(titleType)
    if(titleType == 'file-import'){
      wx.navigateTo({
        url: '/pages/contest-title-import/contest-title-import?survey='+JSON.stringify(this.data.survey),
      })
    }else{
      let paramObj = {
        'titleType' : titleType,
        'surveyId'  : this.data.survey.id,
        'surveyType' : this.data.surveyType
      }
      let paramJson = JSON.stringify(paramObj)
      wx.navigateTo({
        url: '/pages/title-create/title-create?param='+paramJson,
      })
    }
  },

  maskTap : function(e){
    this.setData({
      maskFlag : true
    })
  },

  bottomBtnsTap : function(e){
    let currentIdx = e.currentTarget.dataset.current
    if(currentIdx == 0){
      this.addBtnTap()
    }else{
      let jsonData = JSON.stringify(this.data.survey)
      wx.navigateTo({
        url: '/pages/survey-settings/survey-settings?surveyJson='+jsonData,
      })
    }
  },

  _isExcel : function(fileName){
    let index = fileName.indexOf('.')
    let fileExtension = fileName.slice(index+1,fileName.length)
    if(!(fileExtension == 'xls' || fileExtension == 'xlsx')){
      return false
    }
    return true
  },

  _getSurvey : function(surveyId){
    /*
    wx.showLoading({
      title : '加载中...'
    })*/
    
    surveyModel.getSurvey(surveyId).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        if(this.data.loadingCenter){
          this.setData({
            loadingCenter : false
          })
        }
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

  _loadMoreTitleList : function(surveyId, surveyType, pageSize, start){
    titleModel.getTitlePage(surveyId,surveyType,pageSize,start).then(res=>{
      if(res.message == 'success'){
        let titleList = this.data.titleList.concat(res.data)
        this.setData({
          titleList : titleList,
        })
      }else{
        wx.showToast({
          title: '发生了一个错误',
          icon: 'none'
        })
      }
      this.setData({
        loadMore : false
      })
    },res=>{
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
        icon: 'none'
      })
      this.setData({
        loadMore : false
      })
    })
  },

  _getSurveyInfo : function(surveyId, surveyType, pageSize, start){
  
    const titleCount = titleModel.getTitleCount(surveyId)
    const titlePage = titleModel.getTitlePage(surveyId,surveyType,pageSize,start)
    const surveyInfo = surveyModel.getSurveyInfo(surveyId)

    Promise.all([titleCount,titlePage,surveyInfo]).then(res=>{
      if(this.data.loadingCenter){
        this.setData({
          loadingCenter : false
        })
      }
      
      let titleCount = res[0].data
      let titleList = this.data.titleList.concat(res[1].data)
      let survey = res[2].data    
      this._initHiddenFlag(survey,titleList)
      this.setData({
        titleCount : titleCount,
        titleList : titleList,
        survey : survey,
        isLoading : false      
      })

      
    },res=>{
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
        icon: 'none'
      })
      this.setData({
        isLoading : false
      })
    })
  },

  _initHiddenFlag : function(survey, titleList){
    let hiddenFlagMap = {}
    hiddenFlagMap[survey.id] = false
    
    for(let i = 0; i < titleList.length; i++){
      let title = titleList[i]
      hiddenFlagMap[title.id] = false
    }
    this.setData({
      hiddenFlagMap
    })
  },

  /*
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
  */

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
        this.setData({
          loadingCenter : true,
          titleList : []
        })
        this._getSurveyInfo(this.data.survey.id, this.data.surveyType,this.data.pageSize,0)
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
  /*
  const statics = surveyModel.getSurveyStatics(this.data.surveyId,this.data.statisticTitle.id)
  const submitDetail = surveyModel.getSurveySubmitDetail(this.data.surveyId)
  const summary = surveyModel.getSurveySummary(this.data.surveyId)
  Promise.all([statics,submitDetail,summary]).then(res=>{
    this.setData({
      surveyStatistics : res[0].data,
      surveySubmitDetailList : res[1].data,
      surveySummary : res[2].data      
    })
    wx.hideLoading()
  },res=>{
    wx.hideLoading()
    wx.showToast({
      title: '发生了一个错误，请联系管理员',
      icon : 'none'
    })
  })*/

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.setData({
      loadingCenter : true,
      titleList : []
    })
    let surveyId = this.data.surveyId
    let surveyType = this.data.surveyType
    let pageSize = this.data.pageSize
    this._getSurveyInfo(surveyId,surveyType,pageSize,0)
  
    /*
    let that = this
    if(surveyId != null && surveyId != undefined && surveyId != ''){
      setTimeout(function(){
        that._getSurvey(surveyId)
      },1000)
      
    }
    */
   
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
    if(this.data.loadMore){
      return
    }
    if(this.data.titleList.length >= this.data.titleCount){
      return
    }
    this.setData({
      loadMore : true
    })
    let surveyId = this.data.surveyId
    let surveyType = this.data.surveyType
    let pageSize = this.data.pageSize
    let start = this.data.titleList.length
    this._loadMoreTitleList(surveyId,surveyType,pageSize,start)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})