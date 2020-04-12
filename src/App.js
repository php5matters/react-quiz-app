import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
import Quiz from './components/Quiz';
import Result from './components/Result';
import logo from './svg/logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {},
      result: '',
      score: 0
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.setNextQuestion = this.setNextQuestion.bind(this);
  }

  componentDidMount() {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    if(event)
    this.setUserAnswer(event.currentTarget.value);
    console.log('handleAnswerSelected');
    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    console.log("answer", answer);
    console.log("this.state.score", this.state.score);

    const score = quizQuestions[this.state.counter].answers.filter((answerItem)=>{
      return answerItem.type.toLowerCase() === answer.toLowerCase();
    });
    console.log(score[0].score);
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer,
      score: score[0].score + state.score
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: ''
    });
  }

  // getResults() {
  //   console.log(this.state);
  //   const answersCount = this.state.answersCount;
  //   const answersCountKeys = Object.keys(answersCount);
  //   const answersCountValues = answersCountKeys.map(key => answersCount[key]);
  //   const maxAnswerCount = Math.max.apply(null, answersCountValues);

  //   return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
  // }

  getResults() {
    console.log(this.state.score)
    return this.state.score;
  }
  // setResults(result) {
  //   if (result.length === 1) {
  //     this.setState({ result: result[0] });
  //   } else {
  //     this.setState({ result: 'Undetermined' });
  //   }
  // }
  setResults(result) {
    if (result !== undefined) {
      this.setState({ result });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }
  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
        onSetNextQuestion={this.setNextQuestion}
        countDownStartsFrom={this.state.timerRestartFrom}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Quiz</h2>
        </div>
        {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default App;
