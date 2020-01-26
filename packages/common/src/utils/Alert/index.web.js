import React from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationProvider = () => {
  return <ToastContainer style={{width: '100%', marginLeft: 0, left: 0}}/>
};

function alert({content, ...rest}) {
  const customToastId = 'error info';

  toast(content, {
    position: 'top-center',
    transition: Slide,
    hideProgressBar: true,
    toastId: customToastId,
    ...rest,
  })
};

export {
    NotificationProvider,
    alert,
}