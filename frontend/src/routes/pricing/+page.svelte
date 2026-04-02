<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { playClick } from '$lib/utils/sound';
	import { hapticTap } from '$lib/utils/haptic';

	const tiers = [
		{
			name: 'Explorer',
			price: 'Free',
			period: '',
			description: 'Start planning conscious travel today.',
			features: [
				'Access the eco-tourism directory',
				'Read all Journal articles',
				'Basic trip planning tools',
				'Community forum access'
			],
			cta: 'Get Started',
			accent: false
		},
		{
			name: 'Pathfinder',
			price: '$29',
			period: '/month',
			description: 'AI-assisted planning with local verification.',
			features: [
				'Everything in Explorer',
				'AI itinerary generation',
				'Local guide verification',
				'Unlimited saved trips',
				'Priority community support',
				'WhatsApp concierge (business hours)'
			],
			cta: 'Start Free Trial',
			accent: false
		},
		{
			name: 'Sacred',
			price: '$99',
			period: '/month',
			description: 'Full-service curated experiences with live agent support.',
			features: [
				'Everything in Pathfinder',
				'Dedicated Hermes agent',
				'Real-time itinerary adaptation',
				'24/7 WhatsApp concierge',
				'VisionClaw translation & scene analysis',
				'Exclusive partner discounts (15-30%)',
				'Surprise experience templates',
				'Monthly local guide video calls'
			],
			cta: 'Start Free Trial',
			accent: true
		},
		{
			name: 'Querencia Circle',
			price: '$499',
			period: '/quarter',
			description: 'For travel creators, agencies, and repeat explorers.',
			features: [
				'Everything in Sacred',
				'White-label experience builder',
				'API access for custom integrations',
				'Dedicated account manager',
				'Co-branded marketing materials',
				'Revenue sharing on referrals',
				'Annual planning retreat (Mexico)',
				'Direct line to founding team'
			],
			cta: 'Apply Now',
			accent: false
		}
	];

	function handleCTA(tierName: string) {
		playClick();
		hapticTap();
		// Future: open Stripe checkout or waitlist modal
	}
</script>

<svelte:head>
	<title>Pricing — Querencia™</title>
	<meta name="description" content="Transparent pricing for eco-luxury travel planning. From free exploration to full-service curated experiences." />
</svelte:head>

