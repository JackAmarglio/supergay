import {
    Backdrop,
    Fade,
    Modal,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardActions,
    CardContent,
    Typography,
    Tooltip,
    Button,
    Box,
    FormControl,
    InputLabel,
    IconButton,
    OutlinedInput,
    InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Scrollbar from 'components/Scrollbar';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    minHeight: '80%',
    maxHeight: '80%'
};

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
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Card sx={style}>
                    <CardHeader
                        title="Pick assets from wallet"
                    />
                    <CardContent>
                        <Scrollbar>
                            <Box sx={{
                                height: '700px'
                            }}>
                            <Grid container spacing={1}>
                                { data.map ( (token, tid) => (
                                    <Grid key={tid} item xs={12} md={3} lg={2}>
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
                                                {
                                                    token.type === 'NATIVE' ? (
                                                        <FormControl variant="outlined">
                                                            <InputLabel size="small" htmlFor="ether-amount">AMOUNT</InputLabel>
                                                            <OutlinedInput
                                                                fullWidth
                                                                id="ether-amount"
                                                                type="number"
                                                                size="small"
                                                                value={amountETH}
                                                                onChange={(e) => setEther(e.target.value)}
                                                                endAdornment={
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="add ether amount"
                                                                            onClick={() => removeElement(token && token.key, tid)}
                                                                            edge="end"
                                                                        >
                                                                            <AiOutlinePlus />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                }
                                                                label="Password"
                                                            />
                                                        </FormControl>
                                                    ) : (
                                                        <Button onClick={() => removeElement(token && token.key, tid)} fullWidth size="small">Add</Button>
                                                    )
                                                }
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            </Box>
                        </Scrollbar>
                    </CardContent>
                </Card>
            </Fade>
        </Modal>
    )

}

export default ModalContainer;