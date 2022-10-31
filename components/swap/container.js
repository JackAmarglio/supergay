import {
    Grid,
    Card,
    CardContent,
    Tooltip,
    CardActionArea,
} from '@mui/material';
import Scrollbar from 'components/Scrollbar';

const SwapContainer = (props) => {
    const { 
        data, 
        setData,
        exData,
        setExData
    } = props;
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
        <>
         <Card sx={{ height: 320, width: '100%', flexGrow: 1 }}>
                <CardContent>
                    <Scrollbar>
                        <Grid container spacing={1} sx={{ height: 300, p: 2 }}>
                            { data.map ( (token, tid) => (
                                <Grid key={tid} item xs={6} sm={4} md={3}>
                                    <Card 
                                        variant="outlined" 
                                        sx={{ 
                                            height: 120, 
                                            width: 120 ,
                                            background: `url('${token.img}')`,
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: 'cover',
                                        }}
                                    >
                                        {
                                            token.type === 'NATIVE' ? (
                                                <Tooltip title={`${token.amount} ETH`}>
                                                    <CardActionArea sx={{ width: 120, height: 120 }} onClick={() => removeElement(token && token.key, tid)} />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title={`${token.symbol} #${token.id} (${token.address})`}>
                                                    <CardActionArea sx={{ width: 120, height: 120 }} onClick={() => removeElement(token && token.key, tid)} />
                                                </Tooltip>
                                            )
                                        }
                                        
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Scrollbar>
                </CardContent>
            </Card>
        </>
    )

}

export default SwapContainer;