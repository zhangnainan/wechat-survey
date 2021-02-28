Component({
  /**
   * 组件的属性列表
   */
  properties: {
    survey :{
      type : Object,
      value : null
    },
    isLoading : {
      type : Boolean,
      value : true
    },
    hiddenFlagMap : {
      type : Map,
      value : null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hiddenFlagMap : null,
    maskFlag : true
  },

  /**
   * 组件的方法列表
   */
  methods: {    
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
      let surveyJson  = JSON.stringify(this.data.survey)
      wx.navigateTo({
        url: '/pages/survey-info-edit/survey-info-edit?survey='+surveyJson,
      })
    },
  
    titleEditTap : function(e){
      let title = e.currentTarget.dataset.title
      let titleJson = JSON.stringify(title)
      wx.navigateTo({
        url: '/pages/title-edit/title-edit?title='+titleJson,
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
      let paramObj = {
        'titleType' : titleType,
        'surveyId'  : this.data.survey.id
      }
      let paramJson = JSON.stringify(paramObj)
      wx.navigateTo({
        url: '/pages/title-create/title-create?param='+paramJson,
      })
    },
  
    maskTap : function(e){
      this.setData({
        maskFlag : true
      })
    },
    _getSurvey : function(surveyId){
      wx.showLoading()
      surveyModel.getSurvey(surveyId).then(res=>{
        wx.hideLoading()
        let message = res.message
        if(message == 'success'){
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
          wx.showLoading()
          this._getSurvey(this.data.survey.id)
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
    }
  }
})
