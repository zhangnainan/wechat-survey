import {HTTP} from '../utils/http.js'

class SurveyModel extends HTTP{
  getSurveyList(sCallback){
    this.request({
      url:'survey/get/survey/list',
      success:(res)=>{
        sCallback(res)
      }
    })
  }

  getSurvey(surveyId,sCallback){
    this.request({
      url:'survey/get/survey',
      data:{'surveyId':surveyId},
      success:(res)=>{
        sCallback(res)
      }
    })
  }

  submitSurvey(survey,sCallback,fCallBack){
    this.request({
      url:'survey/submit/survey',
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
      url:'survey/get/survey/summary',
      data:{'surveyId':surveyId},
      success:(res)=>{
        sCallback(res)
      }
    })
  }


  getSurveySubmitDetail(surveyId,sCallback){
    this.request({
      url:'survey/get/survey/submit/list',
      data:{'surveyId':surveyId},
      success:(res)=>{
        sCallback(res)
      }
    })

  }

  getSurveyStatics(surveyId,titleId,sCallback){
    this.request({
      url:'survey/get/survey/name/statistics',
      data:{
        'surveyId':surveyId,
        'titleId':titleId
      },
      success:(res)=>{
        sCallback(res)
      }
    })

  }

}

export{SurveyModel}