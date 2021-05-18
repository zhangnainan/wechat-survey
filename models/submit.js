import {HTTP} from '../utils/http-p.js'

class SubmitModel extends HTTP{

  getSurveySubmitList(surveyId, wxOpenId){
    return this.request({
      url : 'submit/survey/get',
      data : {
        'surveyId' : surveyId,
        'wxOpenId' : wxOpenId
      }
    })
  }

  getContestRankPage(surveyId, pageSize, start){
    return this.request({
      url : 'submit/contest/rank/get',
      data : {
        'surveyId' : surveyId,
        'pageSize' : pageSize,
        'start' : start
      }
    })
  }

  getSubmitCount(surveyId){
    return this.request({
      url : 'submit/count/get',
      data : {
        'surveyId' : surveyId
      }
    })
  }

}

export{SubmitModel}