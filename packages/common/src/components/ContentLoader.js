import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { Spinner, Block } from './shared';

import { useDispatch } from 'react-redux';
import { requestAllContent } from '../redux/content/contentActions';

const ContentLoader = ({children}) => {
    const { useCacheCall } = drizzleReactHooks.useDrizzle();
    const dispatch = useDispatch();

    const numDocuments = useCacheCall('DocumentInfo', 'getNumberOfDocuments');

    const allDocuments = useCacheCall(['DocumentInfo'], call => {
      if (numDocuments) {
        const documents = []
        for (let i = 0; i < parseInt(numDocuments); i++) {
          const document = (call('DocumentInfo', 'getDocument', i));
          if (document) {
            documents.push(document);
          }
        }
        return documents;
      }
    });
    
    useEffect(() => {
      if (allDocuments && allDocuments.length === parseInt(numDocuments)) {
        dispatch(requestAllContent(allDocuments));
      }
    }, [allDocuments]);

    return (
        typeof allDocuments === 'undefined' ? (
          <Spinner color='gray' middle center text="Loading your content from contracts..."/>
        ) : (
          <Block>
            {children}
          </Block>
        )
    );
}

export default ContentLoader;