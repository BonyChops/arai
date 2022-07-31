import { Button, Card, Row, Col, Container, Section, TextInput } from 'react-materialize';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from "./components/Footer/Footer";
import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Top from './components/Top/Top';
import Questions from './components/Questions/Questions';
import Accounts from "./components/Accounts/Accounts";
import { openAccountMenu } from "./components/Accounts/Accounts";
import Play from './components/Play/Play';
import moment from "moment"
import NotFound from './components/NotFound/NotFound';
import ModalCollection from './components/ModalCollection/ModalCollection';
import "./css/materialize.min.css";
import "./css/materialIcon.css";

import { githubSync } from "./functions/backup";
import firebase from "./Firebase";
import Auth from './Auth';
import { cookieParser } from "./functions/cookie";
const merge = require('deepmerge');

class App extends React.Component {
  constructor(props) {
    super(props);
    const data = JSON.parse(window.localStorage.getItem("data"));
    this.state = data !== null ? data : {};
  }

  componentDidMount() {
    this.setState({
      signInCheck: false,
      signedIn: false,
    })
    setInterval(() => {
      window.localStorage.setItem("data", JSON.stringify(this.state));
    }, 5000)
    setInterval(() => {
      const setState = this.setState.bind(this);
      //console.log("呼びます")
      githubSync(this.state, setState);
    }, 10000)
  }

  accessor = (state, id = this.props.currentId, prefix) => {
    const keyName = `${prefix}_${id}`;
    //console.log(state);
    const question = this.state[`question_${id}`];
    console.log(question);
    console.log(keyName);
    if (question === undefined) return false;
    this.setState({
      [keyName]: merge(
        (this.state[keyName] === undefined ? {} : this.state[keyName]),
        state,
        { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
      )
    });
    console.log({
      [keyName]: merge(
        (this.state[keyName] === undefined ? {} : this.state[keyName]),
        state,
        { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
      )
    })
    console.log(this.state);
  }

  generateQuestion = (json = false) => {
    const genId = () => {
      const number = Math.random();
      number.toString(36);
      return number.toString(36).substr(2, 5);
    };
    const id = genId();
    this.setState({
      [`question_${id}`]: {
        title: !json ? "無題のクイズ" : json.title,
        description: !json ? moment().format("YYYY/MM/DD HH:mm:ssのクイズ") : json.description,
        id,
        questions: [],
        shuffleOptions: false,
        shuffleQuestions: false,
        hardMode: false,
        challengeJson: json,
        manualScrolling: false
      }
    })
    return id;
  }


  render = () => {
    const setState = this.setState.bind(this);
    global.dumpAll = () => JSON.stringify(this.state);
    return (
      <div className="App">
        <Auth setState={(state) => this.setState(state)} onLoggedIn={() => { githubSync(this.state, setState, true, true) }} />
          <Header openAccountMenu={openAccountMenu} state={this.state} accessor={(state) => this.setState(state)} />
          <Accounts state={this.state} accessor={(state) => this.setState(state)} />
          <Switch>
            <Route exact path="/" render={() => <Top />} />
            <Route exact path="/q/:id/play"
              render={(props) => <Play
                key={props.match.params.id}
                state={this.state[`question_${props.match.params.id}`]}
                accessor={(state) => this.accessor(state, props.match.params.id, 'question')}
                playStateAccessor={(state) => this.accessor({...state, recordedAt: new Date()}, props.match.params.id, 'playState')}
                playState={this.state[`playState_${props.match.params.id}`]}
                baseAccessor={this.setState}
              />} />
            <Route exact path="/q/:id"
              render={(props) => <Dashboard
                key={props.match.params.id}
                state={this.state[`question_${props.match.params.id}`]}
                baseState={this.state}
                accessor={(state) => this.accessor(state, props.match.params.id, 'question')}
                baseAccessor={(state) => this.setState(state)}
              />} />
            <Route render={() => <NotFound />} />
          </Switch>
          <Questions generateQuestion={this.generateQuestion} state={this.state} baseAccessor={(state) => this.setState(state)} />
          <ModalCollection state={this.state} generateQuestion={this.generateQuestion} />
        {/*  <Footer /> */}
      </div >
    )
  };
}

export default withRouter(App);
