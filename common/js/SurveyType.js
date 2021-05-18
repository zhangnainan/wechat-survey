function isQuestionnaire(str) {
  
  return str == 'questionnaire';
}

function isKnowledgeCompetition(str){
  return str == 'knowledge-competition'
}
module.exports = {
  isQuestionnaire: isQuestionnaire,
  isKnowledgeCompetition : isKnowledgeCompetition
}