/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { ffIcon } from './icons';

const ExtensionRegistration = (params) => {
  console.log(params);

  const init = async () => {
    const guestConnection = await register({
      metadata,
      methods: {
        id: extensionId,
        mainMenu: {
          async getItems() {  
            return [
              {
                id: 'create-asset',
                url: '/index.html#/create-asset/projectid/677c3518002739ccd531388bfe1b56cd',
                label: 'Firefly Panel',
                icon: ffIcon,
              },
              // @todo YOUR HEADER BUTTONS DECLARATION SHOULD BE HERE
            ];
          },
        },
      }
    });

    if (guestConnection) {
      console.log(guestConnection);
      const context = guestConnection.sharedContext;
      console.log(context);
      const auth = context?.get("auth");
      const objCode = context?.get("objCode");
      const hostname = context?.get("hostname");
      const objID = context?.get("objID");
      const protocol = context?.get("protocol");
      const userInfo = context?.get("user");
      console.log(context);
    }

  };
  init().catch(console.error);
  return <Text>IFrame for integration with Host (Workfront)...</Text>;
}

export default ExtensionRegistration;
