import {SurveyModel} from '../../models/survey-p'
import {config} from '../../config.js'
let surveyModel = new SurveyModel();
let util = require('../../common/js/util.js')
let dateFormat = require('../../common/js/dateFormat.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    surveyId : '',
    survey:Object,
    isSubmitted : false,
    submitBgColor : 'before-submit-bgcolor',
    submitText : '提交',
    isSuccess : false,
    isNotStart : false,
    isTimeOut : false,
    loading : true,
    /* test */
    ismask : Object,
    wxNickname : '',
    res : Object,

    photos : Array,
    imageUploading : false,
    progress : 0,
    imgVisitUrl : config.img_visit_url,
    wxOpenId : String,
    canIUseGetUserProfile : false,
    isAuthorizing : false
  },

  
  closeHide:function(e){
    this.setData({
      ismask: 'none'
    });
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
    })
    
    const surveyId = options.surveyId
    let canIUseGetUserProfile = false
    if(wx.getUserProfile){
      canIUseGetUserProfile = true
    }
    this.setData({
      surveyId : surveyId,
      canIUseGetUserProfile : canIUseGetUserProfile
    })
    this.login()
    /*
    let wxOpenId = wx.getStorageSync('zjwjOpenId') 
    if(!util.isNull(wxOpenId)){      
      this.setData({
        wxOpenId : wxOpenId
      })
      this.getSettingAndLoadData()
    }else{
      this.login()
    }
    */
    
    
  //  this.getSettingAndLoadData()
  },
  login : function(){
    wx.showLoading({
      title : '加载中...',
      icon : 'none'
    })
    let that = this
    this._authBtnLock()
    wx.login({
      complete: (res) => {
        let errMsg = res.errMsg
        if(errMsg == 'login:ok'){
          that.getOpenId(res.code)
        }else{
          wx.showToast({
            title: '请检查网络是否连接',
            icon : 'none'
          })
        }
      },
    })
  },

  getOpenId : function(code){
    surveyModel.getOpenId(code).then(res=>{
      let message = res.message
      if(message == 'success'){
        let wxOpenId = res.data
        this._authBtnUnlock()
        this.setData({
          wxOpenId : wxOpenId
        })
        //wx.setStorageSync('zjwjOpenId', wxOpenId)
        wx.hideLoading()
        //console.log('openId getSettingAndLoadData')
        if(!this.data.canIUseGetUserProfile){
          this.getSettingAndLoadData()
        }
      }else{
        wx.showToast({
          title: '服务端发生了错误',
        }) 
      }
    },res=>{
    //  wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
    })
  },

  bindGetUserInfo : function(res){
    if(this.data.isAuthorizing){
      return
    }
    this._authBtnLock()
    //console.log('after auth btn lock')
    //console.log('bindGetUserInfo getSettingAndLoadData')
    this.getSettingAndLoadData()
  },

  getSettingAndLoadData : function(){
    let that = this
    if(!this.data.canIUseGetUserProfile){
      wx.getSetting({
        success: res => {        
          //console.log('scope.userInfo:'+res.authSetting['scope.userInfo'])
          if (res.authSetting['scope.userInfo']){
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框                      
            console.log('getUserInfo')
            wx.getUserInfo({
              success: res => {
                that.setData({
                  ismask: 'none',
                  wxNickname : res.userInfo.nickName,
                  res : res
                });
                that.loadSurveyData(this.data.surveyId, that.data.wxNickname, that.data.wxOpenId)
              }
            })
            
          }else{
            this.setData({
              ismask: 'block'
            });
          }
        }
      });
    }else{
      wx.getUserProfile({
        desc: '用于获取昵称', 
        success: (res) => {
          that.setData({
            ismask: 'none',
            wxNickname : res.userInfo.nickName,
            res : res
          });
          that.loadSurveyData(this.data.surveyId, that.data.wxNickname, that.data.wxOpenId)
        }
      })
    }
     /*
    wx.getSetting({
      success: res => {        
        //console.log('scope.userInfo:'+res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']){
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框          
          if(that.data.canIUseGetUserProfile){
            //console.log('canIUseGetUserProfile')
            wx.getUserProfile({
              desc: '用于获取昵称', 
              success: (res) => {
                that.setData({
                  ismask: 'none',
                  wxNickname : res.userInfo.nickName,
                  res : res
                });
                that.loadSurveyData(this.data.surveyId, that.data.wxNickname, that.data.wxOpenId)
              }
            })
          }else{
            console.log('getUserInfo')
            wx.getUserInfo({
              success: res => {
                that.setData({
                  ismask: 'none',
                  wxNickname : res.userInfo.nickName,
                  res : res
                });
                that.loadSurveyData(this.data.surveyId, that.data.wxNickname, that.data.wxOpenId)
              }
            })
          }
        }else{
          this.setData({
            ismask: 'block'
          });
        }
      }
    });*/
  },

  loadSurveyData : function(surveyId, wxNickname, wxOpenId){
    this._authBtnUnlock()
    wx.showLoading({
      title : '加载中...'
    })
    
    surveyModel.loadSurveyByIdAndUserNickName(surveyId, wxNickname, wxOpenId).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        wx.setNavigationBarTitle({
          title: res.data.surveyName,
        })
        let currentDateTime = dateFormat.dateFormat('yyyy-MM-dd hh:mm:ss', new Date())
        let beginDateTime = res.data.beginDateTime
        let endDateTime = res.data.endDateTime
        if(!util.isNull(beginDateTime) && !util.isNull(endDateTime)){
          this.setData({
            survey:res.data,
            loading : false,
            isNotStart : beginDateTime > currentDateTime ? true : false,
            isTimeOut : endDateTime < currentDateTime ? true : false
          })
        }else{
          this.setData({
            survey:res.data,
            loading : false
          })
        }
      }else{
        wx.showToast({
          title: '服务端发生了错误',
        })
        this.setData({
          loading : false
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
    })
  },

  radiotap : function(event){
    let titleId = event.currentTarget.dataset.titleid
    let optionId = event.currentTarget.dataset.optionid
    let survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(option.id == optionId){
            if(option.selected){
              option.selected = false
            }else{
              option.selected = true
            }
          }else{
            option.selected = false
          }
        }
        this.setData({
          survey
        })
        break
      }
    }
  },
  radioChange : function(event){
    /*
    const titleId = event.currentTarget.dataset.titleid
    const optionId = event.detail.value
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(option.id == optionId){
            option.selected = !option.selected
          }else{
            option.selected = false
          }
        }
        this.setData({
          survey
        })
        break
      }
    }*/
  },

  checkboxChange:function(event){
    const titleId = event.currentTarget.dataset.titleid
    const optionIdList = event.detail.value
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(optionIdList.includes(option.id)){
            option.selected = true
          }else{
            option.selected = false
          }
        }
        this.setData({
          survey
        })
        break
      }
    }
  },

  inputChange:function(event){
    const titleId = event.currentTarget.dataset.titleid
    const text = event.detail.value
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        title.text = text
        this.setData({
          survey
        })
        break
      }
    }
    
  },

  uploadComplete : function(fileName, titleId){
    if(util.isNull(fileName) || util.isNull(titleId)){
      return
    }
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        title.text = fileName
        this.setData({
          survey
        })
        break
      }
    }
    
  },

  chooseImage : function(event){
    const titleId = event.currentTarget.dataset.titleid
    let systemInfo = wx.getSystemInfoSync();
    if(systemInfo.platform == 'ios'){
      this.iosChooseImage(titleId)
    }else{
      this.androidChooseImage(titleId)
    }    
  },

  androidChooseImage : function(titleId){
    let that = this
    wx.chooseImage({
      count : 1,
      sizeType : ['original','compressed'],
      sourceType : ['album','camera'],
      complete(res){
        let errMsg = res.errMsg
        if(!(errMsg == 'chooseImage:ok')){
          return
        }
        let tempFilePaths = res.tempFilePaths
        that.setData({
          photos : tempFilePaths,
        })
        that.uploadImage(titleId)
      }
    })
  },
  iosChooseImage : function(titleId){
    let that = this
    wx.chooseImage({
      count : 1,
      sizeType : ['original','compressed'],
      sourceType : ['album','camera'],
      complete(res){
        let errMsg = res.errMsg
        if(!(errMsg == 'chooseImage:ok')){
          wx.showToast({
            title: errMsg,
          })
          return
        }
        let tempFilePaths = res.tempFilePaths
        that.setData({
          photos : tempFilePaths,
        })
        that.uploadImage(titleId)
      }
    })
  },

    /**
   * 上传照片
   */
  uploadImage: function(titleId) {
    this.setData({
      imageUploading : true
    })
    let that = this
    let uploadTask = wx.uploadFile({
      url: config.api_base_url+'survey/upload',
      filePath: that.data.photos[0],
      name: 'file',
     /* formData: {
        'user': '黑柴哥'
      },*/
      success: function (res) {
        let statusCode = res.statusCode
        if(statusCode == 200){
          // res.data  为string类型所以先转换成JSON
          let retData = JSON.parse(res.data)
          let fileName = retData.data
          that.uploadComplete(fileName,titleId)
        }
      },
      fail:function(res){
        
      }
    })


    uploadTask.onProgressUpdate((res) =>{
      let progress = res.progress
      that.setData({
        progress : progress
      })
      if(progress == 100){
        that.setData({
          imageUploading : false
        })
      }
    })
  },


  deleteImageTap : function(event){
    const titleId = event.currentTarget.dataset.titleid
    let that = this
    wx.showModal({
      title : '提示',
      content : '确定删除该图片？',
      success (res) {
        if (res.confirm){
          that.deleteImage(titleId)
        } 
      }
    })
  },

  deleteImage : function(titleId){
    if(util.isNull(titleId)){
      return
    }
    const survey = this.data.survey
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(titleId == title.id){
        title.text = ""
        this.setData({
          survey
        })
        break
      }
    }
  },

  previewImg : function(event){
    const fileName = event.currentTarget.dataset.filename
    let that = this
    wx.previewImage({
      urls: [that.data.imgVisitUrl+fileName],
    })
  },

  submit:function(){
    if(this.data.isSubmitted){
      return
    }

    let checkResult = this.checkData()
    if(!checkResult.isLegal){
      wx.showToast({
        title: checkResult.message,
        icon : 'none'
      })
      return
    }
    this.commitToServer()
  },

  checkData:function(){
    let checkResult ={
      'isLegal':true,
      'message':''
    }
    const survey = this.data.survey
    if( survey.titleList == null || survey.titleList.length == 0){
      checkResult.isLegal = false
      checkResult.message = '当前问卷没有题目可以作答！'
      return checkResult;
    }
    for(let i = 0; i < survey.titleList.length; i++){
      let title = survey.titleList[i]
      if(title.required == '0'){
        continue
      }
      if(title.titleType == '0' || title.titleType == '1'){ //single
        let isAnswered = false
        for(let j=0; j < title.optionModelList.length; j++){
          let option = title.optionModelList[j]
          if(option.selected){
            isAnswered = true
            break
          }
        }
        if(!isAnswered){
          checkResult.isLegal = false
          checkResult.message = '第'+title.titleSequence+'题为必答题，请作答'
          return checkResult
        }
      }
      
      if(title.titleType == '2' || title.titleType == '3'){ // 填空题或者文件上传题
        let isAnswered = false
        if(title.text.trim() != ''){
          isAnswered = true
        }
        if(!isAnswered){
          checkResult.isLegal = false
          checkResult.message = '第'+title.titleSequence+'题为必答题，请作答'
          return checkResult
        }
      }
    }
    return checkResult
  },
  
  commitToServer:function(){
    this.setData({
      submitBgColor:'after-submit-bgcolor',
      submitText:'提交中...',
      isSubmitted:true
    })
    wx.showLoading({
      title : '提交中...'
    })
    
    surveyModel.submitSurvey(this.data.survey, this.data.wxNickname, this.data.wxOpenId).then(res=>{
      wx.hideLoading()
      if(res.message != 'success'){
        wx.showToast({
          title: res.message,
          icon:'none'
        })
        this.setData({
          submitBgColor:'before-submit-bgcolor',
          submitText : '提交',
          isSubmitted : false
        })
        
      }else{
        this.setData({
          isSuccess : true
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
      })
      this.setData({
        submitBgColor:'before-submit-bgcolor',
        submitText : '提交',
        isSubmitted : false
      })
    })
  },

  _authBtnLock : function(){
    if(this.data.isAuthorizing){
      return
    }
    this.setData({
      isAuthorizing : true
    })
  },

  _authBtnUnlock : function(){
    this.setData({
      isAuthorizing : false
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