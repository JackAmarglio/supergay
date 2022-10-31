import {
    Grid,
    Card,
    CardContent,
    Typography,
    Tooltip,
    Button,
    CardActionArea,
    InputAdornment,
    TextField,
    Stack
} from '@mui/material';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import Scrollbar from 'components/Scrollbar';

const ModalContainer = (props) => {
    const { 
        data, 
        setData,
        exData,
        setExData,
        open,
        handleClose
    } = props;
    const [amountETH, setEther] = useState(null);
    const index = data.findIndex(obj => obj.type === "NATIVE");
    const removeElement = (key, tid) => {
        try {
            var hugeData = [];
            var bigData = exData;
            var currentData = data;
            var i = 0;
            if(data[tid].type === 'NATIVE') {
                if(!amountETH)
                    throw new Error('Select an amount.');
                if(amountETH <= 0)
                    throw new Error('Select a valid amount.');
                let RangeNumber = Number(data[tid].amount);
                if(Number(amountETH) > RangeNumber)
                    throw new Error('Amount selected exceeds the limits.');
                if(amountETH >= RangeNumber) {
                    hugeData = data.filter(function( obj ) {
                        return obj.key !== key;
                    });
                    let dataFound = data.filter(function(obj) {
                        return obj.key === key;
                    });
                    bigData.push(dataFound[0]);
                    setExData(bigData);
                    setData(hugeData);
                } else {
                    var calcul = Number(currentData[tid].amount) - Number(amountETH);
                    hugeData = data.filter(function( obj ) {
                        return obj.key !== key;
                    });
                    hugeData.push({
                        img: '/ether.png',
                        key: 'ether',
                        type: 'NATIVE',
                        symbol: 'ETHER',
                        id: `${calcul} ETHER`,
                        address: 'ETHEREUM',
                        amount: calcul
                    });
                    let dataFound = bigData.filter(function(obj) {
                        return obj.key === key;
                    });
                    bigData = bigData.filter(function( obj ) {
                        return obj.key !== key;
                    });
                    calcul = amountETH;
                    if(dataFound && dataFound.length > 0)
                        calcul = Number(amountETH) + Number(dataFound[0].amount);
                    bigData.push({
                        img: '/ether.png',
                        key: 'ether',
                        type: 'NATIVE',
                        symbol: 'ETHER',
                        id: `${calcul} ETHER`,
                        address: 'ETHEREUM',
                        amount: calcul
                    });
                    setData(hugeData);
                    setExData(bigData);
                }
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
        } catch (err) {
            toast.error(err.message);
        }
      }
    return (
        <>
            <Card sx={{ height: 420, width: '100%', flexGrow: 1 }}>
                <CardContent>
                    <Scrollbar>
                        <Grid container spacing={1} sx={{ height: 400, p: 2 }}>
                            { data.map ( (token, tid) => {
                                if(token.type !== 'NATIVE')
                                    return (
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
                                                <Tooltip title={`${token.symbol} #${token.id} (${token.address})`}>
                                                    <CardActionArea sx={{ width: 120, height: 120 }} onClick={() => removeElement(token && token.key, tid)} />
                                                </Tooltip>
                                            </Card>
                                        </Grid>
                                    )
                            })}
                        </Grid>
                    </Scrollbar>
                </CardContent>
            </Card>
            <Card sx={{ width: '100%', mt: 3, pt: 2, pl: 3, pr: 3, pb: 1 }}>
                <Typography variant="h5" color="textPrimary">
                    Add ETH to your offer(s):
                </Typography>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if(data && data[index])
                        removeElement(data[index].key, index)
                    else
                        toast.error('An error has occurred.');
                }}>
                    <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 0.5 }}> 
                        <TextField
                            id="ether"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={amountETH}
                            onChange={(e) => setEther(e.target.value)}
                            min={0}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                      <FaEthereum />
                                  </InputAdornment>
                                ),
                            }}
                        />  
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit"
                            size="small"
                            sx={{
                                borderRadius: 3                            
                            }}
                        >
                            Add ETH
                        </Button>
                    </Stack>
                </form>
                <Typography variant="body1" color="textSecondary">
                    Balance: {data && data[index] && data[index].amount} ETH
                </Typography>
            </Card>
        </>
    )

}

export default ModalContainer;