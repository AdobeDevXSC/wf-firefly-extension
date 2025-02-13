/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId, objCode } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { ffIcon } from './icons';

const ExtensionRegistration = () => {
  
  const init = async () => {
    const guestConnection = await register({
      metadata,
      methods: {
        id: extensionId,
        mainMenu: {
          getItems() {
            // const {objID, objCode} = sessionStorage
            return [
              {
                id: 'create-asset',
                url: `/index.html#/create-asset`,
                label: 'Firefly Panel',
                icon: ffIcon
              },
              // @todo YOUR HEADER BUTTONS DECLARATION SHOULD BE HERE
            ];
          },
        },
        secondaryNav: {
          TASK: {
            getItems() {
              return [
                {
                  id: 'create-asset',
                  url: `/index.html#/create-asset`,
                  label: 'Firefly Panel',
                  icon: ffIcon
                },
                // @todo YOUR HEADER BUTTONS DECLARATION SHOULD BE HERE
              ];
            }
          },
          DOCUMENTS: {
            getItems() {
              return [
                {
                  id: 'create-asset',
                  url: `/index.html#/create-asset`,
                  label: 'Firefly Panel',
                  icon: ffIcon
                },
                // @todo YOUR HEADER BUTTONS DECLARATION SHOULD BE HERE
              ];
            }
          }
        }
      }
    });

    // if (guestConnection) {
    //     await new Promise(r => setTimeout(r, 2000));
    //     context = guestConnection.sharedContext;
    //     console.log(context);
    //     if(context && context.get('objCode')) {
    //       sessionStorage.setItem('objCode', context?.get('objCode'));
    //       sessionStorage.setItem('objID', context?.get('objID'))
    //       objCode = context?.get('objCode') || context?.get('objCode');
    //       objID = context?.get('objID') || context?.get('objID');
    //     }
    //   }
     
  };
  init().catch(console.error);
  return <Text>IFrame for integration with Host (Workfront)...</Text>;
}

export default ExtensionRegistration;
