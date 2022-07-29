import { Button, Col, Icon, Modal, Row, TextInput } from "react-materialize";
import { isMobile } from "react-device-detect";
import M from 'materialize-css';
import { importFromGist } from "../../functions/backup";
import { withRouter } from "react-router-dom";
import { useState } from "react";
const getModal = (name) => (M.Modal.getInstance(document.querySelector(name)))

const ModalCollection = (props) => {
    const [importId, setImportId] = useState("")
    return (
        <div>
            <Modal
                id='noQuestions'
                header='問題が作成されていません'
                bottomSheet={isMobile}>
                問題を作成してください
            </Modal>
            <Modal
                id='questionShared'
                header='共有'
                bottomSheet={isMobile}
                fixedFooter={isMobile}
                actions={[
                    <Button flat waves="light" onClick={() => getModal("#deleteWarn").close()}>閉じる</Button>,
                ]}
                bottomSheet={isMobile}>
                <Row>
                    <p>問題を共有する準備ができました．以下のIDを共有したい相手に送信してください．もしくは，以下のリンクを教えると直接アクセスしてもらえるようになります．<br />
                        <span className="red-text">このウィンドウを閉じると表示できません．</span></p>
                    <Row>
                        <TextInput
                            disabled
                            s={12}
                            id="id"
                            label="ID"
                            className="black-text"
                            value={props.state.shareId}
                        />
                        <TextInput
                            disabled
                            s={12}
                            id="link"
                            label="リンク"
                            value={"https://bonychops.github.io/arai/?importId=" + props.state.shareId}
                        />
                    </Row>
                </Row>
            </Modal>
            <Modal
                id='importLink'
                header='IDからインポート'
                bottomSheet={isMobile}
                fixedFooter={isMobile}
                actions={[
                    <Button waves="light" className="orange" onClick={() => {
                        try{
                            importFromGist(importId, props.generateQuestion, (q) => props.history.push(q));
                        }catch(e){
                            console.error(e);
                            M.toast({html: "読み込めませんでした．"})
                        }
                    }}><Icon left>link</Icon>IDからインポート</Button>,
                    <Button flat waves="light" onClick={() => getModal("#importLink").close()}>閉じる</Button>
                ]}
                bottomSheet={isMobile}>
                <Row>
                    <p>インポートするIDを入力してください</p>
                    <Row>
                        <TextInput
                            s={12}
                            id="id"
                            label="ID"
                            onChange={(e) => setImportId(e.target.value)}
                            value={importId}
                        />
                    </Row>
                </Row>
            </Modal>
        </div>
    )
}
export default withRouter(ModalCollection);