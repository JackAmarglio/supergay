import {
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardActions,
    Typography,
    Tooltip,
    Button
} from '@mui/material';
import { useState } from 'react';

const SwapContainer = (props) => {
    const { 
        data, 
        setData,
        exData,
        setExData
    } = props;
    const [amountETH, setEther] = useState(null);
    const removeElement = (key, tid) => {
        let hugeData = [];
        let bigData = exData;
        if(data[tid].type === 'NATIVE') {
            hugeData = data.filter(function( obj ) {
                return obj.key !== key;
            });
            let dataFound = data.filter(function(obj) {
                return obj.key === key;
            });
            let etherAmount = Number(dataFound[0].amount);
            let dataFound2 = exData.filter(function(obj) {
                return obj.key === key;
            });
            if(dataFound2 && dataFound2.length > 0)
                etherAmount = Number(dataFound[0].amount) + Number(dataFound2[0].amount);
            bigData = bigData.filter(function( obj ) {
                return obj.key !== key;
            });
            bigData.push({
                img: '/ether.png',
                key: 'ether',
                type: 'NATIVE',
                symbol: 'ETHER',
                id: `${etherAmount} ETHER`,
                address: 'ETHEREUM',
                amount: etherAmount
            });
            setData(hugeData);
            setExData(bigData);
        } else {
            hugeData = data.filter(function( obj ) {
                return obj.key !== key;
            });
            let dataFound = data.filter(function(obj) {
                return obj.key === key;
            });
            bigData.push(dataFound[0]);
            setExData(bigData);
            setData(hugeData);
        }
    }
    return (
        <Grid container spacing={1}>
            { data.map ( (token, tid) => (
                <Grid key={tid} xs={12} md={6} lg={3}>
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
                        <CardActions>
                            <Button onClick={() => removeElement(token && token.key, tid)} fullWidth size="small">Remove</Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )

}

export default SwapContainer;