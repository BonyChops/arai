import { isMobile } from "react-device-detect";
import { Button, Card, Col, Container, Icon, Modal, Row, Section } from "react-materialize";
import M, { Toast } from "materialize-css"
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { useState } from "react";

const Questions = (props) => {
    const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))

    const requestQuestion = (props, questions) => {
        getModal("#questions").close();
        if (questions.length == 0)
            getModal("#dataWarn").open();
        const id = props.generateQuestion();
        console.log(props.history)
        props.history.push(`/q/${id}`);
    }
    const [deleteTarget, setDeleteTarget] = useState(false);
    console.log(props.state)
    const questions = Object.keys(props.state).filter(key => (/^question_(.*)$/).test(key) && props.state[key] !== undefined).map(key => (props.state[key]));
    return (
        <div>
            <Modal
                id='questions'
                header='問題を選択...'
                fixedFooter={true}
                actions={[
                    <Button flat waves="light" className="orange-text" onClick={() => {
                        requestQuestion(props, questions);
                    }}><Icon left>edit</Icon>新規作成</Button>,
                    <Button flat waves="light" onClick={() => getModal("#questions").close()}>CLOSE</Button>
                ]}
                bottomSheet={isMobile}>
                <Row>
                    {questions.map((question, k) => (
                        <Col key={k} l={4} m={6} s={12}>
                            <Card
                                actions={[
                                    <Link key="play" to={`/q/${question.id}/play`} onClick={() => getModal("#questions").close()}><Icon>play_arrow</Icon></Link>,
                                    <Link key="edit" to={`/q/${question.id}`} onClick={() => getModal("#questions").close()}><Icon>edit</Icon></Link>,
                                    <Link key="delete" onClick={() => {
                                        setDeleteTarget(question);
                                        getModal("#deleteWarn").open();
                                    }}><Icon>delete</Icon></Link>,
                                ]}
                                className=""
                                closeIcon={<Icon>close</Icon>}
                                revealIcon={<Icon>more_vert</Icon>}
                                /* textClassName="white-text" */
                                title={question.title}
                            >{question.description}</Card>
                        </Col>
                    ))}
                    {questions.length === 0 ? (<Section>
                        <Container>
                            <h4 className="header center">問題がまだありません</h4>
                            <Row className="center">
                                <Button waves="light" className="orange" onClick={() => {
                                    requestQuestion(props, questions)
                                }}><Icon left>edit</Icon>新規作成</Button>,
                </Row>
                        </Container>
                    </Section>) : null}

                </Row>

            </Modal>
            <Modal
                id='deleteWarn'
                header='問題を消します'
                bottomSheet={isMobile}
                actions={[
                    <Button flat waves="light" onClick={() => getModal("#deleteWarn").close()}>キャンセル</Button>,
                    <Button flat waves="light" className="red-text" onClick={() => {
                        props.baseAccessor({
                            [`question_${deleteTarget.id}`]: undefined
                        });
                        getModal("#deleteWarn").close();

                    }}><Icon left>delete</Icon>完全に消す</Button>,
                ]}
                bottomSheet={isMobile}>
                <Row>
                    以下の問題を消します．本当によろしいですか？<br />
                   <Col m={6} s={12}>
                        <Card
                            title={deleteTarget.title}
                        >{deleteTarget.description}</Card>
                    </Col>
                </Row>
            </Modal>
            <Modal
                id='dataWarn'
                header='データの取扱に関する注意'
                bottomSheet={isMobile}>
                このWebアプリでは，ユーザーが作成した問題をクラウドではなくブラウザに保存します(localStorage)．ユーザーが作成したクイズがサーバーに送られることは(現時点では)ありません．<br /><span className="red-text" >このWebアプリはまだベータ版です．</span>データが飛びやすいので必ず自身でバックアップを取ってください．<br />当Web AppではGoogle Analyticsを使用しています．
            </Modal>
        </div>
    )
}
export default withRouter(Questions);