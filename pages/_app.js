import { MoralisProvider } from 'react-moralis';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FullLayout from 'layouts/FullLayout';
import Head from 'next/head';
import settings from 'settings';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { AuthProvider } from 'contexts/auth'
import ScrollToTop from 'components/ScrollToTop';
import { SidebarProvider } from 'contexts/SidebarContext';
import ThemeSettings from "theme/ThemeSettings";

const socialTags = ({
  url,
  title,
  description,
  image,
  createdAt,
  updatedAt,
}) => {
  const metaTags = [
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:site",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:creator",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:image:src", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "og:title", content: title },
    { name: "og:type", content: settings && settings.meta && settings.meta.type },
    { name: "og:url", content: url },
    { name: "og:image", content: image },
    { name: "og:description", content: description },
    {
      name: "og:site_name",
      content: settings && settings.meta && settings.meta.title,
    },
    {
      name: "og:published_time",
      content: createdAt || new Date().toISOString(),
    },
    {
      name: "og:modified_time",
      content: updatedAt || new Date().toISOString(),
    },
  ];

  return metaTags;
};

const MyApp = (props) => {
  const { 
    Component, 
    pageProps,
    url,
    title,
    description,
    image,
    keywords
  } = props;
  const Gettheme = ThemeSettings();
  return (
    <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="keywords" content={keywords} />
      <meta itemProp="image" content={image} />
      {socialTags(props).map(({ name, content }) => {
        return <meta key={name} name={name} content={content} />;
      })}      
    </Head>
    <ThemeProvider theme={Gettheme}>
      <SidebarProvider>
        <ScrollToTop /> 
        <AuthProvider>
            <MoralisProvider 
              appId={settings && settings.moralis && settings.moralis.id}
              serverUrl={settings && settings.moralis && settings.moralis.url}
            >
              <FullLayout>
                <main>
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                  />
                  <CssBaseline />
                  <Component {...pageProps} />
                </main>
              </FullLayout>
            </MoralisProvider>
          </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
    </>
  )
}

MyApp.defaultProps = {
  url: settings && settings.meta && settings.meta.rootUrl,
  title: settings && settings.meta && settings.meta.title,
  description: settings && settings.meta && settings.meta.description,
  image:
    settings &&
    settings.meta &&
    settings.meta.social &&
    settings.meta.social.graphic,
  keywords: settings & settings.meta && settings.meta.keywords
};

export default MyApp
