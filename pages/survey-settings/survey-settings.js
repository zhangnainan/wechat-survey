import {SurveyModel} from '../../models/survey-p'

let dateTimePicker = require('../../common/js/dateTimePicker.js')
let surveyModel = new SurveyModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    survey : Object,
    beginDateTime : null,
    endDateTime : null,
    beginDateTimeArr : null,
    endDateTimeArr : null,
    startYear : 2015,
    endYear : 2035,
    disabled : false,
    btnText : '保 存'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '问卷设置',
    })  

    let surveyJson = options.surveyJson
    let survey = JSON.parse(surveyJson)
    this.setData({
      survey
    })

  //  this._parseSurveyTimeSetting();

    let beginTime = null
    let beginDateTimeStr = this.data.survey.beginDateTime
  
    if(beginDateTimeStr != '' && beginDateTimeStr != null && beginDateTimeStr != undefined){
      beginTime = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, beginDateTimeStr)
    }else{
      beginTime = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear)
    }


    let endTime = null
    let endDateTimeStr = this.data.survey.endDateTime
  
    if(endDateTimeStr != '' && endDateTimeStr != null && endDateTimeStr != undefined){
      endTime = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, endDateTimeStr)
    }else{
      endTime = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear)
    }
    this.setData({
      beginDateTime : beginTime.dateTime,
      beginDateTimeArr : beginTime.dateTimeArray,
    });
    this.setData({
      endDateTime : endTime.dateTime,
      endDateTimeArr : endTime.dateTimeArray,
    });
  },

  settingSubmit : function(e){
    // 判断开始时间与结束时间的大小
    let beginDateTime = this.data.beginDateTime
    let endDateTime   = this.data.endDateTime
    let beginDateTimeArr = this.data.beginDateTimeArr
    let endDateTimeArr   = this.data.endDateTimeArr
    
    let beginDateTimeStr = beginDateTimeArr[0][beginDateTime[0]]+'-'+
      beginDateTimeArr[1][beginDateTime[1]]+'-'+
      beginDateTimeArr[2][beginDateTime[2]]+' '+
      beginDateTimeArr[3][beginDateTime[3]]+':'+
      beginDateTimeArr[4][beginDateTime[4]]+':'+
      beginDateTimeArr[5][beginDateTime[5]]
    let endDateTimeStr = endDateTimeArr[0][endDateTime[0]]+'-'+
      endDateTimeArr[1][endDateTime[1]]+'-'+
      endDateTimeArr[2][endDateTime[2]]+' '+
      endDateTimeArr[3][endDateTime[3]]+':'+
      endDateTimeArr[4][endDateTime[4]]+':'+
      endDateTimeArr[5][endDateTime[5]]

    if(beginDateTimeStr >= endDateTimeStr){
      wx.showToast({
        title: '开始时间要小于结束时间',
        icon:'none'
      })
      return
    }

    this.data.survey.beginDateTime = beginDateTimeStr
    this.data.survey.endDateTime = endDateTimeStr
    
    wx.showLoading({
      title: '保存中...',
    })
    surveyModel.updateSurveyTimeSetting(this.data.survey).then(res=>{
      wx.hideLoading()
      let message = res.message
      if(message == 'success'){
        wx.showToast({
          title: '保存成功',
        })
      }else{
        wx.showToast({
          title: '发生了一个错误',
          icon: 'none'
        })
      }
    },res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发生了一个错误,请联系管理员',
        icon: 'none'
      })
    })
  },

  changeBeginDateTime : function(e){
    this.setData({
      beginDateTime : e.detail.value
    })
  },
  
  changeBeginDateTimeColumn : function(e){
    let arr = this.data.beginDateTime, dateArr = this.data.beginDateTimeArr;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      beginDateTimeArr: dateArr,
      beginDateTime: arr
    });
  },

  changeEndDateTime : function(e){
    this.setData({
      endDateTime : e.detail.value
    })
  },

  changeEndDateTimeColumn : function(e){
    let arr = this.data.endDateTime, dateArr = this.data.endDateTimeArr;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      endDateTimeArr: dateArr,
      endDateTime: arr
    });
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