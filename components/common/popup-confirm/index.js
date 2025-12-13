import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'unset',
        border: 'none',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: 'rgb(100 100 111 / 20%) 0px 7px 29px 0px',
    },
};

const PopupConfirm = ({ isShow = false, title = '', message = '', closeModalHandle, confirm }) => {

    const closeModal = () => {
        if (closeModalHandle) {
            closeModalHandle()
        }
        return;
    }

    return (
        <Modal isOpen={isShow}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
        >
            <div className="popup-area">
                <button className="close" onClick={closeModal}>
                    <i className="icon-cancel"></i>
                </button>

                <p className="popup-title">{title}</p>
                <p className="popup-message">{message}</p>

                <div className="action-cancel-submit">
                    <button type="button" className="btn btn-border" onClick={closeModal}>Huỷ</button>
                    <button type="submit" className="btn btn-green" onClick={confirm}>Xác nhận</button>
                </div>
            </div>
        </Modal>
    )
};


export default PopupConfirm