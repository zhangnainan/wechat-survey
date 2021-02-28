import {TitleModel} from '../../models/title'

let titleModel = new TitleModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add_btn_text : '保 存',
    disabled : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param = JSON.parse(options.param)
    let titleType = param.titleType
    if(titleType == 'single'){
      wx.setNavigationBarTitle({
        title: '单选题',
      })
    }
    if(titleType == 'multiple'){
      wx.setNavigationBarTitle({
        title: '多选题',
      })
    }
    if(titleType == 'text'){
      wx.setNavigationBarTitle({
        title: '填空题',
      })
    }
    let surveyId = param.surveyId
    this.setData({
      titleType,
      surveyId
    })

    if(titleType == 'single' || titleType == 'multiple'){
      let optionList = []
      optionList.push({
        'optionName' : ''
      })
      optionList.push({
        'optionName' : ''
      })
      
      this.setData({
        optionList
      })
    }
  },

  titleAddSubmit : function(e){
    this.setData({
      disabled : true,
      add_btn_text : '保存中...'
    })
    let values = e.detail.value
    if(values.title == null ||  values.title == undefined || values.title.trim() == "" ){
      this.setData({
        disabled : false,
        add_btn_text : '保 存'
      })
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
      return
    }

    if(this.data.titleType == 'single' || this.data.titleType == 'multiple'){
      for(let i = 0; i < this.data.optionList.length; i++){
        let optionName = "option"+i
        if(values[optionName] == null || values[optionName] == undefined || values[optionName] == ""){
          this.setData({
            disabled : false,
            add_btn_text : '保 存'
          })
          wx.showToast({
            title: '选项'+(i+1)+'不能为空',
            icon: 'none'
          })
          return
        }
      }
    }
    let titleType = ''
    if(this.data.titleType == 'single'){
      titleType = '0'
    }else if(this.data.titleType == 'multiple'){
      titleType = '1'
    }else{
      titleType = '2'
    }
    let required = values.required
    let isNameColumn = values.isNameColumn
    let title = {
      'title' : values.title,
      'titleType' : titleType,
      'required' : required ? '1' : '0',
      'isNameColumn' : isNameColumn ? '1' : '0',
      'surveyId' : this.data.surveyId
    }

    if(titleType == '0' || titleType == '1'){
      title.optionModelList = this.data.optionList
    }
    titleModel.saveTitleModel(title).then(res=>{
      let message = res.message
      if(message == "success"){
        /*
        const pages = getCurrentPages()
        let prevPage = pages[pages.length-2]
        prevPage.setData({
          isNavigateBack : true
        })*/
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.showToast({
          title: message,
          icon : 'none'
        })
        this.setData({
          disabled : false,
          add_btn_text : '保 存'
        })
      }
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
  deleteOptionTap : function(e){
    let index = e.currentTarget.dataset.index
    if(this.data.optionList.length <= 2){
      wx.showToast({
        title: '不能删除，至少保留两个选项',
        icon: 'none'
      })
      return
    }
    this.data.optionList.splice(index,1)
    this.setData({
      optionList : this.data.optionList
    })
    /*
    let optionList = this.data.optionList
    optionList.splice(index,1)
    this.setData({
      optionList : optionList
    })
    */
  },
  addOptionTap : function(e){
    let optionList = this.data.optionList
    optionList.push({
      'optionName' : ''
    })
    this.setData({
      optionList
    })
  },
  optionNameInput : function(e){
    
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    let optionList = this.data.optionList
    optionList[index].optionName = value
    this.setData({
      optionList
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