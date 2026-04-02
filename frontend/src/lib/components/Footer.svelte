<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="querencia-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<span class="brand-mark">Querencia™</span>
			<span class="brand-sub">by Kupuri Media™</span>
		</div>

		<nav class="footer-links" aria-label="Footer navigation">
			<a href="/blog">Blog</a>
			<a href="/pricing">Pricing</a>
			<a href="/directory">Directory</a>
		</nav>

		<div class="footer-legal">
			<p>© {year} Kupuri Media™ · Built in Mexico · Sociedad de Propósito Social</p>
			<p class="footer-purpose">5% of annual profits fund reforestation & community tourism</p>
		</div>
	</div>
</footer>

<style>
	.querencia-footer {
		background: #0c0d0a;
		border-top: 1px solid rgba(196, 150, 60, 0.15);
		padding: 3rem 1.5rem 2rem;
		font-family: 'Lato', 'DM Sans', sans-serif;
		color: rgba(232, 226, 212, 0.5);
	}

	.footer-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		text-align: center;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.brand-mark {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.25rem;
		font-weight: 700;
		color: #c4963c;
		letter-spacing: 0.04em;
	}

	.brand-sub {
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(232, 226, 212, 0.35);
	}

	.footer-links {
		display: flex;
		gap: 2rem;
	}

	.footer-links a {
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(232, 226, 212, 0.45);
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer-links a:hover {
		color: #c4963c;
	}

	.footer-legal {
		font-size: 0.72rem;
		line-height: 1.6;
	}

	.footer-legal p {
		margin: 0;
	}

	.footer-purpose {
		color: rgba(90, 122, 82, 0.6);
		margin-top: 0.25rem !important;
	}
</style>
