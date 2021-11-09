import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/layout';

const About = () => {
	return (
		<Layout>
			<Head>
				<title>About</title>
			</Head>
			<h1>About</h1>
			<p>
				Go back <Link href="/">home</Link>
			</p>
		</Layout>
	);
};

export default About;
