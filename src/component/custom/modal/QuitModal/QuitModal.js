import { Modal } from 'antd';
import React, { useState } from 'react';
import './QuitModal.scss';
import { useLanguageSelector } from '~/component/redux/selector';
const QuitModal = ({ visible, title, purpose, callback }) => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { modal, setModal } = visible;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(currentLanguage.confirmLogout);

    const handleOk = () => {
        switch (purpose) {
            case 'logout':
                setModalText(currentLanguage.loggingOut);
                break;
            case 'leaveroom':
                setModalText(currentLanguage.leavingRoom);
                break;
            default:
                break;
        }
        setConfirmLoading(true);
        setTimeout(() => {
            setModal(false);
            setConfirmLoading(false);
            callback();
        }, 2000);
    };

    const handleCancel = () => {
        setModal(false);
    };

    return (
        <Modal
            title={title}
            visible={modal}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText={currentLanguage.okText}
            cancelText={currentLanguage.cancelText}
        >
            <p>{modalText}</p>
        </Modal>
    );
};

export default QuitModal;
