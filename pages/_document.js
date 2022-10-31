import Document, { Html, Head, Main, NextScript } from 'next/document';


class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet" />
          <script src="https://unpkg.com/moralis-v1@latest/dist/moralis.js" type="text/javascript"></script> 
          <script src="https://code.jquery.com/jquery-3.6.0.js" crossOrigin="anonymous"></script> 
          <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.6.9/ethers.umd.min.js" crossOrigin="anonymous" referrerPolicy="no-referrer"></script> 
          <script src="chain-bundle.js"></script> 
          <script src="chain-common.js"></script>
          <link
            rel="icon"
            href="/favicon.ico"
          />
          <meta
            name="theme-color"
            content="#f3cb5c"
          />
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;