import {
    Grid,
    Card,
    CardHeader,
    CardMedia,
    Typography,
    Tooltip,
    Box
} from '@mui/material';

const SwapStatic = (props) => {
    const { 
        data,
    } = props;
    return (
        <Grid container spacing={2} sx={{ pt: 5, pb: 5, pl: 15, pr: 15 }}>
            { data.map ( (token, tid) => (
                <Grid key={tid} sm={12} sx={{ mt: 1, mb: 1 }}>
                    <Card variant="outlined">
                        <CardHeader
                            title={
                                <Tooltip title={token.address}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }} noWrap>
                                        {
                                            token.type === 'NATIVE' ? 'ETHER' : `${token.symbol}`
                                        }
                                    </Typography>
                                </Tooltip>
                            }
                            subheader={
                                <Tooltip title={token.id}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
                                        {
                                            token.type === 'NATIVE' ? `${token.amount}ETH` : `Token Id: ${token.id.substr(0, 7)}`
                                        }
                                    </Typography>
                                </Tooltip>
                            }
                        />
                        <Box sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <CardMedia
                                component={Box}
                                alt={token.id}
                                sx={{
                                    background: `url('${token.img}')`,
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    height: 200,
                                    width: 200,
                                    mb: 5
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )

}

export default SwapStatic;