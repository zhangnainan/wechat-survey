function isNull(str){
  if (str == null) return true;
  if (str == undefined) return true;
  if (str == "") return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}

module.exports = {
  isNull : isNull
}