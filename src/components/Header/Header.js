import M from 'materialize-css';
import { Button, Icon } from 'react-materialize';
import { Link, withRouter } from "react-router-dom"
const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))
const cookieParser = () => (document.cookie.split(";").map(cookie => ({ key: cookie.split("=")[0], value: cookie.split("=")[1] })));
const Header = (props) => {
    console.log(props.state.signedIn)
    return (
        <nav className="light-blue lighten-1" role="navigation">
            <div className="nav-wrapper container"><Link id="logo-container" /* to="/" */ className="brand-logo">ARAI</Link>
                <ul className="right hide-on-med-and-down">
                    <li><Button waves="light" flat className="white-text" onClick={() => getModal("#questions").open()}>問題集</Button></li>
                    <li><Link className="" onClick={() => props.openAccountMenu()}>
                        {
                            props.state.signedIn ?
                                (!props.state.user.loginProblem ?
                                    <img className="circle" src={props.state.user?.photoURL} width={"25px"} /> :
                                    <Icon className="yellow-text darken-3">warning</Icon>) :
                                <Icon>account_circle</Icon>}
                    </Link></li>
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