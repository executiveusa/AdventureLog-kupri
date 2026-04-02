<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Lost from '$lib/assets/undraw_lost.svg';
	import ServerError from '$lib/assets/undraw_server_error.svg';
	import { playClick } from '$lib/utils/sound';
	import { hapticTap } from '$lib/utils/haptic';

	function goHome() {
		playClick();
		hapticTap();
		goto('/');
	}

	const is404 = $page.status === 404;
	const isLoginRoute = $page.url.pathname === '/login' || $page.url.pathname === '/signup';
</script>

<div class="error-page">
	<div class="error-inner">
		{#if is404}
			<img src={Lost} alt="" aria-hidden="true" class="error-img" />
			<p class="error-code">404</p>
			<h1 class="error-heading">You've wandered off the path.</h1>
			<p class="error-body">The trail you followed doesn't exist — but there are many others worth exploring.</p>
		{:else}
			<img src={ServerError} alt="" aria-hidden="true" class="error-img" />
			<p class="error-code">{$page.status}</p>
			<h1 class="error-heading">Something went wrong in the jungle.</h1>
			<p class="error-body">
				The server encountered an error. If this keeps happening, check the
				<a href="https://adventurelog.app" target="_blank" rel="noopener noreferrer" class="error-link">AdventureLog docs</a>.
			</p>
			{#if isLoginRoute}
				<p class="error-hint">
					💡 If you're trying to log in, this may mean the backend server isn't running yet.
				</p>
			{/if}
		{/if}

		<button class="error-btn" on:click={goHome}>
			Return to Querencia
			<span aria-hidden="true"> →</span>
		</button>
	</div>
</div>

<style>
	.error-page {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0c0d0a;
		font-family: 'Lato', 'Helvetica Neue', sans-serif;
		padding: 2rem 1.5rem;
		color: #e8e2d4;
	}
	.error-inner {
		max-width: 480px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.error-img {
		width: 180px;
		height: auto;
		opacity: 0.55;
		filter: sepia(0.3) hue-rotate(20deg);
	}
	.error-code {
		font-family: 'DM Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		color: #c4963c;
		text-transform: uppercase;
		margin: 0;
	}
	.error-heading {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(1.6rem, 5vw, 2.4rem);
		font-weight: 700;
		margin: 0;
		line-height: 1.2;
		color: #e8e2d4;
	}
	.error-body {
		font-size: 0.9rem;
		color: #a09880;
		line-height: 1.7;
		margin: 0;
	}
	.error-link {
		color: #c4963c;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.error-hint {
		font-size: 0.8rem;
		color: #5a5448;
		background: rgba(196,150,60,0.06);
		border: 1px solid rgba(196,150,60,0.15);
		padding: 0.75rem 1rem;
		border-radius: 6px;
		margin: 0;
	}
	.error-btn {
		margin-top: 0.5rem;
		padding: 0.75rem 2rem;
		background: transparent;
		border: 1px solid rgba(196,150,60,0.4);
		color: #c4963c;
		font-family: 'DM Mono', monospace;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 0.2s, border-color 0.2s;
		border-radius: 2px;
	}
	.error-btn:hover {
		background: rgba(196,150,60,0.08);
		border-color: rgba(196,150,60,0.7);
	}
</style>
