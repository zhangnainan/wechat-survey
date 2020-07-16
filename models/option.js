import {HTTP} from '../utils/http-p.js'

class OptionModel extends HTTP{

  deleteOption(optionId,titleType){
    return this.request({
      url : 'option/delete',
      data : {
        'optionId' : optionId,
        'titleType' : titleType
      },
      method : 'DELETE'
    })
  }
}

export{OptionModel}