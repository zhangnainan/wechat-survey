import {HTTP} from '../utils/http.js'

class SurveyModel extends HTTP{
  getSurveyList(sCallback){
    this.request({
      url:'get/survey/list',
      success:(res)=>{
        sCallback(res)
      }
    })
  }

  getSurvey(surveyId,sCallback){
    this.request({
      url:'get/survey',
      data:{'surveyId':surveyId},
      success:(res)=>{
        sCallback(res)
      }
    })
  }

  submitSurvey(survey,sCallback,fCallBack){
    this.request({
      url:'submit/survey',
      method:'POST',
      data:survey,
      success:(res)=>{
        sCallback(res)
      },
      fail:(err)=>{
        fCallBack(err)
      }
    })
  }

  getSurveySummary(surveyId,sCallback){
    this.request({
      url:'get/survey/summary',
      data:{'surveyId':surveyId},
      success:(res)=>{
        sCallback(res)
      }
    })
  }

}

export{SurveyModel}