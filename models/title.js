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

  getTitleCount(surveyId){
    return this.request({
      url : 'title/get/count',
      data : {
        'surveyId' : surveyId
      }
    })
  }

  getTitlePage(surveyId,surveyType, pageSize, start){
    return this.request({
      url : 'title/get/page',
      data : {
        'surveyId' : surveyId,
        'surveyType' : surveyType,
        'pageSize' : pageSize,
        'start' : start
      }
    })
  }

  getContestTitleList(surveyId,answerTitleNum){
    return this.request({
      url : 'title/contest/get',
      data : {
        'surveyId' : surveyId,
        'answerTitleNum' : answerTitleNum
      }
    })
  }

  getTitleListBySurveyId(surveyId){
    return this.request({
      url : 'title/get/all',
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

  saveTitleAnswerModel(title){
    return this.request({
      url : 'title/answer/save',
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

  updateTitleAnswerModel(title){
    return this.request({
      url : 'title/answer/update',
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