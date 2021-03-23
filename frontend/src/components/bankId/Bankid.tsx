import axios, { AxiosError } from 'axios';
import { ethers } from 'ethers';
import { Box, Button, Image, Paragraph } from 'grommet';
import { Checkmark, ShieldSecurity, UserAdmin } from 'grommet-icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SignerContext, SymfoniContext } from '../../hardhat/SymfoniContext';
import { Loading } from '../ui/Loading';
import BANKID_LOGO from './bankid_logo.png';
interface Props { }

interface VerifyResponse {
    addresses: string[]
    authToken: string
    name: string
    tx: string
}

interface AuthProviderErrorResponse {
    message: string;
    code: number;
}

const AUTH_PROVIDER_URL = process.env.REACT_APP_AUTH_BOT_URL
if (!AUTH_PROVIDER_URL) throw Error("Please set REACT_APP_AUTH_BOT_URL in env variable")
const AUTH_PROVIDER_VERIFY_BANKID_ENDPOINT = "/auth/bankid/verify"


enum STATE {
    DEFAULT,
    NEED_BANKID,
    NEED_SIGNER,
    NEED_VERIFICATION,
    NEED_SIGNATATURE,
    VERIFIED,
    VERIFIYING,
    ERROR
}

export const Bankid: React.FC<Props> = ({ ...props }) => {
    const { init } = useContext(SymfoniContext)
    const [signer] = useContext(SignerContext)
    const [id_token, setIdToken] = useState<string>();
    const [verification, setVerification] = useState<VerifyResponse>();
    const [state, setState] = useState<STATE>(STATE.DEFAULT);
    const [messages, setMessages] = useState<string[]>([]);
    const [signature, setSignature] = useState<string>();


    useEffect(() => {
        console.log("Fnr", `11126138727`)
        console.log("Fnr", `14102123973`)
        console.log("Fnr", `26090286144`)
        console.log("Fnr", `09050319935`, 'Jon')
        console.log("One - time password", `otp`)
        console.log("Personal password", `qwer1234`)
    }, [])

    // get url query params( useParams does not work)
    useEffect(() => {
        let subscribed = true
        const doAsync = async () => {
            let search = window.location.search;
            let params = new URLSearchParams(search);
            let id_token = params.get('id_token');
            if (id_token !== null && subscribed) {
                setIdToken(id_token)
            }
        };
        doAsync();
        return () => { subscribed = false }
    }, [])
    const sign = useCallback(async (id_token: string, _signer: ethers.Signer) => {
        if (!signer) {
            return setMessages(old => [...old, "Trenger lommebok med signatur rettigheter"])
        }
        const tokenHash = ethers.utils.id(id_token);
        const tokenHashBytes = ethers.utils.arrayify(tokenHash);
        const signature = await _signer.signMessage(tokenHashBytes);
        setSignature(signature)
    }, [signer])

    const verify = useCallback(async (bankidToken: string, signature: string) => {
        try {
            setState(STATE.VERIFIYING)
            const res = await axios.get<VerifyResponse>(AUTH_PROVIDER_URL + AUTH_PROVIDER_VERIFY_BANKID_ENDPOINT, {
                params: {
                    bankIdToken: bankidToken,
                    signature: signature,
                    // skipToken: true,
                    // skipBlockchain: true
                }
            }).catch((error: AxiosError<AuthProviderErrorResponse>) => {
                if (error.response && error.response.data.message) {
                    throw Error(error.response.data.message);
                }
                throw Error(error.message);
            })
            if (res.status === 200) {
                if (res.data) {
                    setVerification(res.data)
                }
            }
        } catch (error) {
            setMessages(old => [...old, error.message])
            setState(STATE.ERROR)
        }
    }, [])



    const bankidLoginURL = () => {
        if (!process.env.REACT_APP_BANKID_CALLBACK_URL) {
            throw Error("Please set REACT_APP_BANKID_CALLBACK_URL env variable")
        }
        if (!process.env.REACT_APP_BANKID_CLIENT_ID) {
            throw Error("Please set REACT_APP_BANKID_CLIENT_ID env variable")
        }
        if (!process.env.REACT_APP_BANKID_ACR_VALUES) {
            throw Error("Please set REACT_APP_BANKID_ACR_VALUES env variable")
        }
        if (!process.env.REACT_APP_BANKID_URL) {
            throw Error("Please set REACT_APP_BANKID_URL env variable")
        }
        const params: { [s: string]: string } = {
            response_type: "id_token",
            client_id: process.env.REACT_APP_BANKID_CLIENT_ID,
            redirect_uri: process.env.REACT_APP_BANKID_CALLBACK_URL,
            acr_values: process.env.REACT_APP_BANKID_ACR_VALUES,
            scope: "openid"
        }
        const queryString = Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');
        const url = process.env.REACT_APP_BANKID_URL + queryString
        return url
    }

    //State machine
    useEffect(() => {
        if (!id_token)
            return setState(STATE.NEED_BANKID)
        if (!signer)
            return setState(STATE.NEED_SIGNER)
        if (!signature) {
            setState(STATE.NEED_SIGNATATURE)
            sign(id_token, signer)
            return
        }
        if (!verification) {
            setState(STATE.NEED_VERIFICATION)
            verify(id_token, signature)
            return
        }

    }, [id_token, signer, verification, signature, sign, verify])

    return (
        <Box gap="large" width="70vw" >
            {state === STATE.NEED_BANKID &&
                <Box elevation="large" pad="large" style={{ minHeight: "50vh" }} align="center" justify="center">
                    <Paragraph>Autentiser deg med BankId</Paragraph>
                    <Button label=" " size="large" color="brand" icon={<Image height="20px" width="auto" src={BANKID_LOGO}></Image>} onClick={() => window.location.href = bankidLoginURL()} hoverIndicator></Button>
                </Box>
            }
            {state === STATE.NEED_SIGNER &&
                <Box elevation="large" pad="large" style={{ minHeight: "50vh" }} align="center" justify="center">
                    <Paragraph>Koble deg til med en lommebok</Paragraph>
                    <Button label="Koble til Lommebok" onClick={() => init("web3modal")}></Button>
                </Box>
            }
            {state === STATE.NEED_SIGNATATURE &&
                <Box elevation="large" pad="large" style={{ minHeight: "50vh" }} align="center" justify="center">
                    <Paragraph>Signer meldingen for å bekrefte identitet</Paragraph>
                    <UserAdmin color="black" size="large"></UserAdmin>
                </Box>
            }
            {state === STATE.VERIFIYING &&
                <Box elevation="large" pad="large" style={{ minHeight: "50vh" }} align="center" justify="center">
                    <Paragraph>Verifiserer BankId og lommebok med autentiserings server.</Paragraph>
                    <Loading></Loading>
                </Box>
            }
            {state === STATE.VERIFIED &&
                <Box elevation="large" pad="large" style={{ minHeight: "50vh" }} align="center" justify="center">
                    <Paragraph>Du er autentisert som {verification?.name}</Paragraph>
                    <Checkmark color="green" size="large"></Checkmark>

                </Box>
            }

            {messages.length > 0 &&
                <Box elevation="large" pad="large" align="center" justify="center">
                    {messages.map((message, i) => (
                        <Paragraph key={i} color="red"> {message}</Paragraph>
                    ))}
                </Box>
            }

        </Box>
    )
}