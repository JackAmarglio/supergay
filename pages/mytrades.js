import {
    Stack,
    Typography,
    Divider,
    Table,
    Avatar,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    IconButton,
    TableContainer,
    TablePagination,
    Tooltip,
    Container,
    Grid,
    Button
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from 'services/api';
import Label from 'components/Label';
import { useMoralis } from 'react-moralis';
import { GoLinkExternal } from 'react-icons/go';
import { FaExchangeAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const TABLE_HEAD = [
    { id: 'from', label: 'From', alignRight: false },
    { id: '' },
    { id: 'to', label: 'To', alignRight: false },
    { id: 'code', label: 'Code', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' }
  ];
  
const MySwaps = () => {
    const router = useRouter();
    const { user, isAuthenticated, isAuthenticating, isInitialized } = useMoralis();
    useEffect(() => {
        if (!isAuthenticating && !isAuthenticated && isInitialized) {
          router.push('/connect');
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, isAuthenticating]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const fetchData = async () => {
        try {
            const { data: lr } = await api.get('/trade/history', {
                params: {
                    from: user && user.get('ethAddress')
                }
            });
            if(!lr.success)
                throw new Error(lr.message);
            setData(lr.trades);
        } catch (err) {
            toast.error(err.message);
        }
    }
    useEffect( () => {
        if(isInitialized && !isAuthenticating && isAuthenticated)
        fetchData();
    },  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, isAuthenticating]);
    return (
        <Container maxWidth="lg" sx={{ mt: 5, minHeight: 600 }}>
            <Head>
                <title>ETHTRADERS | My Trades</title>
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
                    My Trades
                    </Typography>
                </Grid>
                <Grid item>
                    <NextLink href="/swap" passHref>
                        <Button
                        sx={{ mt: { xs: 2, md: 0 } }}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                        >
                        Create
                        </Button>
                    </NextLink>
                </Grid>
              </Grid>
            </Stack>
            <Divider sx={{
                mt: 2,
                mb: 2
            }} />
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
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map( (row) => (
                                <TableRow
                                    hover
                                    key={row.id}
                                    tabIndex={-1}
                                >
                                    <TableCell component="th" scope="row" padding="none">
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar alt={row.from} src={`https://web3-images-api.kibalabs.com/v1/accounts/${row.from}/image`} />
                                            <Tooltip title={row.from}>
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.from.substr(0, 11)}...
                                                </Typography>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <FaExchangeAlt />
                                    </TableCell>
                                    <TableCell component="th" scope="row" padding="none">
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar alt={row.to} src={`https://web3-images-api.kibalabs.com/v1/accounts/${row.to}/image`} />
                                            <Tooltip title={row.to}>
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.to.substr(0, 11)}...
                                                </Typography>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Tooltip title={row.id}>
                                            <Typography variant="body2" noWrap>
                                                {row.id}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Label
                                        variant="ghost"
                                        color={(row.status === 'ongoing' && 'warning') || (row.status === 'confirmed' && 'success') || 'error'}
                                        >
                                            {row.status.toUpperCase()}
                                        </Label>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => router.push(`/swap/${row.id}`)}>
                                            <GoLinkExternal />
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
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    )
}
export default MySwaps;