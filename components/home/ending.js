import {
    Stack,
    Typography,
    Box,
    Avatar
} from '@mui/material';
const Ending = () => {
    return (
        <Stack
            direction={["column", "row"]}
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{
                width: '100%',
                mt: 3,
                mb: 3,
                pt: 3,
                pb: 3,
                backgroundColor: '#111633'
            }}
        >
            <Stack
                direction="column"
            >
                <Typography
                    color="textPrimary"
                    variant="h1"
                >
                    Decentralized Trades
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="h6"
                    sx={{ mt: 2, width: 400 }}
                >
                    We are using peer-to-peer technology powered by the Ethereum Blockchain in order to enact trades and transactions through a plethora
                    of secure digitalized Smart Contracts making us one of the few decentralized d-apps out there in the market!
                </Typography>
            </Stack>
            <Box 
                component="img"
                sx={{
                    height: 600,
                    width: 600,
                    maxHeight: { xs: 250, md: 450, lg: 600 },
                    maxWidth: { xs: 250, md: 450, lg: 600 },
                }}
                src="koi3.png"
            />
        </Stack>
    )
}

export default Ending;