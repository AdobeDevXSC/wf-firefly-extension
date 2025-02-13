import {
    Button,
    Form,
    darkTheme,
    Grid,
    Provider,
    TextField,
    Heading,
    Text,
    FileTrigger,
    Image,
    Flex,
    View,
    Well,
    IllustratedMessage,
    Divider,
    TextArea,
    ButtonGroup
} from '@adobe/react-spectrum';
import { attach } from "@adobe/uix-guest";
import actionWebInvoke from '../utils';
import allActions from '../config.json';
import React, { useState, useEffect } from 'react';
import { ffIcon } from './icons';
import { extensionId } from "./Constants";
import ImageAdd from '@spectrum-icons/workflow/ImageAdd';
import { useParams } from 'react-router';
import { fusionEndpoint } from './Constants';
import Download from '@spectrum-icons/workflow/Download';

//677c3518002739ccd531388bfe1b56cd
const CreateassetMainMenuItem = () => {
    const [guestConnection, setGuestConnection] = useState();
    const [prompt, setPrompt] = useState();
    const [image, setImage] = useState();
    const [imageLocal, setImageLocal] = useState();
    const [mask, setMask] = useState();
    const [maskLocal, setMaskLocal] = useState();
    const [fireFlyImg, setFireFlyImg] = useState();
    const [buttonEnabled, setButtonEnabled] = useState(true);
    const [auth, setAuth] = useState({});
    const { objCode, objID } = useState();
    console.log(objCode);

    useEffect(() => {
        if (image && mask && prompt?.length > 0) {
            setButtonEnabled(false);
        }

        (async () => {
            const guestConnection = await attach({ id: extensionId });
            console.log(":rocket: ~ file: CreateassetMainMenuItem.js ~ line 89 ~ guestConnection", guestConnection.sharedContext.get("objCode"))
            console.log(":rocket: ~ file: CreateassetMainMenuItem.js ~ line 89 ~ guestConnection", guestConnection.sharedContext.get("objID"))
            console.log(":rocket: ~ guestConnection:", guestConnection.sharedContext);

            const context = guestConnection?.sharedContext;

            const auth = context?.get("auth");
            const objCode = context?.get("objCode");
            const hostname = context?.get("hostname");
            const objID = context?.get("objID");
            const protocol = context?.get("protocol");
            const userInfo = context?.get("user");

            console.log({ auth, objCode, hostname, objID, protocol, userInfo });

            setGuestConnection(guestConnection);
        })();
    }, [image, mask, prompt]);

    useEffect(() => {
        if (guestConnection) {
            const context = guestConnection?.sharedContext;
        }
    }, [guestConnection]);

    const fireFly = async (evt, guestConnection) => {
        console.log(evt);
        console.log(prompt);
        console.log(image);

        const action = 'ext2/create';
        const params = {
            apiEndpoint: fusionEndpoint,
            prompt: prompt,
            image: image,
            mask: mask
        };
        console.log(params);
        const headers = {
            'Authorization': 'Bearer ' + auth.imsToken,
            'x-gw-ims-org-id': auth.imsOrgID  //guestConnection.sharedContext.get('auth').imsOrg
        };
        console.log(headers);
        try {
            const actionResponse = await actionWebInvoke(allActions[action], headers, params);
            console.log(`Response from ${action}:`, actionResponse);
        } catch (e) {
            console.error(e)
        }
    }

    const setSubmit = async (evt) => {

        const url = fusionEndpoint;
        evt.preventDefault();
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('imgMask', mask);
        formData.append('orgImg', image);
        formData.append('objCode', 'task');
        formData.append('objID', '677c353800273a412d2d64d2e885f5c9');

        const res = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const ff = await res.json();

        setFireFlyImg(ff[0]?.web_url);
    };

    const downloadFF = (e) => {
        const imageURL = fireFlyImg;
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'firefly.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Provider theme={darkTheme} colorScheme='light' width={'100%'} margin={'auto'}>
            <Grid
                areas={[
                    'sidebar content',
                ]}
                columns={['1fr', '3fr']}
                height="100vh"
                gap="size-100">
                <View paddingStart="size-400" paddingEnd="size-400" gridArea="sidebar">
                    <Flex direction="row" marginTop={'50px'} marginBottom={'20px'}>
                        <View paddingEnd={"10px"}>
                            <img width='30px' src={ffIcon} />
                        </View>
                        <View>
                            <Heading level={2} margin={'auto'}>
                                Change Asset Background
                            </Heading>
                        </View>
                    </Flex>
                    <Form maxWidth="size-4000" method='post' onSubmit={(e) => { setSubmit(e) }} encType='multipart/form-data' action='#'>

                        <TextArea label='Image Prompt' labelPosition={'top'} onChange={(e) => { setPrompt(e) }}></TextArea>

                        <Flex direction="column" marginTop={"30px"} alignContent={"left"} backgroundColor={'red'}>

                            <View>
                                <FileTrigger name='orgImg' onSelect={(e) => {
                                    let files = Array.from(e);
                                    setImageLocal(URL.createObjectURL(files[0]));
                                    setImage(files[0]);
                                }} acceptedFileTypes={['image/png', 'image/jpg', 'image/webp']}>
                                    <Well marginBottom={'size-100'}>Select Source Image to be Modified.  Image types can be PNG, JPG or WEBP</Well>
                                    <Button variant="secondary">
                                        <ImageAdd />
                                        <Text>Select Image</Text>
                                    </Button>
                                </FileTrigger>
                            </View>

                            <View margin={"auto"} marginTop={"10px"}>
                                <FileTrigger name='imgMask' onSelect={(e) => {
                                    let files = Array.from(e);
                                    setMaskLocal(URL.createObjectURL(files[0]));
                                    setMask(files[0])
                                }} acceptedFileTypes={['image/png', 'image/jpg', 'image/webp']}>
                                    <Well marginBottom={'size-100'}>Select a Mask to be Used.  Image types can be PNG, JPG or WEBP</Well>
                                    <Button variant="secondary">
                                        <ImageAdd />
                                        <Text>Select Mask</Text>
                                    </Button>
                                </FileTrigger>
                            </View>
                            <Divider marginTop={'size-200'} marginBottom={'size-200'} />
                            <View margin={"auto"} marginTop={"10px"} width={'100%'}>
                                <Button variant="accent" type='submit' isDisabled={buttonEnabled}>
                                    Submit
                                </Button>
                            </View>
                        </Flex>
                    </Form>
                </View>
                <View gridArea="content" paddingTop={'size-600'}>
                    <Flex direction={'row'} width={'100%'} justifyContent={'space-evenly'}>
                        <View>{imageLocal && (<IllustratedMessage>
                            <Heading marginBottom={'size-100'}>Source Image</Heading>
                            <Image width={"300px"} objectFit="cover" src={imageLocal}></Image>
                            <Well>{image?.name || 'No file selected'}</Well>
                        </IllustratedMessage>)}
                        </View>
                        <View>{maskLocal && (<IllustratedMessage>
                            <Heading marginBottom={'size-100'}>Mask</Heading>
                            <Image width={"300px"} objectFit="cover" src={maskLocal}></Image>
                            <Well>{mask?.name || 'No file selected'}</Well>
                        </IllustratedMessage>)}</View>

                        <View alignSelf={'top'}>{fireFlyImg && (<IllustratedMessage>
                            <Heading marginTop={'0'} marginBottom={'size-100'}>Firefly Image</Heading>
                            <Image width={"300px"} objectFit="cover" src={fireFlyImg} Download></Image>
                            {/* <Well>{prompt}</Well> */}
                            <ButtonGroup marginTop={'18px'} marginBottom={'4px'}>
                                <Button variant="primary">Create New Proof Task</Button>
                                <Button variant="secondary" onPress={(e) => downloadFF(e)}>
                                    <Download />
                                </Button>
                            </ButtonGroup>
                        </IllustratedMessage>)}

                        </View>
                    </Flex>

                </View>
            </Grid>


        </Provider>
    );
};

export default CreateassetMainMenuItem;
