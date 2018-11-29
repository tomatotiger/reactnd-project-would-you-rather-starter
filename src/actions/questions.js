import { showLoading, hideLoading } from 'react-redux-loading'
import { saveQuestion, saveQuestionAnswer } from '../utils/api'

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const ADD_QUESTION = 'ADD_QUESTION'
export const ANSWER_QUESTION = 'ANSWER_QUESTION'

export function receiveQuestions (questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions
  }
}

function addQuestion (question) {
  return {
    type: ADD_QUESTION,
    question
  }
}

export function handleAddQuestion (question) {
  return (dispatch, getState) => {
    const authedUser = getState()
    return saveQuestion({ question, author: authedUser }).then(
      dispatch(addQuestion(question))
    )
  }
}

function answerQuestion ({ authedUser, id, answer }) {
  return {
    type: ANSWER_QUESTION,
    id,
    answer,
    authedUser
  }
}

export function handleAnswerQuestion (info) {
  return dispatch => {
    dispatch(answerQuestion(info))

    return saveQuestionAnswer(info).catch(e => {
      console.warn('Error in handleAnswerQuestion: ', e)
      // TODO: recovery UI to unanswerd dispatch()
      alert('There was an error answering the question. Please try again.')
    })
  }
}