import NextLink from 'next/link';
import {
    Stack,
    Typography,
    Button,
    Box,
    Container
} from '@mui/material';
import background from "../../public/bg.png"

const Hero = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Stack
                direction="column"
                spacing={3}
                style={{background: `url(${background.src})`, backgroundSize: 'contain' }}
            >
                <Stack 
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}
                >
                    <Typography
                        color="white"
                        // variant={"h3"}
                        align="center"
                        noWrap
                        sx={{
                            fontSize: {
                                md: '1.8rem',
                                xs: '1.2rem'
                            }
                        }}
                    >
                        Trade your favorite NFTs now
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="h4"
                        sx={{
                            maxWidth: 700
                        }}
                        align="center"
                    >
                        Swap and trade NFT tokens safely and securely using the swap escort protocol, no fees, only pay for gas! 
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={2}
                    >
                        <NextLink href='/swap' passHref>
                            <Button
                                component="a"
                                size="large"
                                variant="contained"
                                sx={{ borderRadius: 4, width: {
                                    md: 160,
                                    xs: 80
                                }}}
                                style={{
                                    padding: '0.8rem 2.4rem',
                                    border: '1px solid #ff0077',
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    background: '#252936'
                                }}
                            >
                                Start Trading
                            </Button>
                        </NextLink>
                        <NextLink href='/load' passHref>
                            <Button
                                component="a"
                                size="large"
                                variant="outlined"
                                sx={{ borderRadius: 4, width: {
                                    md: 160,
                                    xs: 80 
                                } }}
                                style={{
                                    padding: '0.8rem 2.4rem',
                                    border: '1px solid #ff0077',
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    background: '#252936',
                                    color: 'white'
                                }}
                            >
                                Load Trade
                            </Button>
                        </NextLink> 
                    </Stack>
                    <Box 
                        component="img"
                        src="nft.png"
                        alt="Hero"
                    />
                </Stack>
            </Stack>
        </Container>
    )
}

export default Hero;