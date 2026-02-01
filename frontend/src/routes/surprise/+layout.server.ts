import type { LayoutServerLoad } from './$types';

/**
 * Layout for the surprise routes
 * These routes are PUBLIC and don't require authentication
 */
export const load: LayoutServerLoad = async (event) => {
	// Pass through locale from root layout
	// User authentication is not required for surprise routes
	return {
		user: null, // Explicitly set user to null for public access
		locale: event.locals.locale
	};
};
