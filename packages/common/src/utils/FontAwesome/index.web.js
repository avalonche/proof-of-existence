import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FontAwesome(props) {
    const { size, style, ...rest } = props;

    return (
        <FontAwesomeIcon
            style={{fontSize: size, ...style}}
            {...rest}
        />
    );
}

export { FontAwesome };