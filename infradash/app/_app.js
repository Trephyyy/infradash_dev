import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import Head from 'next/head'
const theme = createTheme();

function MyApp({ Component, pageProps }) {
  return (
    <>
     <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
    <ThemeProvider suppressHydrationWarning={true} theme={theme}>
      <CssBaseline />
      <Navbar />
      <Component {...pageProps} />
    </ThemeProvider>
    </>
  );
}

export default MyApp;
