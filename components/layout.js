import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import ActiveLink from './activeLink';

const name = 'Conversa';
export const siteTitle = 'Conversa for Unity';

export default function Layout({ children, home }) {
	return (
		<div className="container mx-auto">
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
					rel="stylesheet"
				/>

				<meta
					name="description"
					content="Learn how to build a personal website using Next.js"
				/>
				<meta
					property="og:image"
					content={`https://og-image.vercel.app/${encodeURI(
						siteTitle
					)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
				/>
				<meta name="og:title" content={siteTitle} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<div className="grid grid-cols-12">
				<div className="col-span-3">
					<div className={styles.sidebar}>
						<img
							src="/images/conversa.png"
							className={styles.logo}
						/>
						<h1 className="text-lg font-semibold px-2">
							Documentation
						</h1>
						<div className={styles.menu}>
							<ActiveLink href="/posts/download-install-conversa">
								Download & install
							</ActiveLink>

							<ActiveLink href="/posts/setting-up-conversation">
								Setting up a conversation
							</ActiveLink>

							<ActiveLink href="/posts/integration-with-game">
								Integrating it with your game
							</ActiveLink>

							<ActiveLink href="/posts/create-custom-data-nodes">
								Create custom data nodes
							</ActiveLink>

							<ActiveLink href="/posts/create-custom-event-nodes">
								Create custom event nodes
							</ActiveLink>

							<ActiveLink href="/posts/about-node-ports">
								About node ports
							</ActiveLink>
						</div>
					</div>
				</div>
				<main class="col-span-9">
					<div className={styles.main}>{children}</div>
				</main>
			</div>
		</div>
	);
}
