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