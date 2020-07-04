import {HTTP} from '../utils/http.js'

class UserModel extends HTTP{
  login(username,password,sCallback){
    this.request({
      data : {
        'username' : username,
        'password' : password
      },
      url:'user/login',
      success : (res)=>{
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

}

export{UserModel}