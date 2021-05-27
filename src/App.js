import 'materialize-css';
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

        <Container>
          <Section>
            <Row>
              <Col s={12} m={4}>
                <form>
                  <div class="input-field col s6">
                    <input placeholder="Placeholder" id="first_name" type="text" class="validate" />
                    <label for="first_name">First Name</label>
                  </div>
                </form>
              </Col>
              <Col s={12} m={4}>
                <div class="icon-block">
                  <h2 class="center light-blue-text"><i class="material-icons">group</i></h2>
                  <h5 class="center">User Experience Focused</h5>

                  <p class="light">By utilizing elements and principles of Material Design, we were able to create a framework that incorporates components and animations that provide more feedback to users. Additionally, a single underlying responsive system across all platforms allow for a more unified user experience.</p>
                </div>
              </Col>
              <Col s={12} m={4}>
                <div class="icon-block">
                  <h2 class="center light-blue-text"><i class="material-icons">settings</i></h2>
                  <h5 class="center">Easy to work with</h5>

                  <p class="light">We have provided detailed documentation as well as specific code examples to help new users get started. We are also always open to feedback and can answer any questions a user may have about Materialize.</p>
                </div>
              </Col>
            </Row>
          </Section>
        </Container>
        <Footer />
        </Section>
      </div >
    )
  };
}

export default App;
