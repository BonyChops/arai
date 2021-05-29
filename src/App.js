//import M from 'materialize-css';
import { Button, Card, Row, Col, Container, Section, TextInput } from 'react-materialize';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from "./components/Footer/Footer";
import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Top from './components/Top/Top';
import Questions from './components/Questions/Questions';
import Play from './components/Play/Play';
import moment from "moment"
const merge = require('deepmerge');

class App extends React.Component {
  constructor(props) {
    super(props);
    const data = JSON.parse(window.localStorage.getItem("data"));
    this.state = data !== null ? data : {};

    setInterval(() => {
      window.localStorage.setItem("data", JSON.stringify(this.state));
      console.log("saved")
      console.log(this.state)
    }, 5000)
  }

  accessor = (state, id = this.props.currentId) => {
    const keyName = `question_${id}`;
    console.log(state);
    const question = this.state[keyName];
    if (question === undefined) return false;
    this.setState({
      [keyName]: merge(
        (this.state[keyName] === undefined ? {} : this.state[keyName]),
        state,
        { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
      )
    })
  }

  generateQuestion = () => {
    const genId = () => {
      const number = Math.random();
      number.toString(36);
      return number.toString(36).substr(2, 5);
    };
    const id = genId();
    this.setState({
      [`question_${id}`]: {
        title: "無題のクイズ",
        description: moment().format("YYYY/MM/DD HH:mm:ssのクイズ"),
        id,
        questions: [],
        shuffleOptions: false,
        shuffleQuestions: false
      }
    })
    return id;
  }

  render = () => {
    return (
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          <Switch>
            <Route exact path="/" render={() => <Top />} />
            <Route exact path="/q/:id"
              render={(props) => <Dashboard
                key={props.match.params.id}
                state={this.state[`question_${props.match.params.id}`]}
                accessor={(state) => this.accessor(state, props.match.params.id)}
                baseAccessor={this.setState}
              />} />
              <Route exact path="/q/:id/play"
              render={(props) => <Play
                key={props.match.params.id}
                state={this.state[`question_${props.match.params.id}`]}
                accessor={(state) => this.accessor(state, props.match.params.id)}
                baseAccessor={this.setState}
              />} />
          </Switch>
          <Questions generateQuestion={this.generateQuestion} state={this.state} baseAccessor={(state) => this.setState(state)} />
        </Router>
        <Footer />
      </div >
    )
  };
}

export default withRouter(App);
