import {HTTP} from '../utils/http-p.js'

class SurveyModel extends HTTP{
  getSurveyList(creator){
    return this.request({
      url:'survey/get/survey/list',
      data :{
        'creator' : creator
      }
    })
  }

  getSurvey(surveyId){
    return this.request({
      url:'survey/get/survey',
      data:{'surveyId':surveyId}
    })
  }

  deleteSurvey(surveyId){
    return this.request({
      url:'survey/delete/survey',
      data:{'surveyId':surveyId},
      method : 'DELETE'
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

  saveSurvey(userId,surveyName,surveyNotes){
    return this.request({
      url : 'survey/save/survey',
      data : {
        'creator' : userId,
        'surveyName' : surveyName,
        'notes' : surveyNotes
      },
      method : 'POST'
    })
  }

  updateSurvey(survey){
    return this.request({
      url : 'survey/update/survey',
      data : survey,
      method : 'POST'
    })
  }

}

export{SurveyModel}