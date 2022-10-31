import { Box, Container, Link, Typography, Stack, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import NextLink from 'next/link';

const FooterWrapper = styled(Box)(
  ({ theme }) => `
        border-radius: 0;
        margin: ${theme.spacing(3)} 0;
`
);

function Footer() {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Box
          py={3}
          display={{ xs: 'block', md: 'flex' }}
          alignItems="center"
          textAlign={{ xs: 'center', md: 'left' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="subtitle1">
              &copy; 2022 - ETHTRADERS Inc.
            </Typography>
          </Box>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <NextLink href="https://discord.gg/DNa83gtd4z" passHref>
              <IconButton component="a" target="_blank" rel="noopener noreferrer">
                <FaDiscord />
              </IconButton>
            </NextLink>
            <NextLink href="https://twitter.com/ETHTRADERSp2p" passHref>
              <IconButton component="a" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </IconButton>
            </NextLink>
          </Stack>
        </Box>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;
