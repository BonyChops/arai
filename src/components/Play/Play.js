import React from "react";
import M from "materialize-css";
import { Button, Checkbox, Col, Container, Icon, Modal, ProgressBar, RadioGroup, Row, Section, Table, TextInput } from "react-materialize"
import { withRouter } from "react-router";
import NotFound from "../NotFound/NotFound";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Tex, InlineTex } from 'react-tex';
import keyboardjs from "keyboardjs";

const successMessages = [
    "Well done!",
    "Nailed it!",
    "You got it!",
    "Nice work!",
    "Fantastic!",
    "Excellent!",
    "Brilliant!",
    "Amazing!",
    "Superb!",
    "Cool!",
    "Good job!",
    "You’re getting better!",
    "You’re improving!",
    "よくできました！",
    "さすが！",
    "超世紀誕生 ぱんぱかぱーん",
    "♪〜(ここでじょいふるが流れる)",
    //"年収1000万エンジニア！",
    "Happy hacking!",
    "脳へのインストールが正常に進行しています...",
    "もしかして: 天才",
    "あなた「完全に理解した」",
    "あなたには楽勝過ぎましたね！",
    "Awesome!",
]

const encourageMessages = [
    "よく確認してみよう",
    "おっと？",
    "惜しい！",
    "むむ？",
    "...！",
]

const arrayRandom = (array) => array[Math.floor(Math.random() * array.length)];
const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))

class Play extends React.Component {
    constructor(props) {
        super(props);

        console.log(props)
        if (this.props.state !== undefined) {
            if (this.props.state.questions.length <= 0) {
                console.log(this.props.history)
                setTimeout(() => {
                    this.props.history.replace(`/q/${this.props.state.id}`);
                    getModal('#noQuestions').open();
                }, 1)
                //M.Modal.getInstance(document.querySelector('#questions')).open()
            }
        }
        const questions = props.state.questions.slice()
        this.state = {
            questions: (props.state.shuffleQuestions ? this.shuffle(questions) : questions).map(question => ({
                answers: (props.state.shuffleOptions ? this.shuffle(question.answers) : question.answers)
                    .map((option, k) => ((option.selected = false, option.key = k), option))
                    .filter(option => !this.props.state.hardMode || option.answer),
                title: question.title,
                answered: false,
                correct: false,
            })),
            currentIndex: 0,
            disabledNext: false,
            emptyWarn: false
        }
        console.log(this.state.questions);

        keyboardjs.bind(["right"], () => {
            const currentQuestion = this.state.questions[this.state.currentIndex];
            if (currentQuestion?.answered && !currentQuestion.checkCorrect) {
                this.checkAnswer(currentQuestion);
            }
        });

        keyboardjs.bind(["n"], () => {
            const currentQuestion = this.state.questions[this.state.currentIndex];
            if (currentQuestion.checkCorrect) {
                this.checkAnswer(currentQuestion, false);
            }
        });

        keyboardjs.bind(["enter"], () => {
            const currentQuestion = this.state.questions[this.state.currentIndex];
            this.checkAnswer(currentQuestion, currentQuestion?.checkCorrect);

        });

        keyboardjs.bind("left", () => {
            const currentQuestion = this.state.questions[this.state.currentIndex];
            this.goBack(currentQuestion);
        });



        setTimeout(() => {
            try {
                document.querySelector("input#answer_0").focus();
            } catch (e) { };
        }, 100);
    }

