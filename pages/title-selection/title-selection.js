import {TitleModel} from '../../models/title'
let stringUtil = require('../../utils/stringUtil')
let titleModel =  new TitleModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyId : String,
    titleList : Object,
    currentTitle : null,
    itemSelected : false,
    select : false,
    tipText : '请选择',
    submitBgColor:'before-submit-bgcolor',
    submitText:'保存'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择姓名列',
    })
    this.setData({
      surveyId : options.surveyId
    })
    this._getTitleList()
  },
  submit : function(e){
    if(stringUtil.isNull(this.data.currentTitle)){
      wx.showToast({
        title: '您没有选择姓名列',
        icon : 'none'
      })
      return
    }
    const pages = getCurrentPages()
    let prevPage = pages[pages.length-2]
    prevPage.setData({
      byNameStatistics : true,
      statisticTitle : this.data.currentTitle
    })
    wx.navigateBack({
      delta : 1
    })
  },
  bindShowMsg : function(e){
    this.setData({
      select : !this.data.select
    })
  },
  selectItemTap : function(e){
    let title  = e.currentTarget.dataset.title
    this.setData({
      currentTitle : title,
      tipText : title.title,
      select : false,
      itemSelected : true
    })
  },
  _getTitleList : function(){
    titleModel.getTextTitleList(this.data.surveyId).then(res=>{
      this.setData({
        titleList : res.data
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
    /*
    titleModel.getTextTitleList(this.data.surveyId,(res)=>{
      this.setData({
        titleList : res.data
      })
    })*/
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