import M from "materialize-css"
import { Button, Col, Container, Icon, Row, Section } from "react-materialize"
import Image1 from "../../resources/2.png";
import Image2 from "../../resources/1.png";
import Image3 from "../../resources/0.png";
import GithubIcon from "../../resources/github.png"

const Top = (props) => {
    return (
        <Section>
            <Container>
                <h1 className="header center orange-text">ARAI</h1>
                <Row className="center">
                    <h5 className="header col s12 light">Artificially Randomized Arrangements of Issues</h5>
                    <h6 className="header col s12 light">反復学習で圧倒的成長💪</h6>
                </Row>
                <Row className="center">
                    <Button onClick={() => M.Modal.getInstance(document.querySelector('#questions')).open()} large waves="light" className="orange"><Icon left>edit</Icon>問題を選ぶ</Button>
                </Row>
                <h6 className="center"><img src={GithubIcon} style={{height: "16px"}}/><a href="https://github.com/BonyChops/arai" target="_blank" rel="noopener noreferrer">BonyChops/arai</a></h6>
                <br />
                <Row>
                    <Col s={4} className="center">
                        <img src={Image1} style={{ width: "80%" }} />
                    </Col>
                    <Col s={4} className="center">
                        <img src={Image2} style={{ width: "80%" }} />
                    </Col>
                    <Col s={4} className="center">
                        <img src={Image3} style={{ width: "80%" }} />
                    </Col>
                </Row>
            </Container>
        </Section>
    )
}
export default Top;