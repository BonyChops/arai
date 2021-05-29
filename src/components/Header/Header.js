import M from 'materialize-css';
import { Button } from 'react-materialize';
import { Link, withRouter } from "react-router-dom"
const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))

const Header = (props) => {
    return (
        <nav className="light-blue lighten-1" role="navigation">
            <div className="nav-wrapper container"><Link id="logo-container" /* to="/" */ className="brand-logo">ARAI</Link>
                <ul className="right hide-on-med-and-down">
                    <li><Button waves="light" flat className="white-text" onClick={() => getModal("#questions").open()}>問題集</Button></li>
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