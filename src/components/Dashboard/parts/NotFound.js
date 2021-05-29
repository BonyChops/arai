import M from 'materialize-css';
import { Button, Icon, Row } from "react-materialize";
const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))

const NotFound = (props) => {
    return (
        <div>
            <h4 className="header center">問題が見つかりませんでした</h4>
            <Row className="center">
                <Button waves="light" className="orange" onClick={() => getModal("#questions").open()}><Icon left>edit</Icon>別の問題を開く</Button>,
                </Row>
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
    )
}
export default NotFound;