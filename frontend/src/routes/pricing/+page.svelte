<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { playClick } from '$lib/utils/sound';
	import { hapticTap } from '$lib/utils/haptic';

	// Pricing in MXN — adjusted for the Mexican market (April 2026)
	const tiers = [
		{
			name: 'Explorador',
			name_en: 'Explorer',
			price: 'Gratis',
			price_en: 'Free',
			period: '',
			period_en: '',
			description: 'Comienza a planear viajes conscientes hoy.',
			description_en: 'Start planning conscious travel today.',
			features: [
				{ es: 'Acceso al directorio ecoturístico', en: 'Eco-tourism directory access' },
				{ es: 'Lee todos los artículos del Diario', en: 'Read all Journal articles' },
				{ es: 'Herramientas básicas de planificación', en: 'Basic trip planning tools' },
				{ es: 'Acceso al foro comunitario', en: 'Community forum access' }
			],
			cta: 'Comenzar',
			cta_en: 'Get Started',
			accent: false
		},
		{
			name: 'Orientador',
			name_en: 'Pathfinder',
			price: '$490',
			price_en: '$28 USD',
			period: '/mes',
			period_en: '/month',
			description: 'Planificación asistida por IA con verificación local.',
			description_en: 'AI-assisted planning with local verification.',
			features: [
				{ es: 'Todo lo de Explorador', en: 'Everything in Explorer' },
				{ es: 'Generación de itinerarios con IA', en: 'AI itinerary generation' },
				{ es: 'Verificación por guías locales', en: 'Local guide verification' },
				{ es: 'Viajes guardados ilimitados', en: 'Unlimited saved trips' },
				{ es: 'Soporte comunitario prioritario', en: 'Priority community support' },
				{ es: 'Concierge por WhatsApp (horario comercial)', en: 'WhatsApp concierge (business hours)' }
			],
			cta: 'Prueba Gratis',
			cta_en: 'Start Free Trial',
			accent: false
		},
		{
			name: 'Sagrado',
			name_en: 'Sacred',
			price: '$1,799',
			price_en: '$103 USD',
			period: '/mes',
			period_en: '/month',
			description: 'Experiencias completas con agente en vivo 24/7.',
			description_en: 'Full-service curated experiences with live agent support.',
			features: [
				{ es: 'Todo lo de Orientador', en: 'Everything in Pathfinder' },
				{ es: 'Agente Hermes dedicado', en: 'Dedicated Hermes agent' },
				{ es: 'Adaptación de itinerario en tiempo real', en: 'Real-time itinerary adaptation' },
				{ es: 'Concierge WhatsApp 24/7', en: '24/7 WhatsApp concierge' },
				{ es: 'Traducción VisionClaw y análisis de escenas', en: 'VisionClaw translation & scene analysis' },
				{ es: 'Descuentos exclusivos con socios (15-30%)', en: 'Exclusive partner discounts (15-30%)' },
				{ es: 'Plantillas de experiencias sorpresa', en: 'Surprise experience templates' },
				{ es: 'Videollamadas mensuales con guías locales', en: 'Monthly local guide video calls' }
			],
			cta: 'Prueba Gratis',
			cta_en: 'Start Free Trial',
			accent: true
		},
		{
			name: 'Círculo Querencia',
			name_en: 'Querencia Circle',
			price: '$8,499',
			price_en: '$486 USD',
			period: '/trimestre',
			period_en: '/quarter',
			description: 'Para creadores de viajes, agencias y exploradores frecuentes.',
			description_en: 'For travel creators, agencies, and repeat explorers.',
			features: [
				{ es: 'Todo lo de Sagrado', en: 'Everything in Sacred' },
				{ es: 'Constructor de experiencias con tu marca', en: 'White-label experience builder' },
				{ es: 'Acceso API para integraciones personalizadas', en: 'API access for custom integrations' },
				{ es: 'Gerente de cuenta dedicado', en: 'Dedicated account manager' },
				{ es: 'Materiales de marketing co-branded', en: 'Co-branded marketing materials' },
				{ es: 'Reparto de ingresos por referidos', en: 'Revenue sharing on referrals' },
				{ es: 'Retiro anual de planificación (México)', en: 'Annual planning retreat (Mexico)' },
				{ es: 'Línea directa con el equipo fundador', en: 'Direct line to founding team' }
			],
			cta: 'Aplicar Ahora',
			cta_en: 'Apply Now',
			accent: false
		}
	];

	function handleCTA(tierName: string) {
		playClick();
		hapticTap();
		// TODO: abrir Stripe checkout o modal de lista de espera
	}
</script>

<svelte:head>
	<title>Precios — Querencia™</title>
	<meta name="description" content="Precios transparentes para planificación de viajes eco-luxury. Desde exploración gratuita hasta experiencias curadas de servicio completo. Pagos en pesos mexicanos." />
</svelte:head>

