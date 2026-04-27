<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';

	interface BlogPost {
		slug: string;
		title: string;
		excerpt: string;
		author: string;
		date: string;
		readTime: number;
		tags: string[];
		heroImage: string;
	}

	let posts: BlogPost[] = [];
	let loading = true;

	onMount(async () => {
		try {
			const res = await fetch('/blog/posts.json');
			if (!res.ok) throw new Error();
			posts = await res.json();
		} catch {
			posts = [];
		}
		loading = false;
	});

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function formatDateEn(d: string) {
		return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>El Diario — Querencia™</title>
	<meta name="description" content="Ideas sobre viaje consciente, destinos escondidos y cómo construir un turismo mejor. Por Kupuri Media™." />
</svelte:head>

<div class="blog-root">
	<header class="blog-header">
		<a href="/" class="back-link">← Querencia™</a>
		<h1>El Diario</h1>
		<p class="header-sub-es">Ideas sobre viaje consciente, destinos ocultos y la construcción de un turismo mejor.</p>
		<p class="header-sub-en">Insights on conscious travel, hidden destinations, and building a better tourism economy.</p>
	</header>

	<main class="blog-grid">
		{#if loading}
			<div class="loading-state">
				<div class="loading-pulse"></div>
				<p>Cargando artículos…</p>
			</div>
		{:else if posts.length === 0}
			<p class="empty-state">Aún no hay artículos. Vuelve pronto.</p>
		{:else}
			{#each posts as post, i}
				<a href="/blog/{post.slug}" class="post-card" class:featured={i === 0}>
					<div class="post-image" style="background-image: url({post.heroImage})"></div>
					<div class="post-content">
						<div class="post-meta">
							<span class="post-date">{formatDate(post.date)}</span>
							<span class="post-read">{post.readTime} min de lectura</span>
						</div>
						<h2>{post.title_es || post.title}</h2>
						<p class="post-title-en">{post.title}</p>
						<p class="post-excerpt">{post.excerpt_es || post.excerpt}</p>
						<div class="post-tags">
							{#each post.tags.slice(0, 3) as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				</a>
			{/each}
		{/if}
	</main>

	<Footer />
</div>

<style>
	.blog-root {
		min-height: 100dvh;
		background: #0c0d0a;
		color: #e8e2d4;
		font-family: 'Lato', 'DM Sans', system-ui, sans-serif;
	}

	.blog-header {
		max-width: 72rem;
		margin: 0 auto;
		padding: 3rem 1.5rem 2rem;
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

	.blog-header h1 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 700;
		margin: 1rem 0 0.5rem;
		line-height: 1.1;
		color: #e8e2d4;
	}

	.header-sub {
		font-size: 1rem;
		color: rgba(232, 226, 212, 0.5);
		max-width: 36rem;
		line-height: 1.6;
	}

	.blog-grid {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.post-card.featured {
			grid-column: 1 / -1;
		}
		.post-card.featured .post-image {
			height: 320px;
		}
	}

	.post-card {
		display: block;
		text-decoration: none;
		color: inherit;
		border: 1px solid rgba(196, 150, 60, 0.1);
		border-radius: 4px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.02);
		transition: border-color 0.25s, transform 0.25s;
	}

	.post-card:hover {
		border-color: rgba(196, 150, 60, 0.3);
		transform: translateY(-2px);
	}

	.post-image {
		width: 100%;
		height: 200px;
		background-size: cover;
		background-position: center;
		background-color: rgba(196, 150, 60, 0.05);
	}

	.post-content {
		padding: 1.25rem 1.5rem 1.5rem;
	}

	.post-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(232, 226, 212, 0.4);
		margin-bottom: 0.75rem;
	}

	.blog-header h1 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		font-weight: 700;
		margin: 1.5rem 0 0.75rem;
		color: #e8e2d4;
	}

	.header-sub-es {
		font-size: 1rem;
		color: rgba(232, 226, 212, 0.65);
		max-width: 46rem;
		line-height: 1.6;
		margin: 0 0 0.3rem;
	}

	.header-sub-en {
		font-size: 0.82rem;
		color: rgba(232, 226, 212, 0.28);
		font-style: italic;
		max-width: 46rem;
		line-height: 1.5;
		margin: 0;
	}

	/* keep old class for safety */
	.header-sub {
		font-size: 1rem;
		color: rgba(232, 226, 212, 0.55);
		max-width: 46rem;
		line-height: 1.6;
		margin: 0;
	}

	.post-content h2 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.3rem;
		font-weight: 700;
		margin: 0 0 0.2rem;
		line-height: 1.3;
		color: #e8e2d4;
	}

	.post-title-en {
		font-size: 0.75rem;
		color: rgba(232, 226, 212, 0.28);
		font-style: italic;
		margin: 0 0 0.6rem;
		line-height: 1.4;
	}

	.post-excerpt {
		font-size: 0.88rem;
		line-height: 1.6;
		color: rgba(232, 226, 212, 0.55);
		margin: 0 0 1rem;
	}

	.post-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 0.65rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border: 1px solid rgba(90, 122, 82, 0.3);
		border-radius: 2px;
		color: rgba(90, 122, 82, 0.8);
	}

	.loading-state {
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

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem 0;
		color: rgba(232, 226, 212, 0.4);
	}
</style>
