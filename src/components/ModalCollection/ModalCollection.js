import { Modal } from "react-materialize";
import { isMobile } from "react-device-detect";

const ModalCollection = (props) => {
    return (
        <div>
            <Modal
                id='noQuestions'
                header='問題が作成されていません'
                bottomSheet={isMobile}>
                問題を作成してください
            </Modal>
        </div>
    )
}
export default ModalCollection;