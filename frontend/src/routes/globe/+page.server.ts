import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const PUBLIC_SERVER_URL = process.env['PUBLIC_SERVER_URL'];
const endpoint = PUBLIC_SERVER_URL || 'http://localhost:8000';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const sessionId = event.cookies.get('sessionid');

	const pinsRes = await fetch(`${endpoint}/api/locations/pins/`, {
		headers: { Cookie: `sessionid=${sessionId}` }
	});

	if (!pinsRes.ok) {
		return redirect(302, '/login');
	}

	const pins = await pinsRes.json();

	return {
		props: { pins },
		user: event.locals.user
	};
};
