import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import PercentageBar from './PercentageBar'
import { handleAnswerQuestion } from '../actions/questions'

const QuestionPage = props => {
  const { question, onSubmit } = props
  if (question === null) {
    return <p>This Question Doesn't Exist.</p>
  }
  const { id, author, optionOne, optionTwo, answered } = question
  return (
    <div className='content'>
      <h5 className='title'>{author.name} asks: </h5>
      <div className='question-box'>
        <div className='question-box-avatar'>
          <img
            src={`/images/avatars/${author.avatarURL}`}
            className='avatar-big'
            alt={author.name}
          />
        </div>
        {answered === null ? (
          <UnansweredQuestion
            answered={answered}
            optionOne={optionOne.text}
            optionTwo={optionTwo.text}
            onSubmit={onSubmit}
            qid={id}
          />
        ) : (
          <AnsweredQuestion
            answered={answered}
            optionOne={optionOne}
            optionTwo={optionTwo}
          />
        )}
      </div>
    </div>
  )
}

QuestionPage.propTypes = {
  question: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
}

class UnansweredQuestion extends Component {
  state = {
    answer: 'optionOne',
    loading: false
  }

  handleSubmit = e => {
    this.setState({ loading: true })
    const { qid, onSubmit } = this.props
    onSubmit(this.state.answer, qid).catch(() => {
      console.warn('Error in handleAnswerQuestion: ', e)
      alert('There was an error answering the question. Please try again.')
      this.setState({ loading: false })
    })
  }

  handleRadioChange = e => {
    const answer = e.target.value
    this.setState(currentState => ({
      ...currentState,
      answer
    }))
  }

  render () {
    const answer = this.state.answer
    const { optionOne, optionTwo } = this.props
    return (
      <div className='question-summary'>
        <h3>Would you rather ...</h3>
        <label htmlFor='optionOne' className='pure-radio'>
          <input
            id='optionOne'
            type='radio'
            name='options'
            value='optionOne'
            checked={answer === 'optionOne'}
            onChange={this.handleRadioChange}
          />
          {optionOne}
        </label>

        <label htmlFor='optionTwo' className='pure-radio'>
          <input
            id='optionTwo'
            type='radio'
            name='options'
            value='optionTwo'
            checked={answer === 'optionTwo'}
            onChange={this.handleRadioChange}
          />
          {optionTwo}
        </label>
        <button
          className='pure-button submit-button'
          onClick={this.handleSubmit}
          disabled={this.state.loading}
        >
          {this.state.loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    )
  }
}

UnansweredQuestion.propTypes = {
  answered: PropTypes.string,
  optionOne: PropTypes.string.isRequired,
  optionTwo: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  qid: PropTypes.string.isRequired
}

const AnsweredQuestion = ({ answered, optionOne, optionTwo }) => {
  const voteCounts = optionOne.votes.concat(optionTwo.votes).length
  const optionOnePercent = optionOne.votes.length / voteCounts * 100
  const result = (
    <div className='question-summary'>
      <h3>Results:</h3>
      <div
        className={`question-result ${answered === 'optionOne' &&
          'question-result-voted'}`}
      >
        <span>{optionOne.text}</span>
        <PercentageBar percentage={optionOnePercent} />
        {optionOne.votes.length} out of {voteCounts} votes
      </div>
      <div
        className={`question-result ${answered === 'optionTwo' &&
          'question-result-voted'}`}
      >
        <span>{optionTwo.text}</span>
        <PercentageBar percentage={100 - optionOnePercent} />
        {optionTwo.votes.length} out of {voteCounts} votes
      </div>
    </div>
  )
  return result
}

AnsweredQuestion.propTypes = {
  answered: PropTypes.string,
  optionOne: PropTypes.object.isRequired,
  optionTwo: PropTypes.object.isRequired
}

const mapStateToProps = ({ authedUser, questions, users }, props) => {
  const { qid } = props.match.params
  const question = questions[qid]

  return {
    authedUser,
    question: question
      ? {
        ...question,
        author: users[question.author],
        answered: Object.keys(users[authedUser].answers).includes(qid)
          ? users[authedUser].answers[qid]
          : null
      }
      : null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: (answer, qid) => {
      return dispatch(
        handleAnswerQuestion({
          qid,
          answer
        })
      )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionPage)
