import {TitleModel} from '../../models/title'
import {SurveyModel} from '../../models/survey-p'

let stringUtil = require('../../utils/stringUtil')
let titleModel =  new TitleModel()
let surveyModel = new SurveyModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyId : String,
    surveyName : String,
    titleList : Object,
    selectedIdArr : Array,
    isDisabled : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '表头排序',
    })
    this.setData({
      surveyId : options.surveyId,
      surveyName : options.surveyName
    })
    this._getTitleList()
  },

  checkboxChange : function(e){
    let selectedIdArr = e.detail.value
    this.data.selectedIdArr = selectedIdArr
    let titleList = this.data.titleList
    for(let i = 0; i < titleList.length; i++){
      let title = titleList[i]
      let titleId = title.id
      let index = selectedIdArr.findIndex((selectedId)=>{
        return selectedId == titleId
      })
      
      if(index >= 0){
        title.titleSequence = index+1
      }else{
        title.titleSequence = 0
      }
    }
    this.setData({
      titleList : titleList
    })
  },

  formSubmit : function(e){
    this._disabledBtn()
    let selectedIds = e.detail.value.selectedIds
    let sortCols = e.detail.value.sortCols
    if(selectedIds.length == 0){
      wx.showToast({
        title : '请选择要导出的数据列',
        icon : 'none'
      })
      this._enabledBtn()
      return
    }
  
    if(!stringUtil.isNull(sortCols) && !(/(^[1-9]\d*$)/.test(sortCols))){
      wx.showToast({
        title : '排序列数输入不合法',
        icon : 'none'
      })
      this._enabledBtn()
      return
    }

    if(stringUtil.isNull(sortCols)){
      sortCols = 0
    }

    if(sortCols > this.data.selectedIdArr.length){
      wx.showToast({
        title : '排序列数大于所选中的列数',
        icon : 'none'
      })
      this._enabledBtn()
      return
    }

    let titleList = []
    for(let i = 0; i < selectedIds.length; i++){
      let index = this.data.titleList.findIndex((title)=>{
        return title.id == selectedIds[i]
      })
      if(index >= 0){
        titleList.push(this.data.titleList[index])
      }
    }
   

    wx.showLoading({
      title: '下载中...',
    })
    surveyModel.exportExcel(this.data.surveyId,sortCols,titleList).then(res=>{
      let filePath = wx.env.USER_DATA_PATH+'/'+this.data.surveyName+'.xlsx'
      wx.getFileSystemManager().writeFile({
        filePath : filePath,
        data : res,
        encoding : 'binary',
        success : res => {
          wx.openDocument({
            filePath: filePath
          })
        }
      })
      wx.hideLoading()
      this._enabledBtn()
    },res=>{
      wx.hideLoading()
      this._enabledBtn()
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon : 'none'
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

  },

  _getTitleList : function(){
    titleModel.getTitleListBySurveyId(this.data.surveyId).then(res=>{

      let titleList = res.data
      for(let i = 0,arrLen=titleList.length; i < arrLen; i++){
        let title = titleList[i]
        title.titleSequence = 0
      }
      this.setData({
        titleList : titleList
      })
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
  _disabledBtn : function(){
    this.setData({
      isDisabled : true
    })
  },
  _enabledBtn : function(){
    this.setData({
      isDisabled : false
    })
  }
})