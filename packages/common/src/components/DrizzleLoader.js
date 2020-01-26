import React from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import Navigation from '../navigation';
import { Spinner } from './shared';

const DrizzleLoader = () => {
    const drizzleState = drizzleReactHooks.useDrizzleState((drizzleState) => ({
        drizzleStatus: drizzleState.drizzleStatus,
        web3Status: drizzleState.web3.status,
    }));
    
    const {drizzleStatus, web3Status } = drizzleState;

    if (drizzleStatus.initialized) {
        return (
            <Navigation/>
        );
    }

    if (web3Status === 'initialized') {
        return (
            <Spinner color='gray' middle center text="Loading accounts and contracts..."/>
        );
    }
    
    return (
        <Spinner color='gray' middle center text="Loading web3.."/>
    );
}

export default DrizzleLoader;