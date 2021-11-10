import Link from 'next/link';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, children }) => {
	const router = useRouter();
	const className = router.asPath === href ? 'nav-link active' : 'nav-link';
	return (
		<a href={href} className={className}>
			{children}
		</a>
	);
};

export default ActiveLink;
