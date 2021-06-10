import { cookieParser } from "./cookie"
import fetch from "node-fetch"

const fetchRequest = async (url, method = "GET", data = undefined) => {
    return await (await fetch(url, {
        method, // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Authorization': `Bearer ${cookieParser().find(cookie => cookie.key === "GITHUB_TOKEN").value}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        redirect: 'follow', // manual, *follow, error
        body: data === undefined ? undefined : JSON.stringify(data)
    })).json();
}

const fetchRequestWithNoCors = async (url) => {
    return await (await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        redirect: 'follow', // manual, *follow, error
    })).json();
}

const githubSync = async (state, setState, deleteSecret, force = false) => {
    const getUserName = async () => {
        const userResult = await fetchRequest(`https://api.github.com/user`);
        const user = state.user;
        console.log(userResult);
        user.id = userResult.login;
        setState({ user });
        return userResult.login;
    }

    const fetchDataBase = async (id) => {
        const userGists = await fetchRequest(`https://api.github.com/users/${id}/gists`);
        const userGist = userGists.find(gist => gist.files["araidb.json"] !== undefined);
        console.log(userGist === undefined)
        const database = userGist === undefined ? undefined : await fetchRequestWithNoCors(userGist.files["araidb.json"].raw_url);
        return {userGist, database};
    }

    if (!(state.signedIn && state.user.loginProblem !== true) && !force) {
        return
    }
    const id = (state.user.id === undefined) ? await getUserName() : state.user.id
    const {userGist, database} = await fetchDataBase(id);

    const data = {
        description: "test",
        public: false,
        files: {
            "test.txt": {
                content: "Hello"
            }
        }
    }
}

export { githubSync };