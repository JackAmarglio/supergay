import {
    Stack,
    Typography,
    Card,
    CardActionArea,
    Box,
    Container
} from '@mui/material';
import Head from 'next/head';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import background from "../public/bg.png"

const Connect = () => {
    const router = useRouter();
    const { isAuthenticated, isAuthenticating, isInitialized, authenticate } = useMoralis();
    useEffect(() => {
        if (!isAuthenticating && isAuthenticated && isInitialized) {
          router.push('/swap');
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, isAuthenticating]);
    const Login = (prov) => {
        authenticate({ 
            provider: prov,
            signingMessage: 'Signing in ETHTRADERS',
            onSuccess: () => {
                window.location.href = "/swap";
                toast.success('Your wallet is connected.')
            },
            onError: (e) => {
                const message = e.message.split(':');
                toast.error(message[1]);
            }
        });
    }
    return (
        <Container maxWidth="lg" sx={{ mt: 10, minHeight: 600 }} style={{background: `url(${background.src})`, backgroundSize: 'contain' }}>
            <Head>
                <title>ETHTRADERS | Connect Your Wallet</title>
            </Head>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
                sx={{
                    textAlign: 'center'
                }}
            >
                <Typography
                    color="textPrimary"
                    variant="h2"
                    style={{color: 'white'}}
                >
                    CONNECT YOUR&#160;
                    <Typography
                        component="span"
                        variant="h2"
                        color="primary"
                    >
                    WALLET
                    </Typography>
                </Typography>
                <Stack 
                    direction={["column", "row"]}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Card
                        sx={{
                            width: 300,
                            height: 340,
                            backgroundColor: '#F6851B',
                            mr: 2,
                            ml: 2,
                            mt: 2,
                            mb: 2
                        }}
                    >
                        <CardActionArea id="metamaskbutton" onClick={() => Login("metamask")} sx={{ height: 340}}>
                            <Stack
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                <Box sx={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 20,
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Box
                                        component="img"
                                        src="/metamask.svg"
                                        sx={{
                                            width: 70,
                                            height: 70
                                        }}
                                    />
                                </Box>
                                <Typography
                                    color="white"
                                    variant="h5"
                                >
                                    Metamask
                                </Typography>
                            </Stack>
                        </CardActionArea>
                    </Card>
                    <Card
                        sx={{
                            width: 300,
                            height: 340,
                            backgroundColor: '#2882fc',
                            mr: 2,
                            ml: 2,
                            mt: 2,
                            mb: 2
                        }}
                    >
                        <CardActionArea onClick={() => Login("walletconnect")} sx={{ height: 340}}>
                            <Stack
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                <Box sx={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 20,
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Box
                                        component="img"
                                        src="/walletconnect.svg"
                                        sx={{
                                            width: 70,
                                            height: 70
                                        }}
                                    />
                                </Box>
                                <Typography
                                    color="white"
                                    variant="h5"
                                >
                                    Walletconnect
                                </Typography>
                            </Stack>
                        </CardActionArea>
                    </Card>
                </Stack>
                <Typography
                    variant="body1"
                    color="textSecondary"
                >
                    Currently we only support Metamask and Walletconnect
                    <Typography
                        variant="body2"
                        color="textSecondary"
                    >
                        We are working hard to support more platforms in the future
                    </Typography>
                </Typography>
            </Stack>
        </Container>
    )
}

export default Connect;