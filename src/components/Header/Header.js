import M from 'materialize-css';
import { Button, Col, Icon, Preloader, Row } from 'react-materialize';
import { Link, withRouter } from "react-router-dom"
import {cookieParser} from "../../functions/cookie";
const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))
const Header = (props) => {
    console.log(props.state.signedIn)
    return (
        <nav className="light-blue lighten-1" role="navigation">
            <div className="nav-wrapper container"><Link id="logo-container" to="/" className="brand-logo">ARAI</Link>
                <ul className="right hide-on-med-and-down">
                    <li><Button waves="light" flat className="white-text" onClick={() => getModal("#questions").open()}>問題集</Button></li>
                    <li>
                        <Button className="flat" flat onClick={() => props.openAccountMenu()}><Row className="" style={{ height: "100%" }}>
                            <Col s={6} className="" style={{ height: "100%" }}>
                                <div className="">
                                    {
                                        props.state.signedIn ?
                                            (!props.state.user.loginProblem ?
                                                <img className="circle" src={props.state.user?.photoURL} width={"30px"} /> :
                                                <Icon className="yellow-text darken-3">warning</Icon>) :
                                            <Icon>account_circle</Icon>
                                    }
                                </div>
                            </Col>{/* <Col s={6} className="valign-wrapper" style={{ height: "100%" }}>
                                <div style={{ height: "40px" }}>
                                    <Preloader
                                        className=""
                                        active
                                        color="blue"
                                        flashing={false}
                                        size="small"
                                    />
                                </div>
                            </Col> */}
                        </Row></Button>
                    </li>
                </ul>

                <ul id="nav-mobile" className="sidenav">
                    <li><Button waves="light" flat className="white-text" onClick={() => getModal("#questions").open()}>問題集</Button></li>
                </ul>
                <Link onClick={() => getModal("#questions").open()} flat data-target="nav-mobile" className="sidenav-trigger white-text"><i className="material-icons">menu</i></Link>
            </div>
        </nav>
    )
}
export default withRouter(Header)