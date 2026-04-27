<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { playClick, playWhoosh, playSuccess, unlockAudio } from '$lib/utils/sound';
	import { hapticTap, hapticSuccess } from '$lib/utils/haptic';

	let lang: 'es' | 'en' = 'es';
	let visible = false;
	let confettiLoaded = false;
	let ctaLoading = false;
	let initError = '';

	const copy = {
		es: {
			eyebrow: '¡Una Sorpresa Especial!',
			headline: '¡Estás Invitada!',
			sub: 'Una aventura de cumpleaños está esperando por ti.',
			desc: 'Hemos preparado algo muy especial para celebrar tu día. Sigue las pistas, descubre los secretos y vive una experiencia única.',
			cta: '¡Abrir Mi Sorpresa!',
			toggle: 'EN'
		},
		en: {
			eyebrow: 'A Special Surprise!',
			headline: "You're Invited!",
			sub: 'A birthday adventure is waiting for you.',
			desc: "We've prepared something very special to celebrate your day. Follow the clues, discover the secrets, and live a unique experience.",
			cta: 'Open My Surprise!',
			toggle: 'ES'
		}
	};

	$: t = copy[lang];

	const emojis = ['🎂', '🎁', '🎉', '✨', '🌸', '🦋', '🎊', '💫', '🌟', '🎈', '🍰', '🌺', '🪄', '💝', '🎀', '🌈', '⭐', '🪅', '🎶', '💐'];

	async function fireBurst() {
		if (!confettiLoaded) return;
		try {
			const confetti = (await import('canvas-confetti')).default;
			confetti({
				particleCount: 120,
				spread: 90,
				origin: { y: 0.6 },
				colors: ['#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#60a5fa', '#f9fafb']
			});
		} catch (e) {
			console.warn('[Birthday] Confetti failed:', e);
		}
	}

	onMount(async () => {
		setTimeout(() => { visible = true; }, 80);
		unlockAudio();

		try {
			await import('canvas-confetti');
			confettiLoaded = true;
		} catch (e) {
			console.warn('[Birthday] canvas-confetti load failed:', e);
		}

		setTimeout(async () => {
			await fireBurst();
			playSuccess();
			hapticSuccess();
		}, 600);
	});

	async function handleCTA() {
		if (ctaLoading) return;
		ctaLoading = true;
		playWhoosh();
		hapticSuccess();
		await fireBurst();
		setTimeout(() => {
			goto('/surprise/experience/cuernavaca-sacred');
		}, 800);
	}

	function toggleLang() {
		lang = lang === 'es' ? 'en' : 'es';
		playClick();
		hapticTap();
	}
</script>

<svelte:head>
	<title>¡Sorpresa de Cumpleaños! 🎂</title>
	<meta name="description" content="Una sorpresa especial de cumpleaños te espera." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="birthday-root" class:visible>
	<!-- Floating emoji particles -->
	<div class="particles" aria-hidden="true">
		{#each emojis as emoji, i}
			<span
				class="particle"
				style="
					left: {(i * 4.9 + 2) % 100}%;
					animation-delay: {(i * 0.37).toFixed(2)}s;
					animation-duration: {(6 + (i % 5)).toFixed(1)}s;
					font-size: {1.1 + (i % 3) * 0.4}rem;
				"
			>{emoji}</span>
		{/each}
	</div>

	<!-- Language toggle -->
	<button class="lang-toggle" on:click={toggleLang} aria-label="Switch language">
		{t.toggle}
	</button>

	<!-- Main content -->
	<main class="content">
		<div class="gift-icon" aria-hidden="true">🎂</div>

		<p class="eyebrow">{t.eyebrow}</p>

		<h1 class="headline">{t.headline}</h1>

		<p class="sub">{t.sub}</p>

		<p class="desc">{t.desc}</p>

		<button class="cta-btn" on:click={handleCTA} disabled={ctaLoading}>
			<span>{t.cta}</span>
			{#if ctaLoading}
				<span class="cta-spinner"></span>
			{:else}
				<span class="cta-arrow">→</span>
			{/if}
		</button>
	</main>

	<div class="shimmer-bar" aria-hidden="true"></div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	.birthday-root {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		background: radial-gradient(ellipse at 60% 30%, #2d1b69 0%, #0f0520 50%, #000 100%);
		font-family: 'DM Sans', sans-serif;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.7s ease, transform 0.7s ease;
	}

	.birthday-root.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.particles {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.particle {
		position: absolute;
		bottom: -10%;
		animation: floatUp linear infinite;
		opacity: 0.75;
		user-select: none;
	}

	@keyframes floatUp {
		0% { transform: translateY(0) rotate(0deg); opacity: 0; }
		10% { opacity: 0.75; }
		90% { opacity: 0.5; }
		100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
	}

	.lang-toggle {
		position: fixed;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 50;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.85);
		font-family: 'DM Sans', sans-serif;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		padding: 0.4rem 0.85rem;
		border-radius: 2rem;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition: background 0.2s, border-color 0.2s;
	}

	.lang-toggle:hover {
		background: rgba(255, 255, 255, 0.18);
		border-color: rgba(255, 255, 255, 0.35);
	}

	.content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem 1.5rem;
		max-width: 640px;
		gap: 1rem;
	}

	.gift-icon {
		font-size: 4rem;
		animation: giftPulse 2.4s ease-in-out infinite;
		filter: drop-shadow(0 0 20px rgba(244, 114, 182, 0.6));
		line-height: 1;
	}

	@keyframes giftPulse {
		0%, 100% { transform: scale(1) rotate(-3deg); }
		50% { transform: scale(1.1) rotate(3deg); }
	}

	.eyebrow {
		font-family: 'DM Sans', sans-serif;
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(244, 114, 182, 0.9);
		margin: 0;
	}

	.headline {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.8rem, 10vw, 5.5rem);
		font-weight: 700;
		line-height: 1.05;
		margin: 0;
		background: linear-gradient(135deg, #f9fafb 0%, #f472b6 50%, #a78bfa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.sub {
		font-family: 'Playfair Display', Georgia, serif;
		font-style: italic;
		font-size: clamp(1rem, 3vw, 1.35rem);
		color: rgba(248, 215, 236, 0.85);
		margin: 0;
		line-height: 1.5;
	}

	.desc {
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.7;
		margin: 0;
		max-width: 480px;
	}

	.cta-btn {
		margin-top: 0.75rem;
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.9rem 2.2rem;
		background: linear-gradient(135deg, #f472b6, #a78bfa);
		border: none;
		border-radius: 3rem;
		color: #fff;
		font-family: 'DM Sans', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: pointer;
		box-shadow: 0 4px 24px rgba(167, 139, 250, 0.35);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.cta-btn:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 8px 32px rgba(167, 139, 250, 0.5), 0 0 0 4px rgba(244, 114, 182, 0.15);
	}

	.cta-btn:active {
		transform: translateY(0) scale(0.98);
	}

	.cta-spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: ctaSpin 0.7s linear infinite;
	}
	@keyframes ctaSpin { to { transform: rotate(360deg); } }

	.cta-arrow {
		transition: transform 0.2s;
	}

	.cta-btn:hover .cta-arrow {
		transform: translateX(4px);
	}

	.shimmer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, #f472b6, #a78bfa, #60a5fa, transparent);
		background-size: 200% 100%;
		animation: shimmer 3s linear infinite;
	}

	@keyframes shimmer {
		0% { background-position: -200% 0; }
		100% { background-position: 200% 0; }
	}
</style>
