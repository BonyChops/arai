import M from "materialize-css";
import { cookieParser } from "./cookie"
import fetch from "node-fetch"
import ReadmeFile from "../resources/gistMds/README.md"
const merge = require('deepmerge');
const { diff } = require("deep-object-diff");
const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))

const fetchRequest = async (url, method = "GET", data = undefined) => {
    return await (await fetch(url, {
        method, // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Authorization': `Bearer ${cookieParser().find(cookie => cookie.key === "GITHUB_TOKEN").value}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        redirect: 'follow', // manual, *follow, error
        body: data === undefined ? undefined : JSON.stringify(data, null, 2)
    })).json();
}

const fetchRequestWithNoCors = async (url) => {
    return await (await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        redirect: 'follow', // manual, *follow, error
    })).json();
}

const githubSync = async (stateArg, setState, modifyDataBase = false, force = false) => {
    return //Under construction
    const state = JSON.parse(JSON.stringify(stateArg))
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
        console.log(userGists);
        const userGist = userGists.find(gist => gist.files["araidb.json"] !== undefined);
        console.log(userGist);
        console.log(userGist === undefined)
        const database = userGist === undefined ? undefined : userGist === undefined ? "{}" : await fetchRequestWithNoCors(userGist.files["araidb.json"].raw_url);
        return { userGist, database };
    }

    if (state.user === undefined || (!(state.signedIn && state.user.loginProblem !== true) && !force)) {
        return
    }
    const id = (state.user?.id === undefined) ? await getUserName() : state.user.id
    const { userGist, database } = await fetchDataBase(id);
    console.log(userGist);
    console.log(database);
    console.log((await fetch(ReadmeFile)).text)
    if (userGist === undefined) {
        //DB not exists
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(ReadmeFile);
        console.log(state);
        const data = {
            description: "ARAIのデータベースファイルです",
            public: false,
            files: {
                "arai.md": {
                    content: await (await fetch(ReadmeFile)).text()
                },
                "araidb.json": {
                    content: JSON.stringify(deletePrivateData(state), null, 2)
                }
            }
        }
        await fetchRequest(`https://api.github.com/gists`, "POST", data)
    } else {
        //DB exists
        let dbToUp = state;
        if (modifyDataBase) {
            console.log(force ? merge(state, database) : database);
            console.log(database)
            console.log(state)
            dbToUp = deletePrivateData(force ? merge(state, database) : database);
            setState(dbToUp);
            if (force) {
                return;
            }
        }
        if (JSON.stringify(diff(deletePrivateData(dbToUp), database)) === JSON.stringify({})) {
            console.log("Everything up to date.");
            return;
        }
        await fetchRequest(`https://api.github.com/gists/${userGist.id}`, "PATCH", {
            files: {
                "araidb.json": {
                    content: JSON.stringify(deletePrivateData(dbToUp), null, 2)
                }
            }
        })
        console.log("updated")

    }
}

const generateQuestionGist = async (data, accessor) => {
    M.toast({ html: "共有しています..." })
    const araiReadMe = `
# ${data.title}
${data.description}

## ARAI
This gist is auto generated by ARAI(https://bonychops.github.io/arai/)
`
    const postData = {
        description: data.title + " (ARAI Question)",
        public: false,
        files: {
            "arai.md": {
                content: araiReadMe
            },
            "araidb.json": {
                content: JSON.stringify(deletePrivateData(data), null, 2)
            }
        }
    }
    const result = await fetchRequest(`https://api.github.com/gists`, "POST", postData);
    console.log(result)
    accessor({ shareId: result.id });
    getModal('#questionShared').open();
}

const importFromGist = async (id, generateQuestion, pushFunc) => {
    M.toast({ html: "インポートしています..." });
    const fetchDataBase = async (id) => {
        const gist = await fetchRequestWithNoCors(`https://api.github.com/gists/${id}`);
        const database = gist === undefined ? undefined : gist === undefined ? "{}" : await fetchRequestWithNoCors(gist.files["araidb.json"].raw_url);
        return { gist, database };
    }
    try {
        const { gist, database } = await fetchDataBase(id);
        const qId = generateQuestion(database);
        pushFunc(`/q/${qId}`);
        M.toast({ html: `${database.title}を読み込みました．` });

    } catch (e) {
    M.toast({ html: "読み込みに失敗しました(IDが間違っている可能性があります)" });
    console.error(e);
    }

    try {
        getModal('#importLink').close();
        getModal('#questions').close();
    } catch (e) {
    }
    return

}

const deletePrivateData = (objectArg) => {
    const object = JSON.parse(JSON.stringify(objectArg))
    delete object.user;
    delete object.db;
    delete object.backupData;
    delete object.signInCheck;
    delete object.signedIn;
    delete object.shareId;
    return object;
}

export { githubSync, generateQuestionGist, importFromGist };