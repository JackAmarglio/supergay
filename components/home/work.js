import {
    Stack,
    Typography,
    Box
} from '@mui/material';

const Work = () => {
    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
        >
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ 
                    alignText: "center"
                }}
            >
                <Typography
                    color="textPrimary"
                    variant="h1"
                >
                    How does it work?
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="h4"
                    sx={{ mt: 2, maxWidth: 500 }}
                    align="center"
                >
                    ETHTRADERS have deployed an Escrow Smart Contract on the Ethereum Blockchain Mainnet to handle trades and swaps,
                    it is being utilized to it&lsquo;s maximum potential and the proofs are based on strong cryptography practices,
                    so you can rest assured there&lsquo;ll be no problems when using our site.
                </Typography>
                <Box 
                component="img"
                sx={{
                    height: 600,
                    width: 600,
                    maxHeight: { xs: 250, md: 450, lg: 600 },
                    maxWidth: { xs: 250, md: 450, lg: 600 },
                }}
                src="koi2.png"
            />
            </Stack>
        </Stack>
    )
}

export default Work;