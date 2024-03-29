import M from 'materialize-css';
import { Button, Card, Row, Col, Container, Section, TextInput, Tab, Tabs, Textarea, Toast, Modal, Icon, Switch, Range } from 'react-materialize';
import React from "react";
import yaml from "js-yaml";
import sampleYaml from "../../resources/sample.yml";
import fetch from "node-fetch";
import { isMobile } from "react-device-detect";
import NotFound from '../NotFound/NotFound';
import { withRouter } from 'react-router';
import { generateQuestionGist } from '../../functions/backup';
import moment from "moment";

const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)));

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            randomAnswerOptions: false
        }

    }

    componentDidMount = async () => {
        if (this.props.state === undefined) {
            return;
        }
        if (this.props.state.challengeJson !== false) {
            console.log("Challenging");
            setTimeout(() => {
                this.tryEditJson(JSON.stringify(this.props.state.challengeJson), true, true);
                this.props.accessor({
                    challengeJson: false
                });
            }, 200);
        } else {
            if (this.props.state.questions.length <= 0) {
                this.tryEditYaml(await (await fetch(sampleYaml)).text(), true, true);
            } else {
                console.log("generate")
                this.generateYaml();
                this.generateJson();
            }
        }
        //console.log(await (await fetch(sampleYaml)).text())
        setTimeout((() => {
            this.textareaAutoFix();
        }), 500);
        setTimeout((() => {
            this.textareaAutoFix();
        }), 1000);
        console.log("Finished");
    }

    textareaAutoFix = () => {
        try {
            M.textareaAutoResize(document.querySelector('textarea#json-editor'));
            M.textareaAutoResize(document.querySelector('textarea#yaml-editor'));
        } catch (e) { };
    }

    handleChange = (event, target, localChange = false) => {
        //console.log(target)
        const state = { [target]: (event.target.value) };
        if (localChange) {
            this.setState(state)
        } else {
            this.props.accessor(state);
        }
        this.generateJson({ [target]: (event.target.value) });
    }

    handleChangeNumber = (event, target, localChange = false) => {
        //console.log(target)
        const state = { [target]: Number(event.target.value) }
        if (localChange) {
            this.setState(state)
        } else {
            this.props.accessor(state);
        }
        this.generateJson({ [target]: Number(event.target.value) });
    }

    handleChangeBool = (event, target, localChange = false) => {
        const genState = () => ({ [target]: (event.target.checked) });
        console.log(genState());
        const randomAnswerOptions = this.props.state.questions.filter(q => q.answers.length <= 1);
        if (event.target.checked && randomAnswerOptions.length <= 1) {
            M.toast({ html: '一問一答形式の問題が2つ以上必要です．' });
            return;
        }
        //(localChange ? this.setState : this.props.accessor)();
        if (localChange) {
            this.setState(genState());
        } else {
            this.props.accessor(genState());
        }
        this.generateJson(genState());
    }

    handleChangeToggle = (target, localChange = false) => {
        const state = { [target]: !((localChange ? this.state : this.props.state)[target]) }
        console.log(state)
        //(localChange ? this.setState : this.props.accessor)({ [target]: !(localChange ? this.state : this.props.state)[target] });
        if (localChange) {
            this.setState(state)
        } else {
            this.props.accessor(state);
        }
        //this.generateJson(state);
        M.textareaAutoResize(document.querySelector('textarea'));
    }

    handleChangeValue = (value, target, localChange = false) => {
        //console.log(target)
        const state = { [target]: value }
        if (localChange) {
            this.setState(state)
        } else {
            this.props.accessor(state);
        }
        this.generateJson({ [target]: value });
    }

    handleKeyDown = (e, title, localChange = false) => {
        if (e.key === 'Tab' && e.keyCode !== 229) {
            e.preventDefault();
            const textareaElement = e.target;
            const currentText = textareaElement.value;
            const start = textareaElement.selectionStart;
            const end = textareaElement.selectionEnd;
            const spaceCount = 4;
            const substitution = Array(spaceCount + 1).join(' ');
            const newText = currentText.substring(0, start) + substitution + currentText.substring(end, currentText.length);
            if (localChange) {
                this.setState({
                    [title]: newText,
                }, () => {
                    textareaElement.setSelectionRange(start + spaceCount, start + spaceCount);
                });
            } else {
                this.props.accessor({
                    [title]: newText,
                }, () => {
                    textareaElement.setSelectionRange(start + spaceCount, start + spaceCount);
                });
            }

        }
    }


    /*     tryEditJson = (event) => {
            this.props.accessor({ jsonBuffer: event.target.value });
            let json;
            try {
                json = JSON.parse(event.target.value);
            } catch (e) {
                this.props.accessor({ isJsonValid: false });
            }
            this.props.accessor({ isJsonValid: true });
            this.props.accessor({ json });
            this.props.accessor(json);
        } */
    tryEditJson = (event, check = false, loadDefault = false) => {
        const target = loadDefault ? event : event.target.value;
        this.setState({ jsonBuffer: target });
        console.log(target);
        if (!check) {
            return;
        }
        let json;
        try {
            json = JSON.parse(target);
            console.log(target);
            console.log(json);
            console.log("Valid")
        } catch (e) {
            console.log("Not Valid")
            this.setState({ isJsonValid: false });
            return;
        }
        this.deleteOptions(json);

        console.log(json);
        this.setState({ isJsonValid: true, json });
        this.props.accessor(json);
        if (json.startPos === undefined) {
            this.props.accessor({ startPos: 1 });
        }
        if (json.endPos === undefined) {
            this.props.accessor({ startPos: json.questions.length });
        }
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
        console.log("TRY")
        try {
            yamlData = yaml.load(yamlBuffer);
            if (!(typeof yamlData === 'object' && yamlData !== null && !Array.isArray(yamlData))) {
                throw new Error("Incorrect Type");
            }
        } catch (e) {
            this.setState({ isYamlValid: false });
            return;
        }
        console.log("TRY2")
        this.setState({
            isYamlValid: true,
            yaml: yamlData,
        });
        const questions = this.generateQuestions(yamlData);
        const nonOptionQuestions = questions.filter(q => q.answers.length <= 1);
        this.props.accessor({
            questions,
            startPos: 1,
            endPos: questions.length,
            maxOptionNumber: nonOptionQuestions.length < 4 ? nonOptionQuestions.length : 4
        })
        //console.log(this.generateQuestions(yamlData))
        this.generateJson({
            isYamlValid: true,
            yaml: yamlData,
            questions,
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
                        //console.log(typeof el);
                        if (typeof el === "string" || typeof el === "number") {
                            return ({
                                title: String(el),
                                answer: q.length <= 1 // 必然的にtrue
                            });
                        } else if ((typeof el === "object" && !Array.isArray(el) && el !== null)) {
                            //console.log(el[Object.keys(el)[0]])
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
        console.log(object)
        const buffer = { ...this.props.state };
        this.deleteOptions(object);
        this.deleteOptions(buffer);
        this.setState({
            json: JSON.stringify(Object.assign(buffer, object), null, 4),
            jsonBuffer: JSON.stringify(Object.assign(buffer, object), null, 4),
            jsonRaw: JSON.stringify(Object.assign(buffer, object))
        });
        M.textareaAutoResize(document.querySelector('textarea'));
    }

    generateYaml = (questions = this.props.state.questions) => {
        const yamlData = {};
        for (const question of questions) {
            //console.log(question)
            yamlData[question.title] = question.answers.length <= 1 ? question.answers[0].title : question.answers.map(answer => (answer.answer ? ({
                [answer.title]: "answer"
            }) : answer.title))
        }
        //console.log(yamlData);
        const yamlDumped = yaml.dump(yamlData).replace(/\n[^\s]+(.*):(.*)$/mg, (str) => "\n" + str)
        //console.log(yamlDumped)
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
        delete object.id;
        delete object.jsonChallenge
        //delete object.hardMode;
    }


    render() {
        const SwitchTemp = (props) => (<Col s={12} m={4}>
            <Row>
                <Col s={4}>
                    <Switch {...props} />
                </Col>
                <Col s={8}>
                    {props.title}
                </Col>
            </Row>
        </Col>);

        const nonOptionQuestions = this.props.state.questions.filter(q => q.answers.length <= 1);

        return (
            <Section className="no-pad-bot" id="index-banner" >
                {this.props.state === undefined ? <NotFound /> : <Container>
                    <br /><br />
                    <Row className="center">
                        <Col s={12} m={6} >
                            <TextInput s={12} label="Title" validate id="title" value={this.props.state.title} onChange={(e) => this.handleChange(e, "title")} />
                            <TextInput s={12} label="Description" validate id="description" value={this.props.state.description} onChange={(e) => this.handleChange(e, "description")} />
                        </Col>
                        <Col s={12} m={6} >
                            <Button large waves="light" onClick={() => {
                                if (this.props.baseState[`playState_${this.props.state.id}`] !== undefined) {
                                    getModal("#restorePlayState").open();
                                } else {
                                    this.props.history.push(`/q/${this.props.state.id}/play`);
                                }
                            }}><Icon left>play_arrow</Icon>開始</Button>

                            {/* 共有ボタン */}
                            {/* <Button large flat onClick={() => {
                                console.log(this.state.json);
                                if (this.props.baseState.signedIn && !this.props.baseState.user.loginProblem) {
                                    generateQuestionGist(JSON.parse(this.state.json), (state) => this.props.baseAccessor(state))
                                } else {
                                    M.toast({ html: "この機能を使うにはGitHubでログインしてください．" })
                                }
                                }}><Icon left>share</Icon></Button> */}
                        </Col>

                    </Row>

                    <Button flat waves="light" onClick={() => this.handleChangeToggle("showMore", true)}><Icon left>{!this.state.showMore ? "expand_more" : "expand_less"}</Icon>詳細設定</Button>
                    {this.state.showMore ? <div><br />
                        <Row>
                            <SwitchTemp
                                id="soptions-switch"
                                offLabel=""
                                checked={this.props.state.shuffleOptions}
                                onChange={(e) => this.handleChangeBool(e, "shuffleOptions")}
                                onLabel=""
                                title="選択肢の順番を入れ替える"
                            />
                            <SwitchTemp
                                id="squestions-switch"
                                offLabel=""
                                checked={this.props.state.shuffleQuestions}
                                onChange={(e) => this.handleChangeBool(e, "shuffleQuestions")}
                                onLabel=""
                                title="出題順を入れ替える"
                            />
                            <SwitchTemp
                                id="hardmode-switch"
                                offLabel=""
                                checked={this.props.state.hardMode}
                                onChange={(e) => this.handleChangeBool(e, "hardMode")}
                                onLabel=""
                                title="ハードモード"
                            />
                            <SwitchTemp
                                id="manual-scoring-switch"
                                offLabel=""
                                checked={this.props.state.manualScoring}
                                onChange={(e) => this.handleChangeBool(e, "manualScoring")}
                                onLabel=""
                                title="記述式は自己採点する"
                            />
                            <SwitchTemp
                                id="random-answer-options-switch"
                                offLabel=""
                                checked={this.props.state.randomAnswerOptions}
                                onChange={(e) => this.handleChangeBool(e, "randomAnswerOptions")}
                                onLabel=""
                                title="すべて選択式の問題にする"
                            />
                        </Row>
                        {this.props.state.randomAnswerOptions && (<Row>
                            <Col s={12} m={6}>
                                <Row>
                                    <Col s={6}>
                                        <h5>選択肢の数</h5>
                                        <p>選択肢自動生成時の選択肢の数</p>
                                    </Col>
                                    <Col s={6} className="right-align">
                                        <h5>{this.props.state.maxOptionNumber}</h5>
                                    </Col>
                                </Row>
                                {nonOptionQuestions.length > 2 && <p class="range-field">
                                    <input
                                        type="range"
                                        max={nonOptionQuestions.length}
                                        min={2}
                                        name="points"
                                        id="start-pos"
                                        step={1}
                                        value={this.props.state.maxOptionNumber}
                                        onChange={e => {
                                            this.handleChangeNumber(e, "maxOptionNumber");
                                        }}
                                        disabled={nonOptionQuestions.length <= 2}
                                    />
                                </p>}
                            </Col>
                        </Row>)}
                        <Row>
                            {!this.props.state.shuffleQuestions && (<Col s={12} m={6}>
                                <Row>
                                    <Col s={6}>
                                        <h5>開始位置</h5>
                                    </Col>
                                    <Col s={6} className="right-align">
                                        <h5>{this.props.state.startPos} / {this.props.state.questions.length}</h5>
                                        <p>{Math.round(this.props.state.startPos * 100 / this.props.state.questions.length)}%</p>
                                    </Col>
                                </Row>
                                <p class="range-field">
                                    <input
                                        type="range"
                                        max={this.props.state.questions.length}
                                        min={1}
                                        name="points"
                                        id="start-pos"
                                        step={1}
                                        value={this.props.state.startPos}
                                        onChange={e => {
                                            const targetValue = Number(e.target.value);
                                            if (targetValue > this.props.state.endPos) {
                                                this.props.accessor({
                                                    startPos: targetValue,
                                                    endPos: targetValue
                                                });
                                            } else {
                                                this.handleChangeNumber(e, "startPos");
                                            }
                                        }}
                                    />
                                </p>
                            </Col>)}
                            <Col s={12} m={this.props.state.shuffleQuestions ? 12 : 6}>
                                <Row>
                                    <Col s={6}>
                                        <h5>{this.props.state.shuffleQuestions ? "出題数" : "終了位置"}</h5>
                                    </Col>
                                    <Col s={6} className="right-align">
                                        <h5>{this.props.state.endPos} / {this.props.state.questions.length}</h5>
                                        <p>{Math.round(this.props.state.endPos * 100 / this.props.state.questions.length)}%</p>
                                    </Col>
                                </Row>
                                <p class="range-field">
                                    <input
                                        type="range"
                                        max={this.props.state.questions.length}
                                        min={1}
                                        name="points"
                                        id="end-pos"
                                        step={1}
                                        value={this.props.state.endPos}
                                        onChange={e => {
                                            const targetValue = Number(e.target.value);
                                            if (targetValue < this.props.state.startPos) {
                                                this.props.accessor({
                                                    startPos: targetValue,
                                                    endPos: targetValue
                                                });
                                            } else {
                                                this.handleChangeNumber(e, "endPos");
                                            }
                                        }}
                                    />
                                </p>
                            </Col>
                            {!this.props.state.shuffleQuestions && <p className='right-align'>全体の出題数: {this.props.state.endPos - this.props.state.startPos + 1} / {this.props.state.questions.length}({Math.round((this.props.state.endPos - this.props.state.startPos + 1) * 100 / this.props.state.questions.length)}%)</p>}
                        </Row>
                    </div> : null}
                    <br /><br />
                    <Tabs className='tab-demo z-depth-1 light-blue-text lighten-1' onChange={() => setTimeout(() => { this.textareaAutoFix() }, 500)}>
                        <Tab title="問題編集(yaml)" idx='tab-yaml-editor'>
                            <Textarea s={12} id="yaml-editor"
                                label={this.state.isYamlValid ? "" : "YAML構文に問題があります"}
                                value={this.state.yamlBuffer}
                                onChange={this.tryEditYaml}
                                onBlur={(e) => this.tryEditYaml(e, true)}
                                onKeyDown={(e) => this.handleKeyDown(e, "yamlBuffer", true)}
                            />
                        </Tab>
                        <Tab title="構成ファイル(JSON)" idx='tab-json-editor'>
                            <br />
                            <Switch
                                id="minify-switch"
                                offLabel=""
                                checked={this.state.jsonMinify}
                                onChange={(e) => this.handleChangeBool(e, "jsonMinify", true)}
                                onLabel="Minify"
                            />
                            {!this.state.jsonMinify ? <Switch
                                id="edit-switch"
                                offLabel=""
                                checked={this.state.jsonEditable}
                                onChange={(e) => this.handleChangeBool(e, "jsonEditable", true)}
                                onLabel="編集する"
                            /> : null}
                            <Textarea s={12}
                                id="json-editor"
                                value={this.state.jsonMinify ? this.state.jsonRaw : this.state.jsonBuffer}
                                label={this.state.isJsonValid ? "" : "JSON構文に問題があります"}
                                validate={true}
                                disabled={this.state.jsonMinify || !this.state.jsonEditable}
                                onChange={this.tryEditJson}
                                onBlur={(e) => this.tryEditJson(e, true)}
                                onKeyDown={(e) => this.handleKeyDown(e, "jsonBuffer", true)}
                            />
                        </Tab>
                        {/* <Tab title="構成ファイル(JSON-min)" >
                            <Textarea s={12} value={this.props.state.jsonRaw}
                                disabled={true}
                            />
                        </Tab> */}
                        <Tab title="GUI編集(開発中)" disabled>Test 2</Tab>
                    </Tabs>
                </Container>}
                <Modal
                    id='restorePlayState'
                    header='進捗のリストア'
                    bottomSheet={isMobile}
                    fixedFooter={isMobile}
                    actions={[
                        <Button flat waves="light" onClick={() => getModal("#restorePlayState").close()}>キャンセル</Button>,
                        <Button flat waves="light" className="red-text" onClick={() => {
                            getModal("#restorePlayState").close();
                            this.props.baseAccessor({
                                [`playState_${this.props.state.id}`]: undefined
                            });
                            console.log(this.props.baseState);
                            this.props.history.push(`/q/${this.props.state.id}/play`);
                        }}><Icon left>refresh</Icon>はじめから</Button>,
                        <Button waves="light" className="orange" onClick={() => {
                            this.props.history.push(`/q/${this.props.state.id}/play`);
                            getModal("#restorePlayState").close();
                        }}><Icon left>play_arrow</Icon>リストア</Button>,
                    ]}>
                    <Row>
                        以下の記録された進捗があります．リストアしますか？<br />
                        <Col m={6} s={12}>
                            <Card
                                title={`${moment(this.props.baseState[`playState_${this.props.state.id}`]?.recorded).format("YYYY/MM/DD HH:mm:ss")}のプレイ状況`}
                            >
                                回答済み: {this.props.baseState[`playState_${this.props.state.id}`]?.questions?.filter(v => v.answered).length} / {this.props.baseState[`playState_${this.props.state.id}`]?.questions?.length}
                                <br />
                                出題順の入れ替え: {this.props.baseState[`playState_${this.props.state.id}`]?.shuffleQuestions ? "有効" : "無効"}
                                <br />
                                ハードモード: {this.props.baseState[`playState_${this.props.state.id}`]?.hardMode ? "有効" : "無効"}
                                <br />
                                自己採点: {this.props.baseState[`playState_${this.props.state.id}`]?.manualScoring ? "有効" : "無効"}
                            </Card>
                        </Col>
                    </Row>
                </Modal>
            </Section>
        )
    }
}

export default withRouter(Dashboard);