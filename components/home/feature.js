import {
    Stack,
    Typography,
    Box
} from '@mui/material';

const Feature = () => {
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
                    No service fees, only gas!
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="h4"
                    sx={{ mt: 2, mb: 2, maxWidth: 500 }}
                    align="center"
                >
                    Unlike other services, ETHTRADERS does not charge any fees for using the service whatsoever, you only have to pay for Gas fees!
                </Typography>
                <Box 
                component="img"
                sx={{
                    height: 600,
                    width: 600,
                    maxHeight: { xs: 250, md: 450, lg: 600 },
                    maxWidth: { xs: 250, md: 450, lg: 600 },
                    mb: 4
                }}
                src="koi.png"
            />
            </Stack>
        </Stack>
    )
}

export default Feature;