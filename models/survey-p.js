import {HTTP} from '../utils/http-p.js'

class SurveyModel extends HTTP{
  getSurveyList(creator,surveyType){
    return this.request({
      url:'survey/get/survey/list',
      data :{
        'creator' : creator,
        'surveyType' : surveyType
      }
    })
  }

  getSurveyInfo(surveyId){
    return this.request({
      url : 'survey/get/survey/info',
      data :{
        'surveyId' : surveyId
      }
    })
  }

  getSurvey(surveyId){
    return this.request({
      url:'survey/get/survey',
      data:{'surveyId':surveyId}
    })
  }

  loadSurveyByIdAndUserNickName(surveyId, wxNickname, wxOpenId){
    return this.request({
      url : encodeURI('survey/load/survey'),
      data:{
        'surveyId'   : surveyId,
        'wxNickname' : wxNickname,
        'wxOpenId'   : wxOpenId
      }
    })
  }

  deleteSurvey(surveyId){
    return this.request({
      url:'survey/delete/survey',
      data:{'surveyId':surveyId},
      method : 'DELETE'
    })
  }

  clearSurvey(surveyId){
    return this.request({
      url:'survey/clear/survey',
      data:{'surveyId':surveyId},
      method : 'DELETE'
    })
  }

  submitSurvey(survey, wxNickname, wxOpenId){
    
    return this.request({
      url:encodeURI('survey/submit/survey?wxNickname='+wxNickname+'&wxOpenId='+wxOpenId),
      method:'POST',
      data:survey
    })
  }
  
  submitContest(titleList, surveyId,submitter, timeCount,wxNickname, wxOpenId){
    return this.request({
      url:encodeURI('survey/submit/contest?surveyId='+surveyId+'&submitter='+submitter+'&timeCount='+timeCount+'&wxNickname='+wxNickname+'&wxOpenId='+wxOpenId),
      method:'POST',
      data:titleList
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
  
  saveSurvey(creator,surveyName,surveyNotes,surveyType,answerTitleNum,scoreScale){
    return this.request({
      url : 'survey/save/survey',
      data : {
        'creator' : creator,
        'surveyName' : surveyName,
        'notes' : surveyNotes,
        'surveyType' : surveyType,
        'answerTitleNum' : answerTitleNum,
        'scoreScale' : scoreScale
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

  updateSurveyTimeSetting(survey){
    return this.request({
      url : 'survey/update/survey/time/setting',
      data : survey,
      method : 'POST'
    })
  }

  exportExcel(surveyId, sortCols,titleList){
    return this.request({
      url:'survey/export/excel?surveyId='+surveyId+'&sortCols='+sortCols,
      method:'POST',
      data:titleList,
      responseType : 'arraybuffer'
    })
  }

  getOpenId(code){
    return this.request({
      url : 'survey/get/openid',
      data : {
        code : code
      }
    })
  }

}

export{SurveyModel}