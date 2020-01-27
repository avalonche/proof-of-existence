import React from 'react';
import ReactModal from 'react-modal';
import './styles.css';

import { theme } from '../../assets/constants';

ReactModal.setAppElement('#root');

function Modal({visible, children, ...props}) {
    return (
        <ReactModal
            isOpen={visible}
            closeTimeoutMS={200}
            style={{
                overlay: {
                    backgroundColor: theme.colors.overlay
                },
                content: {
                    padding: 0,
                    border: 'none',
                }
            }}
            {...props}
        >
            {children}
        </ReactModal>
    )
}

export { Modal };