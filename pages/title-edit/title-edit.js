import {OptionModel} from '../../models/option'
import {TitleModel} from '../../models/title'

let optionModel = new OptionModel()
let titleModel = new TitleModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title : Object,
    add_btn_text : '保 存',
    disabled : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = JSON.parse(options.title)
    this.setData({
      title
    })
  },

  titleNameInput : function(e){
    let titleName = e.detail.value
    let title = this.data.title
    title.title = titleName
    this.setData({
      title
    })
  },
  
  titleAddSubmit : function(e){
    wx.showLoading({
      title: '保存中...',
    })
    this.setData({
      disabled : true,
      add_btn_text : '保存中...'
    })
    let title = this.data.title
    if(title.title == null ||  title.title == undefined || title.title.trim() == "" ){
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
      wx.hideLoading()
      return
    }

    if(title.titleType == '0' || title.titleType == '1'){
      let optionList = title.optionModelList
      for(let i = 0; i < optionList.length; i++){
        let option = optionList[i]
        let optionName = option.optionName
        if(optionName == null || optionName == undefined || optionName == ""){
          this.setData({
            disabled : false,
            add_btn_text : '保 存'
          })
          wx.showToast({
            title: '选项'+(i+1)+'不能为空',
            icon: 'none'
          })
          wx.hideLoading()
          return
        }
      }
    }
    
    titleModel.updateTitleModel(title).then(res=>{
      let message = res.message
      wx.hideLoading()
      if(message == "success"){

        this.setData({
          title : res.data
        })
        wx.showToast({
          title: '保存成功',
          icon : 'none'
        })
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.showToast({
          title: message,
          icon : 'none'
        })
      }
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })
    },res=>{
      wx.hideLoading()
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
  deleteOptionTap : function(e){
    let index = e.currentTarget.dataset.index
    if(this.data.title.optionModelList.length <= 2){
      wx.showToast({
        title: '不能删除，至少保留两个选项',
        icon: 'none'
      })
      return
    }
    // 判断 id是否为空，再决定是怎么删除。
    let title = this.data.title
    let option = title.optionModelList[index]
    let that = this
    wx.showModal({
      title : '提示',
      content : '确定删除 ['+option.optionName+']?',
      success(res){
        if(res.confirm){
          that._deleteOption(option.id,title.titleType,index)
        }
      }
    })
    
    
  },
  addOptionTap : function(e){
    let title = this.data.title
    let optionList = title.optionModelList
    optionList.push({
      'id' : '',
      'titleId' : '',
      'optionName' : '',
    })
    this.setData({
      title
    })
  },
  optionNameInput : function(e){
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    let title = this.data.title
    let optionList = title.optionModelList
    optionList[index].optionName = value
    this.setData({
      title
    })
  },
  requireChange : function(e){
    let val = e.detail.value
    let title = this.data.title
    if(val){
      title.required = '1'
    }else{
      title.required = '0'
    }
    this.setData({
      title
    })
  },
  isNameColumnChange : function(e){
    let val = e.detail.value
    let title = this.data.title
    if(val){
      title.isNameColumn = '1'
    }else{
      title.isNameColumn = '0'
    }
    this.setData({
      title
    })
  },
  _deleteOption : function(optionId,titleType,index){
    let title = this.data.title
   
    if(optionId == null || optionId == undefined || optionId.trim() == ""){
      title.optionModelList.splice(index,1)
      this.setData({
        title
      })
      wx.showToast({
        title: '删除成功',
        icon :'none',
        duration : 2000
      })
      return
    }
    wx.showLoading({
      title : '删除中...'
    })
    optionModel.deleteOption(optionId,titleType).then(res=>{
      wx.hideLoading()
      let message = res.message
      
      if(message == 'success'){
        title.optionModelList.splice(index,1)
        this.setData({
          title
        })
        wx.showToast({
          title: '删除成功',
          icon :'none',
          duration : 2000
        })
        
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