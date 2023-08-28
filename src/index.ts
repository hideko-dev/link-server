import { Router } from 'itty-router';

declare global {
	// Cloudflare Worker上でFetchEvent型を定義
	interface FetchEvent extends Event {
		request: Request;
		respondWith(response: Promise<Response> | Response): void;
	}
}

const router = Router();

const redirectList = [
	{ id: '/', to: 'https://hideko.cf' },
	{ id: '/github', to: 'https://github.com/Hideko-Dev' },
	{ id: '/linkedin', to: 'https://www.linkedin.com/in/hideko-cat-143a3b285/' },
	{ id: '/instagram', to: 'https://instagram.com/hideko_cat/' }
];

redirectList.forEach(rule => {
	router.get(rule.id, () => Response.redirect(rule.to, 302));
});

router.get('*', () => new Response('Not Found', { status: 404 }));

addEventListener('fetch', (event: FetchEvent) => {
	event.respondWith(handleRequest(event.request));
});

// @ts-ignore
async function handleRequest(request: Request): Promise<Response> {
	const response = await router.handle(request);
	return response;
}
