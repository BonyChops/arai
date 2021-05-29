import M from 'materialize-css';
import { Button, Card, Row, Col, Container, Section, TextInput, Tab, Tabs, Textarea, Toast, Modal, Icon, Switch } from 'react-materialize';
import React from "react";
import yaml from "js-yaml";
import sampleYaml from "../resources/sample.yml";
import fetch from "node-fetch";
import { isMobile } from "react-device-detect";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "無題のクイズ",
            description: "",
            questions: [],
            json: "",
            yaml: {},
            jsonBuffer: "",
            yamlBuffer: "",
            jsonRaw: "",
            isJsonValid: true,
            isYamlValid: true,
            jsonMinify: false,
            jsonEditable: false,
            showMore: false,
            shuffleOptions: false,
            shuffleQuestions: false
        }
    }

    componentDidUpdate = () => {

    }

    componentDidMount = async () => {
        this.generateJson();
        console.log(await (await fetch(sampleYaml)).text())
        this.tryEditYaml(await (await fetch(sampleYaml)).text(), true, true);
    }

    handleChange = (event, target) => {
        console.log(target)
        this.setState({ [target]: (event.target.value) });
        this.generateJson({ [target]: (event.target.value) });
    }

    handleChangeBool = (event, target) => {
        console.log(target)
        this.setState({ [target]: (event.target.checked) });
        this.generateJson({ [target]: (event.target.checked) });
    }

    handleChangeToggle = (target) => {
        this.setState({ [target]: !this.state[target] });
        this.generateJson({ [target]: !this.state[target] });
        M.textareaAutoResize(document.querySelector('textarea'));
    }

    handleKeyDown = (e, title) => {
        if (e.key === 'Tab' && e.keyCode !== 229) {
            e.preventDefault();
            const textareaElement = e.target;
            const currentText = textareaElement.value;
            const start = textareaElement.selectionStart;
            const end = textareaElement.selectionEnd;
            const spaceCount = 4;
            const substitution = Array(spaceCount + 1).join(' ');
            const newText = currentText.substring(0, start) + substitution + currentText.substring(end, currentText.length);
            this.setState({
                [title]: newText,
            }, () => {
                textareaElement.setSelectionRange(start + spaceCount, start + spaceCount);
            });
        }
    }


    /*     tryEditJson = (event) => {
            this.setState({ jsonBuffer: event.target.value });
            let json;
            try {
                json = JSON.parse(event.target.value);
            } catch (e) {
                this.setState({ isJsonValid: false });
            }
            this.setState({ isJsonValid: true });
            this.setState({ json });
            this.setState(json);
        } */
    tryEditJson = (event, check = false) => {
        this.setState({ jsonBuffer: event.target.value });
        if (!check) {
            return;
        }
        let json;
        try {
            json = JSON.parse(event.target.value);
        } catch (e) {
            this.setState({ isJsonValid: false });
            return;
        }
        this.deleteOptions(json);


        this.setState({ isJsonValid: true });
        this.setState({ json });
        this.setState(json);
        try {
            this.generateYaml(json.questions);
        } catch (e) {
            console.error("Failed to generateYaml", e)
        }
    }

    tryEditYaml = (event, check = false, loadDefault = false) => {
        const yamlBuffer = !loadDefault ? event.target.value : event;

        this.setState({ yamlBuffer });
        if (!check) {
            return;
        }
        let yamlData;
        M.textareaAutoResize(document.querySelector('textarea'));
        try {
            yamlData = yaml.load(yamlBuffer);
            if (!(typeof yamlData === 'object' && yamlData !== null && !Array.isArray(yamlData))) {
                throw new Error("Incorrect Type");
            }
        } catch (e) {
            this.setState({ isYamlValid: false });
            return;
        }
        this.setState({
            isYamlValid: true,
            yaml: yamlData,
            questions: this.generateQuestions(yamlData)
        });
        console.log(this.generateQuestions(yamlData))
        this.generateJson({
            isYamlValid: true,
            yaml: yamlData,
            questions: this.generateQuestions(yamlData)
        });
    }

    generateQuestions = (yamlData) => {
        return Object.keys(yamlData).map(key => {
            const q = yamlData[key];
            if (q === null) {
                return q;
            }

            return (
                {
                    title: key,
                    answers: Array.isArray(q) ? q.map((el) => {
                        console.log(typeof el);
                        if (typeof el === "string" || typeof el === "number") {
                            return ({
                                title: String(el),
                                answer: q.length <= 1 // 必然的にtrue
                            });
                        } else if ((typeof el === "object" && !Array.isArray(el) && el !== null)) {
                            console.log(el[Object.keys(el)[0]])
                            return ({
                                title: Object.keys(el)[0],
                                answer: (["a", "answer", "ans"]).includes(el[Object.keys(el)[0]])
                            })
                        }
                        return false;
                    }) : [{
                        title: q,
                        answer: true
                    }]
                }
            )
        });
    }

    generateJson = (object = {}) => {
        const buffer = { ...this.state };
        this.deleteOptions(object);
        this.deleteOptions(buffer);
        this.setState({
            json: JSON.stringify(Object.assign(buffer, object), null, 4),
            jsonBuffer: JSON.stringify(Object.assign(buffer, object), null, 4),
            jsonRaw: JSON.stringify(Object.assign(buffer, object))
        });
        M.textareaAutoResize(document.querySelector('textarea'));
    }

    generateYaml = (questions = this.state.questions) => {
        const yamlData = {};
        for (const question of questions) {
            console.log(question)
            yamlData[question.title] = question.answers.length <= 1 ? question.answers[0].title : question.answers.map(answer => (answer.answer ? ({
                [answer.title]: "answer"
            }) : answer.title))
        }
        console.log(yamlData);
        const yamlDumped = yaml.dump(yamlData).replace(/\n[^\s]+(.*):(.*)$/mg, (str) => "\n" + str)
        console.log(yamlDumped)
        this.setState({
            yaml: yamlDumped,
            yamlBuffer: yamlDumped
        });
    }


    deleteOptions = (object) => {
        delete object.json;
        delete object.yaml;
        delete object.isJsonValid;
        delete object.isYamlValid;
        delete object.jsonBuffer;
        delete object.yamlBuffer;
        delete object.jsonRaw;
        delete object.jsonMinify;
        delete object.jsonEditable;
        delete object.showMore;
    }


    render() {
        const SwitchTemp = (props) => (<Col s={12} m={4}>
            <Row>
                <Col s={2}>
                    <Switch {...props} />
                </Col>
                <Col s={10}>
                    {props.title}
                </Col>
            </Row>
        </Col>)
        return (
            <Section className="no-pad-bot" id="index-banner" >
                <Container>
                    <br /><br />
                    <Row className="center">
                        <Col s={12} m={6} >
                            <TextInput s={12} label="Title" validate id="title" value={this.state.title} onChange={(e) => this.handleChange(e, "title")} />
                            <TextInput s={12} label="Description" validate id="description" value={this.state.description} onChange={(e) => this.handleChange(e, "description")} />
                        </Col>
                        <Col s={12} m={6} >
                            <Button large waves="light" onClick={() => M.Modal.getInstance(document.querySelector('#alert')).open()}><Icon left>play_arrow</Icon>開始</Button>
                        </Col>

                    </Row>

                    <Button flat waves="light" onClick={() => this.handleChangeToggle("showMore")}><Icon left>{!this.state.showMore ? "expand_more" : "expand_less"}</Icon>詳細設定</Button>
                    {this.state.showMore ? <Row><br />
                        <SwitchTemp
                            id="soptions-switch"
                            offLabel=""
                            checked={this.state.shuffleOptions}
                            onChange={(e) => this.handleChangeBool(e, "shuffleOptions")}
                            onLabel=""
                            title="選択肢の順番を入れ替える"
                        />
                        <SwitchTemp
                            id="squestions-switch"
                            offLabel=""
                            checked={this.state.shuffleQuestions}
                            onChange={(e) => this.handleChangeBool(e, "shuffleQuestions")}
                            onLabel=""
                            title="出題順を入れ替える"
                        />
                    </Row> : null}
                    <br /><br />
                    <Tabs className='tab-demo z-depth-1 light-blue-text lighten-1' >
                        <Tab title="問題編集(yaml)">
                            <Textarea s={12} id="yaml-editor"
                                label={this.state.isYamlValid ? "" : "YAML構文に問題があります"}
                                value={this.state.yamlBuffer}
                                onChange={this.tryEditYaml}
                                onBlur={(e) => this.tryEditYaml(e, true)}
                                onKeyDown={(e) => this.handleKeyDown(e, "yamlBuffer")}
                            />
                        </Tab>
                        <Tab title="構成ファイル(JSON)" >
                            <br />
                            <Switch
                                id="minify-switch"
                                offLabel=""
                                checked={this.state.jsonMinify}
                                onChange={(e) => this.handleChangeBool(e, "jsonMinify")}
                                onLabel="Minify"
                            />
                            {!this.state.jsonMinify ? <Switch
                                id="edit-switch"
                                offLabel=""
                                checked={this.state.jsonEditable}
                                onChange={(e) => this.handleChangeBool(e, "jsonEditable")}
                                onLabel="編集する"
                            /> : null}
                            <Textarea s={12}
                                value={this.state.jsonMinify ? this.state.jsonRaw : this.state.jsonBuffer}
                                label={this.state.isJsonValid ? "" : "JSON構文に問題があります"}
                                validate={true}
                                disabled={this.state.jsonMinify || !this.state.jsonEditable}
                                onChange={this.tryEditJson}
                                onBlur={(e) => this.tryEditJson(e, true)}
                                onKeyDown={(e) => this.handleKeyDown(e, "jsonBuffer")}
                            />
                        </Tab>
                        {/* <Tab title="構成ファイル(JSON-min)" >
                            <Textarea s={12} value={this.state.jsonRaw}
                                disabled={true}
                            />
                        </Tab> */}
                        <Tab title="GUI編集(開発中)" disabled>Test 2</Tab>
                    </Tabs>
                    <Modal
                        id='alert'
                        header='問題が作成されていません'
                        bottomSheet={isMobile}>
                        問題を作成してください
                    </Modal>
                </Container>
            </Section>
        )
    }
}

export default Dashboard;