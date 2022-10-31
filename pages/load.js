import {
    Box,
    Card,
    Typography,
    Container,
    Divider,
    Button,
    FormControl,
    OutlinedInput,
    InputAdornment
  } from '@mui/material';
  import Head from 'next/head';
  import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
  import { styled } from '@mui/material/styles';
  import { useState } from 'react';
  import { useRouter } from 'next/router';
  import background from "../public/bg.png"

  const MainContent = styled(Box)(
    ({ theme }) => `
      height: 100%;
      display: flex;
      flex: 1;
      overflow: auto;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  `
  );
  
  const OutlinedInputWrapper = styled(OutlinedInput)(
    ({ theme }) => `
      background-color: white;
  `
  );
  
  const ButtonSearch = styled(Button)(
    ({ theme }) => `
      margin-right: -${theme.spacing(1)};
  `
  );
  
  function Status404() {
    const [term, setTerm] = useState(null);
    const router = useRouter();
    const handleChange = (e) => {
      setTerm(e.target.value);
    }
    const handleSubmit = (e) => {
      e.preventDefault();
      router.push(`/swap/${term}`);
    }
    return (
      <>
        <Head>
          <title>ETHTRADERS | Load Trade</title>
        </Head>
        <MainContent sx={{  minHeight: '70vh' }} style={{background: `url(${background.src})`, backgroundSize: 'contain', color: 'white'}}>
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography variant="h2" sx={{ my: 2 }}>
                Load your Trade Code
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
               Type the Trade Code your partner sent you down below!
               <Typography
                variant="h4"
                color="error"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >-&#62; Remember! Never trust any links sent by suspicious people! &#60;-</Typography>
              </Typography>
            </Box>
            <Container maxWidth="sm">
              <form onSubmit={handleSubmit}>
                <FormControl variant="outlined" fullWidth >
                  <OutlinedInputWrapper
                    type="text"
                    onChange={handleChange}
                    value={term}
                    endAdornment={
                      <InputAdornment position="end">
                        <ButtonSearch type="submit" variant="contained" size="small" style={{
                            padding: '0.8rem 2.4rem',
                            border: '1px solid #ff0077',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            background: '#252936'
                        }}> 
                          Load
                        </ButtonSearch>
                      </InputAdornment>
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </Container>
          </Container>
        </MainContent>
      </>
    );
  }
  
  export default Status404;
  