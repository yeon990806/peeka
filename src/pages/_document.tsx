import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <title>Peeka</title>
          <meta name="keywords" content="영화 드라마 애니메이션 만화 웹툰 웹소설 피카 SNS 소셜미디어 커뮤니티 추천"></meta>
          <meta name="description" content="영화, 드라마, 웹툰, 웹소설을 소재로 소통하는 공간"></meta>
          <meta name="author" content="peeka corp."></meta>
          <meta property="og:type" content="website"></meta>
          <meta property="og:title" content="피카"></meta>
          <meta property="og:description" content="영화, 드라마, 웹툰, 웹소설을 소재로 소통하는 공간"></meta>
          <meta property="og:image" content="/images/peeka-logo-dark.svg"></meta>
          <meta property="og:url" content="http://www.peeka.ai"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
