import {HTTP} from '../utils/http-p.js'

class TitleModel extends HTTP{

  getTextTitleList(surveyId){
    return this.request({
      url : 'title/text/get',
      data : {
        'surveyId' : surveyId
      }
    })
  }

  saveTitleModel(title){
    return this.request({
      url : 'title/save',
      data :title,
      method : 'POST'
    })
  }

  updateTitleModel(title){
    return this.request({
      url : 'title/update',
      data :title,
      method : 'POST'
    })
  }

  deleteTitleModel(title){
    return this.request({
      url : 'title/delete',
      data : title,
      method : 'DELETE'
    })
  }
  /*
  getTextTitleList(surveyId,sCallback){
    this.request({
      data : {
        'surveyId' : surveyId
      },
      url : 'title/text/get',
      success : (res)=>{
        sCallback(res)
      }
    })
  }*/
}

export{TitleModel}