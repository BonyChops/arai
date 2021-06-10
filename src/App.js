import M from 'materialize-css';
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

    setInterval(() => {
      window.localStorage.setItem("data", JSON.stringify(this.state));
      console.log("saved")
      console.log(this.state)
    }, 5000)
    setInterval(() => {
      const setState = this.setState.bind(this)
      const deleteSecret = this.deleteSecret.bind(this);
      githubSync(this.state, setState, deleteSecret);
    }, 60000)
  }

  componentDidMount() {
    this.setState({
      signInCheck: false,
      signedIn: false,
    })
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
        shuffleQuestions: false,
        hardMode: false
      }
    })
    return id;
  }

  deleteSecret = (obj) => {
    delete obj.user;
    delete obj.backupData;
  }

  render = () => {
    const setState = this.setState.bind(this);
    const deleteSecret = this.deleteSecret.bind(this);
    global.dumpAll = () => JSON.stringify(this.state);
    return (
      <div className="App">
        <Auth setState={(state) => this.setState(state)} onLoggedIn={() => { console.log("calling"); githubSync(this.state, setState, deleteSecret, true) }} />
        <Router basename={process.env.PUBLIC_URL}>
          <Header openAccountMenu={openAccountMenu} state={this.state} />
          <Accounts state={this.state} setState={this.setState} />
          <Switch>
            <Route exact path="/" render={() => <Top />} />
            <Route exact path="/q/:id/play"
              render={(props) => <Play
                key={props.match.params.id}
                state={this.state[`question_${props.match.params.id}`]}
                accessor={(state) => this.accessor(state, props.match.params.id)}
                baseAccessor={this.setState}
              />} />
            <Route exact path="/q/:id"
              render={(props) => <Dashboard
                key={props.match.params.id}
                state={this.state[`question_${props.match.params.id}`]}
                accessor={(state) => this.accessor(state, props.match.params.id)}
                baseAccessor={this.setState}
              />} />
            <Route render={() => <NotFound />} />
          </Switch>
          <Questions generateQuestion={this.generateQuestion} state={this.state} baseAccessor={(state) => this.setState(state)} />
        </Router>
        <ModalCollection />
        {/*  <Footer /> */}
      </div >
    )
  };
}

export default withRouter(App);
