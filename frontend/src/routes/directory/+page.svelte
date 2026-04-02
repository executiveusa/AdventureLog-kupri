<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';

	interface Listing {
		id: string;
		name: string;
		location: string;
		region: string;
		type: string;
		description: string;
		ecoRating: number;
		priceRange: string;
		communityLed: boolean;
		image: string;
		tags: string[];
	}

	let listings: Listing[] = [];
	let filtered: Listing[] = [];
	let loading = true;
	let activeRegion = 'All';
	let searchQuery = '';

	$: {
		let result = listings;
		if (activeRegion !== 'All') {
			result = result.filter(l => l.region === activeRegion);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(l =>
				l.name.toLowerCase().includes(q) ||
				l.type.toLowerCase().includes(q) ||
				l.tags.some(t => t.includes(q))
			);
		}
		filtered = result;
	}

	$: regions = ['All', ...new Set(listings.map(l => l.region))];

	onMount(async () => {
		try {
			const res = await fetch('/directory/listings.json');
			if (!res.ok) throw new Error();
			listings = await res.json();
		} catch {
			listings = [];
		}
		loading = false;
	});
</script>

<svelte:head>
	<title>Directorio Ecoturístico — Querencia™</title>
	<meta name="description" content="Descubre experiencias ecoturísticas verificadas en toda Latinoamérica. Dirigidas por comunidades, primero la conservación." />
</svelte:head>

