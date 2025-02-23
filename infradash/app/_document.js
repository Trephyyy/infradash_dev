// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Head from 'next/head'
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon"  href="/logo.png" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/vanta@1.0.0/dist/vanta.dots.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
