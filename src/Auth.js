import React from "react";
import firebase from "./Firebase";
import M from "materialize-css";
import {cookieParser} from "./functions/cookie";

class Auth extends React.Component {
    constructor(state) {
        super(state);
    }


    _isMounted = false;

    componentDidMount = () => {

        this._isMounted = true;


        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log(user);
                if (this._isMounted) {
                    console.log(cookieParser())
                    const isProblem = cookieParser().find(cookie => cookie.key === "GITHUB_TOKEN") === undefined
                    if (isProblem) {
                        M.toast({ html: `<i class="material-icons left">warning</i>ログインに問題があります` })
                        user.loginProblem = isProblem
                    } else {
                        M.toast({ html: `GitHub: ${user.displayName}でログイン済` });
                        this.props.onLoggedIn();
                    }
                    this.props.setState({
                        signInCheck: true,
                        signedIn: true,
                        user
                    });
                }
            } else {
                if (this.props._isMounted) {
                    this.props.setState({
                        signInCheck: true,
                        signedIn: false,
                    });
                }
            }
        })
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        return (
            null
        )
    }
}

export default Auth;