<div class="directory-root">
	<header class="dir-header">
		<a href="/" class="back-link">← Querencia™</a>
		<p class="overline">Directorio Ecoturístico · Eco-Tourism Directory</p>
		<h1>Lugares Que Retribuyen</h1>
		<p class="header-sub-es">Cada listado verificado por impacto ecológico, beneficio comunitario y autenticidad cultural.</p>
		<p class="header-sub-en">Every listing vetted for ecological impact, community benefit, and cultural authenticity.</p>
	</header>

	<div class="controls">
		<div class="region-tabs">
			{#each regions as region}
				<button
					class="tab"
					class:active={activeRegion === region}
					on:click={() => activeRegion = region}
				>
					{region}
				</button>
			{/each}
		</div>
		<input
			type="text"
			class="search-input"
			placeholder="Buscar destinos… · Search destinations"
			bind:value={searchQuery}
		/>
	</div>

	<main class="listings-grid">
		{#if loading}
			<div class="loading-state">
				<div class="loading-pulse"></div>
				<p>Cargando directorio…</p>
			</div>
		{:else if filtered.length === 0}
			<p class="empty-state">Ningún resultado coincide con tu búsqueda. Prueba otro filtro. · No listings match your search.</p>
		{:else}
			{#each filtered as listing}
				<div class="listing-card">
					<div class="listing-image" style="background-image: url({listing.image})">
						{#if listing.communityLed}
							<span class="community-badge">Comunidad Local · Community-Led</span>
						{/if}
					</div>
					<div class="listing-body">
						<div class="listing-top">
							<span class="listing-type">{listing.type_es || listing.type}</span>
							<span class="listing-price">{listing.priceRange}</span>
						</div>
						<h3>{listing.name_es || listing.name}</h3>
						<p class="listing-name-en">{listing.name_es ? listing.name : ''}</p>
						<p class="listing-location">{listing.location}</p>
						<p class="listing-desc">{listing.description_es || listing.description}</p>
						<div class="listing-bottom">
							<div class="eco-rating" title="Valoración eco: {listing.ecoRating}/5">
								{#each Array(5) as _, i}
									<span class="eco-dot" class:filled={i < listing.ecoRating}></span>
								{/each}
							</div>
							<div class="listing-tags">
								{#each listing.tags.slice(0, 3) as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</main>

	<Footer />
</div>

<style>
	.directory-root {
		min-height: 100dvh;
		background: #0c0d0a;
		color: #e8e2d4;
		font-family: 'Lato', 'DM Sans', system-ui, sans-serif;
	}

	.dir-header {
		max-width: 72rem;
		margin: 0 auto;
		padding: 3rem 1.5rem 1rem;
	}

	.back-link {
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		color: #c4963c;
		text-decoration: none;
		text-transform: uppercase;
	}

	.back-link:hover { opacity: 0.7; }

	.overline {
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(90, 122, 82, 0.8);
		margin: 2rem 0 0.75rem;
	}

	.dir-header h1 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 700;
		margin: 0 0 0.5rem;
		line-height: 1.1;
	}

	.header-sub-es {
		font-size: 1rem;
		color: rgba(232, 226, 212, 0.65);
		max-width: 36rem;
		line-height: 1.6;
		margin: 0 0 0.25rem;
	}

	.header-sub-en {
		font-size: 0.8rem;
		color: rgba(232, 226, 212, 0.28);
		font-style: italic;
		max-width: 36rem;
		line-height: 1.5;
		margin: 0;
	}

	/* keep old class for compat */
	.header-sub {
		font-size: 1rem;
		color: rgba(232, 226, 212, 0.5);
		max-width: 36rem;
		line-height: 1.6;
	}

	.listing-name-en {
		font-size: 0.7rem;
		color: rgba(232, 226, 212, 0.25);
		font-style: italic;
		margin: 0 0 0.2rem;
	}

	.controls {
		max-width: 72rem;
		margin: 1.5rem auto;
		padding: 0 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}

	.region-tabs {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	.tab {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.4rem 0.85rem;
		border: 1px solid rgba(196, 150, 60, 0.15);
		border-radius: 2px;
		background: transparent;
		color: rgba(232, 226, 212, 0.5);
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}

	.tab:hover { border-color: rgba(196, 150, 60, 0.3); }

	.tab.active {
		background: rgba(196, 150, 60, 0.1);
		border-color: #c4963c;
		color: #c4963c;
	}

	.search-input {
		flex: 1;
		min-width: 200px;
		padding: 0.5rem 0.85rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(196, 150, 60, 0.12);
		border-radius: 3px;
		color: #e8e2d4;
		font-size: 0.85rem;
		font-family: inherit;
		outline: none;
		transition: border-color 0.2s;
	}

	.search-input::placeholder { color: rgba(232, 226, 212, 0.3); }
	.search-input:focus { border-color: rgba(196, 150, 60, 0.4); }

	.listings-grid {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.listings-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 1024px) {
		.listings-grid { grid-template-columns: repeat(3, 1fr); }
	}

	.listing-card {
		border: 1px solid rgba(196, 150, 60, 0.08);
		border-radius: 4px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.02);
		transition: border-color 0.25s, transform 0.25s;
	}

	.listing-card:hover {
		border-color: rgba(196, 150, 60, 0.25);
		transform: translateY(-2px);
	}

	.listing-image {
		height: 180px;
		background-size: cover;
		background-position: center;
		position: relative;
	}

	.community-badge {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: rgba(90, 122, 82, 0.9);
		color: #fff;
		padding: 0.2rem 0.5rem;
		border-radius: 2px;
		font-weight: 600;
	}

	.listing-body {
		padding: 1.25rem;
	}

	.listing-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.listing-type {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #c4963c;
	}

	.listing-price {
		font-size: 0.75rem;
		color: rgba(232, 226, 212, 0.4);
	}

	.listing-body h3 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.15rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: #e8e2d4;
		line-height: 1.3;
	}

	.listing-location {
		font-size: 0.78rem;
		color: rgba(232, 226, 212, 0.4);
		margin: 0 0 0.5rem;
	}

	.listing-desc {
		font-size: 0.82rem;
		line-height: 1.55;
		color: rgba(232, 226, 212, 0.55);
		margin: 0 0 1rem;
	}

	.listing-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.eco-rating {
		display: flex;
		gap: 3px;
	}

	.eco-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(90, 122, 82, 0.2);
	}

	.eco-dot.filled {
		background: #5a7a52;
	}

	.listing-tags {
		display: flex;
		gap: 0.35rem;
	}

	.tag {
		font-size: 0.6rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.15rem 0.45rem;
		border: 1px solid rgba(90, 122, 82, 0.25);
		border-radius: 2px;
		color: rgba(90, 122, 82, 0.7);
	}

	.loading-state, .empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem 0;
		color: rgba(232, 226, 212, 0.4);
	}

	.loading-pulse {
		width: 32px;
		height: 32px;
		border: 2px solid rgba(196, 150, 60, 0.2);
		border-top-color: #c4963c;
		border-radius: 50%;
		margin: 0 auto 1rem;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }
</style>
