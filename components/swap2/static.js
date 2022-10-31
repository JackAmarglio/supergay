import {
    Grid,
    Card,
    CardHeader,
    CardMedia,
    Typography,
    Tooltip,
} from '@mui/material';

const SwapStatic = (props) => {
    const { 
        data,
    } = props;
    return (
        <Grid container spacing={1}>
            { data.map ( (token, tid) => (
                <Grid key={tid} item xs={12} md={6} lg={3}>
                    <Card variant="outlined">
                        <CardHeader
                            title={
                                <Tooltip title={token.address}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }} noWrap>
                                        {
                                            token.type === 'NATIVE' ? 'ETHER' : `${token.address.substr(0, 11)}...`
                                        }
                                    </Typography>
                                </Tooltip>
                            }
                            subheader={
                                <Tooltip title={token.id}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>
                                        {
                                            token.type === 'NATIVE' ? `${token.amount}ETH` : `id: ${token.id.substr(0, 7)}`
                                        }
                                    </Typography>
                                </Tooltip>
                            }
                        />
                        <CardMedia
                            component="img"
                            height="194"
                            width="194"
                            image={token.img}
                            alt={token.id}
                        />
                    </Card>
                </Grid>
            ))}
        </Grid>
    )

}

export default SwapStatic;