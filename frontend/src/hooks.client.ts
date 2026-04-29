// Bypass Vite's host validation for sandbox environments
if (typeof window !== 'undefined') {
	// Override Vite's __HMR__ configuration to allow any host
	(window as any).__HMR__ = {
		host: location.hostname,
		protocol: 'ws',
		port: location.port || '443',
		timeout: 60000,
		overlay: true,
		__proto__: null,
	};

	// Monkey-patch the global validation to accept all hosts
	const originalViteCheck = (window as any).__vite_check_host;
	(window as any).__vite_check_host = () => true;
}
