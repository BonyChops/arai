//import M from 'materialize-css';
import { Button, Card, Row, Col, Container, Section, TextInput } from 'react-materialize';
import Header from './components/Header/Header';
import Footer from "./components/Footer/Footer";
import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    }
  }


  render = () => {
    return (
      <div className="App">
        <Header />

        <Dashboard />
        <Section>

        <Footer />
        </Section>
      </div >
    )
  };
}

export default App;
