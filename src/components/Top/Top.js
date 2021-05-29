import M from "materialize-css"
import { Button, Container, Row, Section } from "react-materialize"

const Top = (props) => {
    return (
        <Section>
            <Container>
                <h1 className="header center orange-text">ARAI</h1>
                <Row className="center">
                    <h5 className="header col s12 light">Artificially Randomized Arrangements of Issues</h5>
                </Row>
                <Row className="center">
                    <Button onClick={() => M.Modal.getInstance(document.querySelector('#questions')).open()} large waves="light" className="orange">Get Started</Button>
                </Row>
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            </Container>
        </Section>
    )
}
export default Top;