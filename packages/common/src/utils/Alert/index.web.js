import React from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesome } from '../FontAwesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { Block, Text } from '../../components/shared';
import { theme } from '../../assets/constants';

const NotificationProvider = () => {
  return <ToastContainer style={{width: '100%', marginLeft: 0, left: 0}}/>
};

const renderWarning = (content) => {
  return (
    <Block middle center row>
      <FontAwesome
        icon={faExclamationTriangle}
        color={theme.colors.warning}
        style={{paddingRight: theme.sizes.base}}
        size={theme.sizes.base}
    />
    <Text>{content}</Text>
    </Block>
  )
}

function alert({content, ...rest}) {
  const customToastId = 'error info';

  toast(renderWarning(content), {
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