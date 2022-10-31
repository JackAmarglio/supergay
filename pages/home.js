import Head from 'next/head';
import Hero from 'components/home/hero';
import { Stack } from '@mui/material';

const Home = () => {
    return (
        <>
            <Head>
                <title>ETHTRADERS | Home</title>
            </Head>
            <Stack
                direction="column"
                spacing={10}
            >
                <Hero />
            </Stack>
        </>
    )
}

export default Home;