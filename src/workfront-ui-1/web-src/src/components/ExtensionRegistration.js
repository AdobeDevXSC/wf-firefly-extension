/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { ffIcon } from './icons';

function ExtensionRegistration() {
  const init = async () => {
    const guestConnection = await register({
      metadata,
      methods: {
        id: extensionId,
        mainMenu: {
          getItems() {
            return [
              {
                id: 'create-asset',
                url: '/index.html#/create-asset',
                label: 'Firefly Panel',
                icon: ffIcon,                
              },
            // @todo YOUR HEADER BUTTONS DECLARATION SHOULD BE HERE
            ];
          },
        },
      }
    });
    console.log(guestConnection);
  };
  init().catch(console.error);
  return <Text>IFrame for integration with Host (Workfront)...</Text>;
}

export default ExtensionRegistration;
