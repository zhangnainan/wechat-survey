import {HTTP} from '../utils/http-p.js'

class UserModel extends HTTP{
  login(username,password){
    return this.request({
      url:'user/login',
      data : {
        'username' : username,
        'password' : password
      }
    })
  }
}

export{UserModel}