<div class="pricing-root">
	<header class="pricing-header">
		<a href="/" class="back-link">← Querencia™</a>
		<p class="overline">Precios Transparentes · Transparent Pricing</p>
		<h1>Invierte en Viajes que Retribuyen</h1>
		<p class="header-sub-es">Cada nivel financia reforestación y turismo comunitario. Entre más exploras, más restauramos.</p>
		<p class="header-sub-en">Every tier funds reforestation and community tourism. The more you explore, the more we restore.</p>
		<p class="currency-note">Precios en pesos mexicanos (MXN) · USD equivalents shown</p>
	</header>

	<div class="tiers-grid">
		{#each tiers as tier}
			<div class="tier-card" class:accent={tier.accent}>
				{#if tier.accent}
					<div class="tier-badge">Más Popular · Most Popular</div>
				{/if}
				<div class="tier-head">
					<h2>{tier.name}</h2>
					<p class="tier-name-en">{tier.name_en}</p>
					<div class="tier-price">
						<span class="price">{tier.price}</span>
						{#if tier.period}<span class="period">{tier.period}</span>{/if}
					</div>
					{#if tier.price_en && tier.price !== 'Gratis'}
						<p class="price-usd">≈ {tier.price_en}{tier.period_en}</p>
					{/if}
					<p class="tier-desc">{tier.description}</p>
					<p class="tier-desc-en">{tier.description_en}</p>
				</div>
				<ul class="tier-features">
					{#each tier.features as feature}
						<li>
							<span class="check">✓</span>
							<span class="feature-text">
								<span class="feat-es">{feature.es}</span>
								<span class="feat-en">{feature.en}</span>
							</span>
						</li>
					{/each}
				</ul>
				<button
					class="tier-cta"
					class:cta-accent={tier.accent}
					on:click={() => handleCTA(tier.name)}
				>
					{tier.cta}
					<span class="cta-en">{tier.cta_en}</span>
				</button>
			</div>
		{/each}
	</div>

	<section class="guarantee">
		<h3>La Garantía Querencia</h3>
		<p class="guarantee-es">Si tu primera experiencia curada no supera tus expectativas, reembolsamos tu suscripción y donamos tu cuota a programas de reforestación. Sin preguntas. Sin fricciones.</p>
		<p class="guarantee-en">If your first curated experience doesn't exceed expectations, we'll refund your subscription and donate your fee to reforestation. No questions. No friction.</p>
	</section>

	<section class="value-stack">
		<h3>Lo Que Realmente Obtienes</h3>
		<div class="stack-grid">
			<div class="stack-item">
				<span class="stack-value">$42,000+</span>
				<span class="stack-label-es">Ahorro anual en MXN vs. reservar por separado</span>
				<span class="stack-label-en">Annual savings (MXN) vs. booking separately</span>
			</div>
			<div class="stack-item">
				<span class="stack-value">40+ hrs</span>
				<span class="stack-label-es">Tiempo de planificación ahorrado por viaje con IA + verificación local</span>
				<span class="stack-label-en">Planning time saved per trip with AI + local verification</span>
			</div>
			<div class="stack-item">
				<span class="stack-value">100%</span>
				<span class="stack-label-es">De las experiencias verificadas por socios comunitarios locales</span>
				<span class="stack-label-en">Of recommended experiences vetted by local community partners</span>
			</div>
			<div class="stack-item">
				<span class="stack-value">5%</span>
				<span class="stack-label-es">De los ingresos destinados a reforestación e infraestructura comunitaria</span>
				<span class="stack-label-en">Of revenue directed to reforestation & community infrastructure</span>
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

	.header-sub-es {
		font-size: 1rem;
		color: rgba(232, 226, 212, 0.75);
		max-width: 34rem;
		margin: 0 auto 0.35rem;
		line-height: 1.6;
	}

	.header-sub-en {
		font-size: 0.82rem;
		color: rgba(232, 226, 212, 0.35);
		max-width: 32rem;
		margin: 0 auto 0.75rem;
		line-height: 1.5;
		font-style: italic;
	}

	.currency-note {
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(90, 122, 82, 0.7);
		margin: 0.5rem 0 0;
	}

	/* keep old header-sub for compat */
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

	.tier-card.acc4rem;
		font-weight: 700;
		margin: 0 0 0.15rem;
		color: #e8e2d4;
	}

	.tier-name-en {
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(232, 226, 212, 0.3);
		margin: 0 0 0.6rem;
	}

	.price-usd {
		font-size: 0.72rem;
		color: rgba(232, 226, 212, 0.3);
		margin: 0 0 0.35rem;
	}

	.tier-desc {
		font-size: 0.88rem;
		color: rgba(232, 226, 212, 0.6);
		line-height: 1.5;
		margin: 0 0 0.15rem;
	}

	.tier-desc-en {
		font-size: 0.74rem;
		color: rgba(232, 226, 212, 0.28);
		line-height: 1.4;
		font-style: italicrem;
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

	.

	.feature-text {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
	}

	.feat-es {
		color: rgba(232, 226, 212, 0.7);
	}

	.feat-en {
		font-size: 0.72rem;
		color: rgba(232, 226, 212, 0.28);
		font-style: italic;
	}period {
		font-size: 0.8rem;
		color: rgba(232, 226, 212, 0.4);
	}

	.tier-desc {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
	}

	.cta-en {
		font-size: 0.65rem;
		font-weight: 400;
		letter-spacing: 0.04em;
		opacity: 0.45;
		text-transform: none;
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
		tier-price {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
		margin-bottom: 0.35rem;
	}

	.guarantee-es {
		font-size: 0.92rem;
		line-height: 1.7;
		color: rgba(232, 226, 212, 0.65);
		margin: 0 0 0.4rem;
	}

	.guarantee-en {
		font-size: 0.8rem;
		line-height: 1.6;
		color: rgba(232, 226, 212, 0.3);
		font-style: italic;
		color: #c4963c;
	}

	.period {
		font-size: 0.8rem;
		color: rgba(232, 226, 212, 0.4);
	}

	.gap: 0.6rem;
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
		font-weight-es {
		font-size: 0.78rem;
		line-height: 1.5;
		color: rgba(232, 226, 212, 0.55);
	}

	.stack-label-en {
		font-size: 0.7rem;
		line-height: 1.4;
		color: rgba(232, 226, 212, 0.25);
		font-style: italic
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
