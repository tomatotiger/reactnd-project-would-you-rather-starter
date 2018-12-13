import {
  RECEIVE_QUESTIONS,
  ADD_QUESTION,
  ANSWER_QUESTION
} from '../actions/questions'

export default function questions (state = {}, action) {
  switch (action.type) {
    case RECEIVE_QUESTIONS:
      return {
        ...state,
        ...action.questions
      }
    case ADD_QUESTION:
      return {
        ...state,
        [action.question.id]: action.question
      }
    case ANSWER_QUESTION:
      const question = { action }
      if (question.answer === 'optionOne') {
        return {
          ...state,
          [question.id]: {
            ...state[question.id],
            optionOne:
              state[question.id].optionOne.votes.concat[question.author]
          }
        }
      } else if (question.answer === 'optionTwo') {
        return {
          ...state,
          [question.id]: {
            ...state[question.id],
            optionOne:
              state[question.id].optionTwo.votes.concat[question.author]
          }
        }
      }
    default:
      return state
  }
}
