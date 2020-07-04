import {HTTP} from '../utils/http-p.js'

class SurveyModel extends HTTP{
  getSurveyList(){
    return this.request({
      url:'survey/get/survey/list'
    })
  }

  getSurvey(surveyId){
    return this.request({
      url:'survey/get/survey',
      data:{'surveyId':surveyId}
    })
  }

  submitSurvey(survey){
    return this.request({
      url:'survey/submit/survey',
      method:'POST',
      data:survey
    })
  }

  getSurveySummary(surveyId){
    return this.request({
      url:'survey/get/survey/summary',
      data:{'surveyId':surveyId}
    })
  }


  getSurveySubmitDetail(surveyId){
    return this.request({
      url:'survey/get/survey/submit/list',
      data:{'surveyId':surveyId}
    })
  }

  getSurveyStatics(surveyId,titleId){
    return this.request({
      url:'survey/get/survey/name/statistics',
      data:{
        'surveyId':surveyId,
        'titleId':titleId
      }
    })
  }

  saveSurvey(surveyName,surveyNotes){
    return this.request({
      url : 'survey/save/survey',
      data : {
        'surveyName' : surveyName,
        'notes' : surveyNotes
      },
      method : 'POST'
    })
  }

}

export{SurveyModel}