    shuffle = (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    regenerateQuiz = (onlyFailed = false) => {
        const questions = JSON.parse(JSON.stringify(this.state.questions.filter(question => !onlyFailed || !question.correct)))
        console.log("answer: ", this.props.state.hardMode);
        this.setState({
            questions: (this.props.state.shuffleQuestions ? this.shuffle(questions) : questions).map(question => ({
                answers: (this.props.state.shuffleOptions ? this.shuffle(question.answers) : question.answers)
                    .map((option, k) => (((option.selected = false, option.key = k), option.insert = ""), option))
                    .filter(option => !this.props.state.hardMode || option.answer),
                title: question.title,
                answered: false,
                correct: false,
                checkCorrect: false
            })),
            currentIndex: 0,
            disabledNext: false,
            emptyWarn: false
        })
    }



    checkAnswer = (currentQuestion, forceCorrect = false) => {
        if (currentQuestion === undefined) {
            return;
        }
        this.setState({
            emptyWarn: false
        });
        if (currentQuestion.answered && !currentQuestion.checkCorrect) {
            this.setState({
                currentIndex: this.state.currentIndex + 1,
                emptyWarn: false
            });
            setTimeout(() => {
                try {
                    document.querySelector("input#answer_0").focus();
                } catch (e) { };
            }, 100);
            return;
        }
        const questions = this.state.questions;
        const question = questions[this.state.currentIndex];
        if (currentQuestion.answers.length <= 1) {
            //記述式
            console.log(this.props.state.manualScoring)
            if (!question.checkCorrect && this.props.state.manualScoring && this.state[`answer_${0}`] !== String(currentQuestion.answers[0].title)) {
                //自己採点モード
                question.checkCorrect = true;
                question.answered = true;
                console.log(this.state[`answer_${0}`])
                if (this.state[`answer_${0}`] === undefined || this.state[`answer_${0}`] === "") {
                    this.setState({ answer_0: "(自己採点)" });
                }
                const tmp = document.createElement("input");
                document.body.appendChild(tmp);
                tmp.focus();
                document.body.removeChild(tmp);
                return;
            } else {
                question.checkCorrect = false;
                if (this.state[`answer_${0}`] === "" || this.state[`answer_${0}`] === undefined) {
                    console.log("")
                    this.setState({
                        emptyWarn: true
                    })
                    return;
                }
                const targetOption = question.answers[0];
                if (forceCorrect || this.state[`answer_${0}`] === String(currentQuestion.answers[0].title)) {
                    targetOption.selected = true;
                    targetOption.insert = this.state[`answer_${0}`];
                    question.answered = true;
                    question.correct = true;
                } else {
                    targetOption.insert = this.state[`answer_${0}`];
                    question.answered = true;
                    question.correct = false;
                }
            }
        } else if (currentQuestion.answers.filter(answer => answer.answer).length <= 1) {
            //選択
            console.log(this.state[`answer_${0}`])
            if (this.state[`answer_${0}`] === "" || this.state[`answer_${0}`] === undefined) {
                this.setState({
                    emptyWarn: true
                })
                return;
            }
            const targetOption = question.answers.find(answer => answer.answer);
            question.answers.find(answer => String(answer.title) === this.state[`answer_${0}`]).selected = true;
            if (String(this.state[`answer_${0}`]) === targetOption.title) {
                console.log(String(this.state[`answer_${0}`]));
                console.log(targetOption.title)
                targetOption.selected = true;
                question.answered = true;
                question.correct = true;
            } else {
                question.answered = true;
                question.correct = false;
            }
        } else {
            //複数選択
            for (const [key, value] of Object.entries(question.answers)) {
                value.selected = (this.state[`answer_${key}`] === true);
                console.log(value);
            }
            console.log(question.answers[1])
            question.correct = question.answers.every(answer => answer.answer === answer.selected);
            question.answered = true;
        }

        const result = {}
        for (let i = 0; i < currentQuestion.answers.length; i++) {
            result[`answer_${i}`] = "";
        }
        result.questions = questions;
        this.setState(result);
        const tmp = document.createElement("input");
        document.body.appendChild(tmp);
        tmp.focus();
        document.body.removeChild(tmp);

    }

    goBack = () => {
        if (this.state.currentIndex <= 0) {
            return;
        }
        this.setState({
            currentIndex: this.state.currentIndex - 1,
            emptyWarn: false
        });
        setTimeout(() => {
            try {
                document.querySelector("input#answer_0").focus();
            } catch (e) { };
        }, 100);
    }

    render() {
        if (this.props.state === undefined) {
            return (<NotFound />)
        }
        const currentQuestion = this.state.questions[this.state.currentIndex];
        return (<Section>
            <Container>
                <Row>
                    <Col offset="m2" m={8} s={12}>
                        <Row>
                            <Col s={6}>
                                <h6>{this.props.state.title} (<Link onClick={() => getModal("#backToEdit").open()}>編集</Link>)</h6>

                            </Col>
                            {(this.state.currentIndex < this.state.questions.length) ? <Col s={6}>
                                <h6 className="right-align">{this.state.currentIndex + 1} / {this.state.questions.length} 問目</h6>
                            </Col> : null}
                        </Row>
                        <Row>
                            <Col s={2}>
                                {this.state.currentIndex > 0 ? <Button className="light-blue" onClick={() => this.goBack()}>
                                    <Icon>arrow_back</Icon>
                                </Button> : null}
                            </Col>
                            <Col s={8} className="right-align">
                                <ProgressBar progress={this.state.currentIndex * 100 / this.state.questions.length} />
                            </Col>
                            <Col s={2} className={"right-align"}>
                                {this.state.currentIndex < this.state.questions.length ? <Button
                                    onClick={() => this.checkAnswer(currentQuestion)}
                                    disabled={currentQuestion.checkCorrect}
                                    className={(currentQuestion.answered ? "light-blue" : "orange") + " right-align " + (this.state.currentIndex <= 0 ? "pulse" : "")}
                                >
                                    <Icon>{currentQuestion.answered ? ("arrow_forward") : "check"}</Icon>
                                    {/* {">"} */}
                                </Button> : null}
                            </Col>
                        </Row>
                        {(this.state.currentIndex < this.state.questions.length) ? <div>

                            <h4><InlineTex texContent={currentQuestion.title} /></h4>
                            {currentQuestion.correct ? <h5 className="light-green-text"><Icon left>check</Icon>{arrayRandom(successMessages)}</h5> : null}
                            {!currentQuestion.checkCorrect && currentQuestion.answered && !currentQuestion.correct ? <h5 className="red-text"><Icon left>close</Icon>{arrayRandom(encourageMessages)}</h5> : null}
                            {this.state.emptyWarn ? <h6 className="red-text">白紙で提出しないでください！</h6> : null}
                            {currentQuestion.answers.length <= 1 ? currentQuestion.answers.map((answer, k) => (

                                <Row className={currentQuestion.checkCorrect ? "" : (answer.answer && answer.selected ? "green lighten-4" : (answer.selected || (currentQuestion.answers.length <= 1 && currentQuestion.answered) ? "red lighten-4" : ""))}>
                                    <Col s={12} >
                                        {this.props.state.manualScoring ? <p>(自己採点モードのため白紙でもOKです)</p> : null}
                                        <TextInput
                                            id={`answer_${k}`}
                                            label={"回答をここに書いてください"}
                                            className="black-text"
                                            disabled={currentQuestion.answered}
                                            onChange={(e) => this.setState({ [`answer_${k}`]: e.target.value })}
                                            value={!currentQuestion.answered || currentQuestion.checkCorrect ? this.state[`answer_${k}`] : answer.insert}
                                        />
                                    </Col>
                                    {currentQuestion.answered ? <Col
                                        s={12}
                                        className={
                                            answer.answer && answer.selected ?
                                                "green-text" : (
                                                    answer.selected ||
                                                        (currentQuestion.answers.length <= 1 && currentQuestion.answered) ?
                                                        "red-text" : "")}>
                                        <Row><Col s={12}>答: <InlineTex texContent={String(answer.title)} /></Col></Row>
                                    </Col> : null}
                                    {currentQuestion.checkCorrect ? <Col
                                        s={12}>
                                        <h6>答えはあっていましたか？</h6><br />
                                        <Row>
                                            <Col s={6} m={4} offset="m2" className="align-center">
                                                <Button className="white green-text" onClick={() => this.checkAnswer(currentQuestion, true)}>
                                                    <Icon left>check</Icon>正解(ENTER)
                                                </Button>
                                            </Col>
                                            <Col s={6} m={4} className="align-center">
                                                <Button className="white red-text" onClick={() => this.checkAnswer(currentQuestion, false)}>
                                                    <Icon left>close</Icon>不正解(N)
                                                </Button>
                                            </Col>
                                            <Col s={12} m={4} offset="m2">

                                            </Col>
                                        </Row>
                                    </Col> : null}
                                </Row>
                            )) : currentQuestion.answers.filter(answer => answer.answer).length <= 1 ? <Row>
                                {currentQuestion.answers.map((answer, k) => [
                                    <p key={k} className={answer.answer && answer.selected ? "green lighten-4" : (answer.selected || (currentQuestion.answers.length <= 1 && currentQuestion.answered) ? "red lighten-4" : "")}>
                                        <label>
                                            <input
                                                name="answer-group"
                                                className="with-gap"
                                                onChange={(e) => this.setState({ [`answer_${0}`]: e.target.value })}
                                                type="radio"
                                                id={`answer_${k}`}
                                                disabled={currentQuestion.answered}
                                                value={String(answer.title)}
                                                checked={!currentQuestion.answered ? this.state[`answer_${0}`] === String(answer.title) : answer.selected}
                                            />
                                            <span><InlineTex texContent={String(answer.title)} />{answer.answer && currentQuestion.answered ? <Icon>check</Icon> : null}</span>
                                        </label>
                                    </p>
                                ])}
                            </Row> : <Row>
                                {currentQuestion.answers.map((answer, k) => [
                                    <p key={k} className={(currentQuestion.correct && answer.answer) ? "green lighten-4" : ((currentQuestion.answered && !currentQuestion.correct && (answer.answer !== answer.selected)) ? "red lighten-4" : "")}>
                                        <label>
                                            <Checkbox
                                                checked={!currentQuestion.answered ? this.state[`answer_${k}`] : answer.selected}
                                                onChange={(e) => this.setState({ [`answer_${k}`]: e.target.checked })}
                                                filledIn
                                                id={`answer_${k}`}
                                                value={String(answer.title)}
                                                label={String(answer.title)}
                                                disabled={currentQuestion.answered}
                                            />{currentQuestion.answered && answer.answer ? <Icon>check</Icon> : null}
                                        </label>
                                    </p>
                                ])}
                            </Row>}</div> : <div>
                            <Row>
                                <Col s={8}>
                                    <h2 className="green-text"><Icon medium left>check</Icon>お疲れ様！</h2>
                                </Col>
                                <Col s={4}>
                                    <CircularProgressbar value={Math.round(this.state.questions.filter(question => question.correct).length * 100 / this.state.questions.length)}
                                        text={`${Math.round(this.state.questions.filter(question => question.correct).length * 100 / this.state.questions.length)}%`} />
                                    <h5 className="center">{this.state.questions.filter(question => question.correct).length} / {this.state.questions.length}</h5>
                                </Col>
                            </Row>
                            <Table>
                                <thead>
                                    <tr>
                                        <th data-field="question">
                                            問題
                                        </th>
                                        <th data-field="your-answer">
                                            あなたの回答
                                        </th>
                                        <th data-field="right-answer">
                                            正解
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.questions.map((question, k) => <tr key={k}>
                                        <td className={question.correct ? "green-text" : "red-text"}>
                                            <Icon left>{question.correct ? "check" : "close"}</Icon> <Link onClick={() => this.setState({ currentIndex: k })}>第{k + 1}問 </Link>
                                        </td>
                                        <td className={"truncate " + (question.correct ? "green-text" : "red-text")}>
                                            {
                                                question.answers.length <= 1 ? question.answers[0].insert :
                                                    question.answers.filter(answer => answer.selected).map(answer => String(answer.title)).join(", ")
                                            }
                                        </td>
                                        <td className={"truncate"}>
                                            {
                                                question.answers.length <= 1 ? question.answers[0].title :
                                                    question.answers.filter(answer => answer.answer).map(answer => String(answer.title)).join(", ")
                                            }
                                        </td>
                                    </tr>)}
                                </tbody>
                            </Table>
                            <br /><br />
                            <Row className="right-align">
                                <Button className="light-blue" onClick={() => {
                                    if (this.state.questions.filter(question => question.correct).length === this.state.questions.length) {
                                        M.toast({ html: "1つも間違えてないでしょw" })
                                    } else {
                                        getModal('#retryFailedQuiz').open();
                                    }
                                }} style={{ marginRight: "25px" }}>間違えた問題だけやり直す</Button>
                                <Button className="light-blue" onClick={() => getModal('#retryQuiz').open()}>全部やり直す</Button>
                            </Row>
                        </div>}

                    </Col>
                </Row>
            </Container>
            <Modal
                id='backToEdit'
                header='ページを移動します'
                bottomSheet={isMobile}
                actions={[
                    <Button flat waves="light" onClick={() => getModal("#backToEdit").close()}>キャンセル</Button>,
                    <Button flat waves="light" className="orange-text" onClick={() => {
                        this.props.history.push(`/q/${this.props.state.id}`);
                        getModal("#backToEdit").close()
                    }}>編集へ移動</Button>,
                ]}
                bottomSheet={isMobile}>
                <Row>
                    現在の進捗は失われますがよろしいですか？
                </Row>
            </Modal>
            <Modal
                id='retryQuiz'
                header='問題をやり直す'
                bottomSheet={isMobile}
                actions={[
                    <Button flat waves="light" onClick={() => getModal("#retryQuiz").close()}>キャンセル</Button>,
                    <Button flat waves="light" className="orange-text" onClick={() => {
                        this.regenerateQuiz(false);
                        getModal("#retryQuiz").close()
                    }}>LET'S GO</Button>,
                ]}
                bottomSheet={isMobile}>
                <Row>
                    現在の進捗は失われますがよろしいですか？
                </Row>
            </Modal>
            <Modal
                id='retryFailedQuiz'
                header='間違えた問題をやり直す'
                bottomSheet={isMobile}
                actions={[
                    <Button flat waves="light" onClick={() => getModal("#retryFailedQuiz").close()}>キャンセル</Button>,
                    <Button flat waves="light" className="orange-text" onClick={() => {
                        this.regenerateQuiz(true);
                        getModal("#retryFailedQuiz").close()
                    }}>LET'S GO</Button>,
                ]}
                bottomSheet={isMobile}>
                <Row>
                    現在の進捗は失われますがよろしいですか？
                </Row>
            </Modal>
        </Section>
        )
    }
}
export default withRouter(Play);