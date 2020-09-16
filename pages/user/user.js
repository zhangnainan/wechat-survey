import {UserModel} from '../../models/user'
var stringUtil = require('../../utils/stringUtil')
let useModel =  new UserModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username : '',
    password : '',
    login_btn_text : '登 录',
    isUsernameInput : false,
    isPasswordInput : false,
    disabled : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
    })
  },
  loginSubmit : function(event){
    let isUserDataLegal = this._checkUserDataIsLegal()
    if(!isUserDataLegal){
      return
    }
    this.setData({
      disabled : true,
      login_btn_text : '登录中...'
    })

    useModel.login(this.data.username,this.data.password).then(res=>{
      if(!stringUtil.isNull(res) && !stringUtil.isNull(res.message) && res.message == 'success'){
        let app = getApp()
        app.globalData.userId = res.data.id
        wx.redirectTo({
          url: '/pages/survey/survey',
        })
      }else{
        wx.showToast({
          title: '用户名或者密码错误',
          icon:'none'
        })
        this.setData({
          disabled : false,
          login_btn_text : '登 录'
        })
      }
    },res=>{
      wx.showToast({
        title: '发生了一个错误，请联系管理员',
        icon:'none'
      })
      this.setData({
        disabled : false,
        login_btn_text : '登 录'
      })
    })

    /*
    useModel.login(this.data.username,this.data.password,(res)=>{
      if(!stringUtil.isNull(res) && !stringUtil.isNull(res.message) && res.message == 'success'){
        wx.redirectTo({
          url: '/pages/survey/survey',
        })
      }else{
        wx.showToast({
          title: '用户名或者密码错误',
          icon:'none'
        })
        this.setData({
          disabled : false,
          login_btn_text : '登 录'
        })
      }
    },res=>{
      this.setData({
        disabled : false,
        login_btn_text : '登 录'
      })
    })
    */
  },

  usernameInput : function(event){
    this.setData({
      username : event.detail.value,
      isUsernameInput : true
    })
    if(this.data.isUsernameInput && this.data.isPasswordInput){
      this.setData({
        disabled : false
      })
    }
  },

  passwordInput : function(event){
    this.setData({
      password : event.detail.value,
      isPasswordInput : true
    })
    if(this.data.isUsernameInput && this.data.isPasswordInput){
      this.setData({
        disabled : false
      })
    }
  },
  _checkUserDataIsLegal : function(){
    if(stringUtil.isNull(this.data.username)){
      wx.showToast({
        title: '请填写用户名',
        icon:'none'
      })
      return false
    }
    if(stringUtil.isNull(this.data.password)){
      wx.showToast({
        title: '请填写密码',
        icon:'none'
      })
      return false
    }

    
    return true
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