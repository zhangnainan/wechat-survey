const util = require("../../common/js/util")
import {config} from '../../config.js'

// pages/file-import/file-import.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saveBtnText:'确定',
    btnDisabled : false,
    fileName : '',
    filePath : '',
    survey : Object
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '文件导入',
    })
    let survey = options.survey
    this.setData({
      survey : JSON.parse(survey)
    })
  },
  
  selectFile : function(event){
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type : 'file',
      complete : function(event){
        let errMsg = event.errMsg 
        if(errMsg == "chooseMessageFile:ok"){
          let fileName = event.tempFiles[0].name
          let tempFilePath = event.tempFiles[0].path
          if(!that._isExcel(fileName)){
            wx.showToast({
              title: '请选择Excel文件！',
              icon : 'none',
              duration : 4000
            })
            return
          }else{
            that.setData({
              fileName : fileName,
              filePath : tempFilePath
            })
            //that.importFile()
          }
        }
      }
    })
  },

  importFile : function(){
    this._btnLock()
    if(util.isNull(this.data.fileName)){
      wx.showToast({
        title: '请选择文件!',
        icon : 'none'
      })
      this._btnUnLock()
      return
    }
    this.uploadFile()
  },

  uploadFile : function(){
    let that = this
    wx.uploadFile({
      url: config.api_base_url+'survey/contest/title/import',
      filePath: that.data.filePath,
      name: 'file',
      formData:{
        'surveyId' : that.data.survey.id,
        'surveyType' : that.data.survey.surveyType
      },
      success: function (res) {
        console.log(res)
        let statusCode = res.statusCode
        if(statusCode == 200){
          
          let retData = JSON.parse(res.data)
          wx.showToast({
            title: retData.message,
            icon : 'none'
          })
          
        }else{
          wx.showToast({
            title: 'code:'+statusCode,
            icon : 'none'
          })
        }
        that._btnUnLock()
      },
      fail:function(res){
        wx.showToast({
          title: '导入失败',
          icon : 'none'
        })
        that._btnUnLock()
      }
    })
  },

  _isExcel : function(fileName){
    let index = fileName.indexOf('.')
    let fileExtension = fileName.slice(index+1,fileName.length)
    if(!(fileExtension == 'xls' || fileExtension == 'xlsx')){
      return false
    }
    return true
  },

  _btnLock : function(){
    this.setData({
      btnDisabled : true
    })
  },

  _btnUnLock : function(){
    this.setData({
      btnDisabled : false
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