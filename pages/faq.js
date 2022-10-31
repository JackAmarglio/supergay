import {
    Typography,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container
} from '@mui/material';
import Head from 'next/head';
import { AiOutlineCaretDown } from 'react-icons/ai';
import NextLink from 'next/link';
import background from "../public/bg.png"

const faqSection = [
    {
        title: 'How to trade?',
        info: `Here's an illustration of how trading is simple and intuitive: Alice and Bob are interested in exchanging NFTs.
        Alice chooses the NFTs she wants to trade from her wallet. She then inputs Bob's wallet address, selects the NFTs she requires from his wallet, and offers the trade. She will be given a trade Code, which she will communicate to Bob. He will examine the contents of the trade and decide whether to accept or reject it. 
        Following acceptance, the escrow contract with trade both parties' NFTs after 2~3 hours.`
    },
    {
        title: 'How does trading work?',
        info: `ETHTRADERS is primarily a decentralized application, hence smart contracts on the Ethereum Blockchain are used.
        You grant approval of your NFTs to ETHTRADERS's escrow smart contract after creating a trade request. When the other side accepts the exchange, the smart contract will trade both NFTs after a certain amount of time. Naturally, you can cancel the process, and the ETHTRADERS escrow smart contract will instantly revoke the approval.`
    },
    {
        title: 'Are my NFTs safe with ETHTRADERS?',
        info: 'Smart contracts have completely decentralized and automated everything. You can take comfort in knowing that your NFTs are completely safe.'
    },
    {
        title: 'Do I have to select the NFTs of my counterparty?',
        info: `Yes, you select the NFTs you desire from your counterparty's address before proposing a trade.`
    },
    {
        title: 'Which tokens are supported?',
        info: `For now, ERC-20 Ethereum and ERC-721 NFT tokens are supported.`
    },
    {
        title: 'Which wallets are supported?',
        info: `Metamask and Walletconnect.`
    },
    {
        title: 'Does ETHTRADERS charge fees?',
        info: `ETHTRADERS does not take any fees whatsoever, you only have to pay gas fees!`
    },
    {
        title: 'What is 0x v4 Swap SDK? ',
        info: `Swap SDK is an Ethereum protocol that facilitates trading and exchanging for both users and developers alike, with it, ETHTRADERS allows users to trade NFT and ETH tokens securely and safely. On top of that, SWAP SDK implements gas optimization techniques that will save your time and money, allowing you trade faster and cheaper.`
    }
]
const FAQ = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 10, minHeight: 600 }} style={{background: `url(${background.src})`, backgroundSize: 'contain', color: 'white'}}>
            <Head>
                <title>ETHTRADERS | Frequently Asked Questions</title>
            </Head>
            <Stack
                direction="column"
                justifyContent="center"
                spacing={1}
            >
                <Typography
                    color="white"
                    variant="h3"
                >
                    Frequently Asked Questions.
                </Typography>
                <Typography
                    color="white"
                    variant="body1"
                >
                    Stuck on something? Have a question? Check out our FAQs first.
                </Typography>
                {
                    faqSection.map( (e, i) => (
                        <Accordion key={i}>
                            <AccordionSummary
                                expandIcon={<AiOutlineCaretDown />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                            <Typography color="textPrimary">{e.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography color="textSecondary">
                                {e.info}
                            </Typography>
                            </AccordionDetails>
                      </Accordion>
                    ))
                }
                <Typography
                    color="textSecondary"
                    variant="body1"
                >
                    If you encounter any problems or have any doubts, do not hesitate to ask for help.
                    <Typography
                        color="textSecondary"
                        variant="body1"
                    >
                        you can send us an e-mail over at: support@ethtraders.net
                    </Typography>
                </Typography>
            </Stack>
        </Container>
    )
}

export default FAQ;