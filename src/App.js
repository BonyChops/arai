import 'materialize-css';
import { Button, Card, Row, Col, Container, Section } from 'react-materialize';
import Header from './components/Header/Header';
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="section no-pad-bot" id="index-banner">
        <div className="container">
          <br /><br />
          <h1 className="header center orange-text">Starter Template</h1>
          <div className="row center">
            <h5 className="header col s12 light">A modern responsive front-end framework based on Material Design</h5>
          </div>
          <div className="row center">
            <a href="http://materializecss.com/getting-started.html" id="download-button" className="btn-large waves-effect waves-light orange">Get Started</a>
          </div>
          <br /><br />
        </div>

        <Container>
          <Section>
            <Row>
              <Col s={12} m={4}>
                <div className="icon-block">
                  <h2 className="center light-blue-text"><i className="material-icons">flash_on</i></h2>
                  <h5 className="center">Speeds up development</h5>

                  <p className="light">We did most of the heavy lifting for you to provide a default stylings that incorporate our custom components. Additionally, we refined animations and transitions to provide a smoother experience for developers.</p>
                </div>
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
      </div>
    </div>
  );
}

export default App;
