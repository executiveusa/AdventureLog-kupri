import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const path = params.path;

	// Validate that the requested file is an itinerary JSON
	if (!path.endsWith('.json')) {
		return new Response('Not Found', { status: 404 });
	}

	try {
		// Dynamically import the requested itinerary
		// Only allow specific known itineraries to prevent arbitrary file access
		if (path === 'yvette-cuernavaca.json') {
			const itinerary = await import('$lib/surprise/itinerary/yvette-cuernavaca.json');
			return json(itinerary.default);
		}

		// If the requested itinerary is not found
		return new Response('Not Found', { status: 404 });
	} catch (error) {
		console.error('Error loading itinerary:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

// Handle preflight requests for CORS
export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
};
