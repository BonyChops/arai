import { isMobile } from "react-device-detect"
import M from 'materialize-css';
import { Button, SideNavItem, Icon, SideNav } from "react-materialize"
import firebase from "../../Firebase";
import {cookieParser} from "../../functions/cookie";
const getSideNav = (name) => (M.Sidenav.getInstance(document.querySelector(name)))
const openAccountMenu = () => {
    if (isMobile) {
        getSideNav("#accounts-pc").open();

    } else {
        getSideNav("#accounts-pc").open();
    }
}


const loginGitHub = (props) => {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('gist');
    provider.setCustomParameters({
        'allow_signup': 'true'
    });
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            const credential = result.credential;

            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            const token = credential.accessToken;
            document.cookie = `GITHUB_TOKEN=${token};secure`;
            M.toast({ html: "GitHubでログインしました" });
            result.user.loginProblem = false;
            props.setState({
                signInCheck: true,
                signedIn: true,
                user: result.user
            })
            const data = {
                description: "test",
                public: false,
                files: {
                    "test.txt": {
                        content: "Hello"
                    }
                }
            }
            /* fetch("https://api.github.com/gists", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                redirect: 'follow', // manual, *follow, error
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            })
                .then(response => response.json())
                .then(data => console.log(data)); */
            console.log(document.cookie)
            // The signed-in user info.
            const user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}


const Accounts = (props) => {
    const menuData = {
        user: {
            background: 'https://placeimg.com/640/480/ocean',
            email: props.state.signedIn ? props.state.user.email : 'jdandturk@gmail.com',
            image: props.state.signedIn ? props.state.user.photoURL : 'https://github.com/github.png',
            name: props.state.signedIn ? props.state.user.displayName : '未ログイン'
        },
        menu: [
            {
                icon: "cloud",
                content: "GitHubでログイン(β)",
                onClick: () => {
                    const result = window.confirm('**この機能はベータ版です**\n\nGitHub Gistsに問題を同期します．ベータ版ですので，バックアップが上手く動作しない可能性があります．必ずご自身でもバックアップを取るようお願いします．\n\nログインが完了すると，自動的にバックアップが開始します．よろしいですか？');

                    if (result) {
                        loginGitHub(props);
                    } else {
                        M.toast({ html: "ログインはキャンセルされました" })
                    }
                },
                href: "#login"
            }
        ]
    }
    return (
        <div>
            <SideNav
                id="accounts-pc"
                options={{
                    draggable: true
                }}
                trigger={<></>}
            >

                <SideNavItem
                    user={menuData.user}
                    userView
                />
                {menuData.menu.map((v, k) => (<SideNavItem
                    key={k}
                    href={v.href}
                    icon={<Icon>{v.icon}</Icon>}
                    onClick={v.onClick}
                >
                    {v.content}
                </SideNavItem>))}

                {/* <SideNavItem href="#!second">
                    Second Link
                </SideNavItem>
                <SideNavItem divider />
                <SideNavItem subheader>
                    Subheader
                </SideNavItem>
                <SideNavItem
                    href="#!third"
                    waves
                >
                    Third Link With Waves
                </SideNavItem> */}
            </SideNav>
        </div>
    )
}

export default Accounts
export { openAccountMenu }