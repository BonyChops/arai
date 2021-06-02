import M from 'materialize-css';
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
import NotFound from './components/NotFound/NotFound';
import ModalCollection from './components/ModalCollection/ModalCollection';
import firebase from "./Firebase";
import fetch from "node-fetch"
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
        shuffleQuestions: false,
        hardMode: false
      }
    })
    return id;
  }

  loginGitHub = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('gist');
    provider.setCustomParameters({
      'allow_signup': 'true'
    });
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential;

        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const token = credential.accessToken;
        document.cookie = `GITHUB_TOKEN=${token};secure`;
        console.log(document.cookie.split(";").map(cookie => ({ key: cookie.split("=")[0], value: cookie.split("=")[1] })))
        M.toast({ html: "GitHubでログインしました" });
        const data = {
          description: "test",
          public: false,
          files: {
            "test.txt": {
              content: "Hello"
            }
          }
        }
        fetch("https://api.github.com/gists", {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          },
          redirect: 'follow', // manual, *follow, error
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
          .then(response => response.json())
          .then(data => console.log(data));
        console.log(document.cookie)
        // The signed-in user info.
        const user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  render = () => {
    return (
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          <Button onClick={this.loginGitHub}>login</Button>
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
