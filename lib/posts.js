import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';
import { rehype } from 'rehype';
import rehypeHighlight from 'rehype-highlight';
import remarkPrism from 'remark-prism';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkStringify from 'remark-stringify';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map((fileName) => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '');

		// Read markdown file as string
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, 'utf8');

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			id,
			...matterResult.data,
		};
	});

	// Sort posts by date
	return allPostsData.sort(({ date: a }, { date: b }) => {
		if (a < b) {
			return 1;
		} else if (a > b) {
			return -1;
		} else {
			return 0;
		}
	});
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory);

	// Returns an array that looks like this:
	// [{ params: { id: 'ssg-ssr' } }, ...]
	return fileNames.map((fileName) => ({
		params: {
			id: fileName.replace(/\.md$/, ''),
		},
	}));
}

export async function getPostData(id) {
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);

	// Use remark to convert markdown into HTML string
	const processedContent = await unified()
		.use(remarkParse)
		.use(remarkStringify)
		.use(remarkPrism)
		.use(remarkHtml)
		.process(matterResult.content);
	const contentHtml = processedContent.toString();

	// Combine the data with the id and contentHtml
	return { id, contentHtml, ...matterResult.data };
}

async function processedContent(fileContents) {
	const result = await remark().use(html).use(prism).process(markdown);
	return result.toString();
}
