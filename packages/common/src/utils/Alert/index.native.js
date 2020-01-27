import FlashMessage, { showMessage } from "react-native-flash-message";

function alert({content, ...rest}) {
    showMessage({
        message: content,
        type: 'warning',
        ...rest
    });
} 

export {
    FlashMessage as NotificationProvider,
    alert
}