<div class="pricing-root">
	<header class="pricing-header">
		<a href="/" class="back-link">← Querencia™</a>
		<p class="overline">Transparent Pricing</p>
		<h1>Invest in Travel That Gives Back</h1>
		<p class="header-sub">Every tier funds reforestation and community tourism. The more you explore, the more we restore.</p>
	</header>

	<div class="tiers-grid">
		{#each tiers as tier}
			<div class="tier-card" class:accent={tier.accent}>
				{#if tier.accent}
					<div class="tier-badge">Most Popular</div>
				{/if}
				<div class="tier-head">
					<h2>{tier.name}</h2>
					<div class="tier-price">
						<span class="price">{tier.price}</span>
						{#if tier.period}<span class="period">{tier.period}</span>{/if}
					</div>
					<p class="tier-desc">{tier.description}</p>
				</div>
				<ul class="tier-features">
					{#each tier.features as feature}
						<li><span class="check">✓</span> {feature}</li>
					{/each}
				</ul>
				<button
					class="tier-cta"
					class:cta-accent={tier.accent}
					on:click={() => handleCTA(tier.name)}
				>
					{tier.cta}
				</button>
			</div>
		{/each}
	</div>

	<section class="guarantee">
		<h3>The Querencia Guarantee</h3>
		<p>If your first curated experience doesn't exceed expectations, we'll refund your subscription and donate your fee to reforestation. No questions. No friction.</p>
	</section>

	<section class="value-stack">
		<h3>What You Actually Get</h3>
		<div class="stack-grid">
			<div class="stack-item">
				<span class="stack-value">$2,400+</span>
				<span class="stack-label">Annual savings on vetted experiences vs. booking separately</span>
			</div>
			<div class="stack-item">
				<span class="stack-value">40+ hrs</span>
				<span class="stack-label">Planning time saved per trip with AI + local verification</span>
			</div>
			<div class="stack-item">
				<span class="stack-value">100%</span>
				<span class="stack-label">Of recommended experiences vetted by local community partners</span>
			</div>
			<div class="stack-item">
				<span class="stack-value">5%</span>
				<span class="stack-label">Of revenue directed to reforestation & community infrastructure</span>
			</div>
		</div>
	</section>

	<Footer />
</div>

<style>
	.pricing-root {
		min-height: 100dvh;
		background: #0c0d0a;
		color: #e8e2d4;
		font-family: 'Lato', 'DM Sans', system-ui, sans-serif;
	}

	.pricing-header {
		max-width: 72rem;
		margin: 0 auto;
		padding: 3rem 1.5rem 2rem;
		text-align: center;
	}

	.back-link {
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		color: #c4963c;
		text-decoration: none;
		text-transform: uppercase;
		transition: opacity 0.2s;
	}

	.back-link:hover { opacity: 0.7; }

	.overline {
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(90, 122, 82, 0.8);
		margin: 2rem 0 0.75rem;
	}

	.pricing-header h1 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		margin: 0 0 0.75rem;
		line-height: 1.1;
	}

	.header-sub {
		font-size: 1rem;
		color: rgba(232, 226, 212, 0.5);
		max-width: 32rem;
		margin: 0 auto;
		line-height: 1.6;
	}

	.tiers-grid {
		max-width: 76rem;
		margin: 2rem auto 0;
		padding: 0 1.5rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.tiers-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 1024px) {
		.tiers-grid { grid-template-columns: repeat(4, 1fr); }
	}

	.tier-card {
		position: relative;
		border: 1px solid rgba(196, 150, 60, 0.1);
		border-radius: 4px;
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		background: rgba(255, 255, 255, 0.02);
		transition: border-color 0.25s;
	}

	.tier-card:hover {
		border-color: rgba(196, 150, 60, 0.25);
	}

	.tier-card.accent {
		border-color: #c4963c;
		background: rgba(196, 150, 60, 0.04);
	}

	.tier-badge {
		position: absolute;
		top: -0.6rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.6rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		background: #c4963c;
		color: #0c0d0a;
		padding: 0.2rem 0.75rem;
		border-radius: 2px;
		font-weight: 700;
	}

	.tier-head {
		margin-bottom: 1.5rem;
	}

	.tier-head h2 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.3rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
		color: #e8e2d4;
	}

	.tier-price {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
		margin-bottom: 0.5rem;
	}

	.price {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 2.5rem;
		font-weight: 700;
		color: #c4963c;
	}

	.period {
		font-size: 0.8rem;
		color: rgba(232, 226, 212, 0.4);
	}

	.tier-desc {
		font-size: 0.85rem;
		color: rgba(232, 226, 212, 0.45);
		line-height: 1.5;
		margin: 0;
	}

	.tier-features {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.tier-features li {
		font-size: 0.82rem;
		line-height: 1.4;
		color: rgba(232, 226, 212, 0.6);
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.check {
		color: #5a7a52;
		font-weight: 700;
		flex-shrink: 0;
	}

	.tier-cta {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid rgba(196, 150, 60, 0.3);
		border-radius: 3px;
		background: transparent;
		color: #c4963c;
		font-family: 'Lato', 'DM Sans', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}

	.tier-cta:hover {
		background: rgba(196, 150, 60, 0.08);
	}

	.tier-cta.cta-accent {
		background: #c4963c;
		color: #0c0d0a;
		border-color: #c4963c;
	}

	.tier-cta.cta-accent:hover {
		background: #d4a64c;
	}

	.guarantee {
		max-width: 42rem;
		margin: 4rem auto;
		padding: 2.5rem 2rem;
		border: 1px solid rgba(196, 150, 60, 0.15);
		border-radius: 4px;
		text-align: center;
	}

	.guarantee h3 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.5rem;
		color: #c4963c;
		margin: 0 0 0.75rem;
	}

	.guarantee p {
		font-size: 0.92rem;
		line-height: 1.7;
		color: rgba(232, 226, 212, 0.55);
		margin: 0;
	}

	.value-stack {
		max-width: 60rem;
		margin: 0 auto 4rem;
		padding: 0 1.5rem;
		text-align: center;
	}

	.value-stack h3 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.5rem;
		color: #e8e2d4;
		margin: 0 0 2rem;
	}

	.stack-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.stack-grid { grid-template-columns: repeat(4, 1fr); }
	}

	.stack-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.25rem;
		border: 1px solid rgba(196, 150, 60, 0.08);
		border-radius: 4px;
	}

	.stack-value {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #c4963c;
	}

	.stack-label {
		font-size: 0.78rem;
		line-height: 1.5;
		color: rgba(232, 226, 212, 0.45);
	}
</style>
