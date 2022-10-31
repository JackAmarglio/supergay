import Head from 'next/head';
const Index = () => {
  return (
    <Head>
      <title>ETHTRADERS | Redirecting</title>
    </Head>
  )
}
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/home',
      permanent: false,
    },
  }
}

export default Index;