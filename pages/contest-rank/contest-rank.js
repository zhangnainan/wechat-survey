import {SubmitModel} from '../../models/submit'

let submitModel = new SubmitModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    survey : Object,
    surverSubmitList : [],
    pageSize : 35,
    loadingMore : false,
    loadingCenter : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let survey = JSON.parse(options.survey)
    this.setData({
      survey : survey
    })
    wx.setNavigationBarTitle({
      title: survey.surveyName+'排行榜',
    })
    
    this.getSubmitInfo()
  },


  getSubmitInfo : function(){
    let surveyId = this.data.survey.id
    let pageSize = this.data.pageSize
    let start = this.data.surverSubmitList.length
    const submitCount = submitModel.getSubmitCount(surveyId)
    const submitPage = submitModel.getContestRankPage(surveyId,pageSize,start)
    this.setData({
      loadingCenter : true
    })
    
    Promise.all([submitCount,submitPage]).then(res=>{
      if(this.data.loadingCenter){
        this.setData({
          loadingCenter : false
        })
      }
      
      let submitCount = res[0].data
      this.setData({
        res1 : res[1]
      })
      let surveySubmitList  = this.data.surverSubmitList.concat(res[1].data)
      
      this.setData({
        submitCount : submitCount,
        surveySubmitList : surveySubmitList
      })

      
    },res=>{
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
        icon: 'none'
      })
      this.setData({
        loadingCenter : false
      })
    })

  },

  loadMoreSubmit : function(){
    this.setData({
      loadMore : true
    })
    let surveyId = this.data.survey.id
    let pageSize = this.data.pageSize
    let start = this.data.surverSubmitList.length
    submitModel.getContestRankPage(surveyId,pageSize,start).then(res=>{
     this.setData({
       loadingMore : false
     })
     let surveySubmitList = this.data.surveySubmitList.concat(res.data)
        this.setData({
          surveySubmitList : surveySubmitList,
        })
    },res=>{
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
        icon: 'none'
      })
      this.setData({
        loadingMore : false
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
    if(this.data.loadingMore){
      return
    }
    if(this.data.surverSubmitList.length >= this.data.submitCount){
      return
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})