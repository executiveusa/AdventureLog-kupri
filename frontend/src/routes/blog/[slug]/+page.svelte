<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';

	interface BodyBlock {
		type: 'paragraph' | 'heading';
		text: string;
	}

	interface BlogPost {
		slug: string;
		title: string;
		excerpt: string;
		author: string;
		date: string;
		readTime: number;
		tags: string[];
		heroImage: string;
		body: BodyBlock[];
	}

	let post: BlogPost | null = null;
	let loading = true;
	let notFound = false;

	$: slug = $page.params.slug;

	onMount(async () => {
		try {
			const res = await fetch('/blog/posts.json');
			if (!res.ok) throw new Error();
			const posts: BlogPost[] = await res.json();
			post = posts.find(p => p.slug === slug) ?? null;
			if (!post) notFound = true;
		} catch {
			notFound = true;
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
	{#if post}
		<title>{post.title} — Querencia™</title>
		<meta name="description" content={post.excerpt} />
		<meta property="og:title" content={post.title} />
		<meta property="og:description" content={post.excerpt} />
		<meta property="og:image" content={post.heroImage} />
		<meta property="og:type" content="article" />
	{:else}
		<title>Article Not Found — Querencia™</title>
	{/if}
</svelte:head>

<div class="article-root">
	{#if loading}
		<div class="loading-state">
			<div class="loading-pulse"></div>
			<p>Loading article...</p>
		</div>
	{:else if notFound || !post}
		<div class="not-found">
			<h1>Article Not Found</h1>
			<p>This article doesn't exist or has been moved.</p>
			<a href="/blog">← Back to The Journal</a>
		</div>
	{:else}
		<article>
			<div class="hero" style="background-image: url({post.heroImage})">
				<div class="hero-overlay">
					<a href="/blog" class="back-link">← The Journal</a>
				</div>
			</div>

			<div class="article-body">
				<div class="article-meta">
					<span>{formatDate(post.date)}</span>
					<span>{post.readTime} min de lectura</span>
					<span>{post.author}</span>
				</div>

				<h1>{post.title_es || post.title}</h1>
				{#if post.title_es}
					<p class="title-en-sub">{post.title}</p>
				{/if}

				<div class="article-tags">
					{#each post.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>

				<div class="prose">
					{#each (post.body_es || post.body) as block}
						{#if block.type === 'heading'}
							<h2>{block.text}</h2>
						{:else}
							<p>{block.text}</p>
						{/if}
					{/each}
				</div>

				<div class="article-cta">
					<p>¿Listo para viajar con intención?</p>
					<a href="/pricing" class="cta-link">Ver Nuestros Planes →</a>
				</div>
			</div>
		</article>
	{/if}

	<Footer />
</div>

<style>
	.article-root {
		min-height: 100dvh;
		background: #0c0d0a;
		color: #e8e2d4;
		font-family: 'Lato', 'DM Sans', system-ui, sans-serif;
	}

	.hero {
		width: 100%;
		height: 50vh;
		min-height: 300px;
		max-height: 500px;
		background-size: cover;
		background-position: center;
		position: relative;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgba(12, 13, 10, 0.6) 0%, rgba(12, 13, 10, 0.9) 100%);
		display: flex;
		align-items: flex-start;
		padding: 2rem;
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

	.article-body {
		max-width: 42rem;
		margin: -4rem auto 0;
		position: relative;
		padding: 0 1.5rem 4rem;
	}

	.article-meta {
		display: flex;
		gap: 1.25rem;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(232, 226, 212, 0.4);
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
	}

	.article-body h1 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 700;
		line-height: 1.15;
		margin: 0 0 0.35rem;
		color: #e8e2d4;
	}

	.title-en-sub {
		font-size: 0.85rem;
		color: rgba(232, 226, 212, 0.28);
		font-style: italic;
		margin: 0 0 1rem;
		line-height: 1.4;
	}

	.article-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 2.5rem;
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

	.prose h2 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.4rem;
		font-weight: 700;
		margin: 2.5rem 0 1rem;
		color: #c4963c;
	}

	.prose p {
		font-size: 1rem;
		line-height: 1.8;
		color: rgba(232, 226, 212, 0.7);
		margin: 0 0 1.25rem;
	}

	.article-cta {
		margin-top: 3rem;
		padding: 2rem;
		border: 1px solid rgba(196, 150, 60, 0.2);
		border-radius: 4px;
		text-align: center;
	}

	.article-cta p {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.15rem;
		color: rgba(232, 226, 212, 0.6);
		margin: 0 0 1rem;
	}

	.cta-link {
		font-size: 0.85rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #c4963c;
		text-decoration: none;
		transition: opacity 0.2s;
	}

	.cta-link:hover { opacity: 0.7; }

	.loading-state, .not-found {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		text-align: center;
		color: rgba(232, 226, 212, 0.4);
	}

	.loading-pulse {
		width: 32px;
		height: 32px;
		border: 2px solid rgba(196, 150, 60, 0.2);
		border-top-color: #c4963c;
		border-radius: 50%;
		margin-bottom: 1rem;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.not-found h1 {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 2rem;
		color: #e8e2d4;
		margin-bottom: 0.5rem;
	}

	.not-found a {
		margin-top: 1.5rem;
		color: #c4963c;
		text-decoration: none;
		font-size: 0.85rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
</style>
