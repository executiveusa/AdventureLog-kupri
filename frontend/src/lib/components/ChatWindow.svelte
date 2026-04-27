<script lang="ts">
	import { playClick } from '$lib/utils/sound';
	import { hapticTap } from '$lib/utils/haptic';

	let open = false;

	function toggle() {
		open = !open;
		playClick();
		hapticTap();
	}
</script>

<!-- Floating chat button -->
<button class="chat-fab" on:click={toggle} aria-label={open ? 'Cerrar chat' : 'Abrir agente Hermes'}>
	{#if open}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
		</svg>
	{:else}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H7l-4 3V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
		</svg>
	{/if}
</button>

<!-- Chat panel -->
{#if open}
	<div class="chat-panel" role="dialog" aria-label="Hermes Agent Chat">
		<div class="chat-header">
			<div class="chat-title">
				<span class="agent-dot"></span>
				<span>Hermes</span>
			</div>
			<span class="chat-status">Próximamente</span>
		</div>
		<div class="chat-body">
			<div class="chat-placeholder">
				<p class="placeholder-icon">🦅</p>
				<p class="placeholder-heading">Agente Hermes</p>
				<p class="placeholder-text">Tu conserje de viajes con IA se está entrenando en ecoturismo latinoamericano. Pronto podrás planificar viajes, hacer preguntas y obtener información local en tiempo real — directamente aquí.</p>
				<p class="placeholder-text-en">Your AI travel concierge is being trained on Latin American eco-tourism. Soon you’ll plan trips, ask questions, and get real-time local insights — right here.</p>
				<p class="placeholder-sub">Powered by Kupuri Media™</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.chat-fab {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 1000;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 1px solid rgba(196, 150, 60, 0.3);
		background: #0c0d0a;
		color: #c4963c;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
		transition: transform 0.2s, border-color 0.2s;
	}

	.chat-fab:hover {
		transform: scale(1.06);
		border-color: #c4963c;
	}

	.chat-panel {
		position: fixed;
		bottom: 5rem;
		right: 1.5rem;
		z-index: 999;
		width: 320px;
		max-width: calc(100vw - 3rem);
		border: 1px solid rgba(196, 150, 60, 0.2);
		border-radius: 6px;
		background: #0c0d0a;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		overflow: hidden;
		font-family: 'Lato', 'DM Sans', system-ui, sans-serif;
		animation: slideUp 0.25s ease;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid rgba(196, 150, 60, 0.1);
	}

	.chat-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: #e8e2d4;
	}

	.agent-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #5a7a52;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.chat-status {
		font-size: 0.65rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(196, 150, 60, 0.6);
	}

	.chat-body {
		padding: 2rem 1.25rem;
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat-placeholder {
		text-align: center;
	}

	.placeholder-icon {
		font-size: 2rem;
		margin: 0 0 0.75rem;
	}

	.placeholder-heading {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.1rem;
		font-weight: 700;
		color: #c4963c;
		margin: 0 0 0.5rem;
	}

	.placeholder-text {
		font-size: 0.8rem;
		line-height: 1.6;
		color: rgba(232, 226, 212, 0.55);
		margin: 0 0 0.5rem;
	}

	.placeholder-text-en {
		font-size: 0.72rem;
		line-height: 1.5;
		color: rgba(232, 226, 212, 0.25);
		font-style: italic;
		margin: 0 0 1rem;
	}

	.placeholder-sub {
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(232, 226, 212, 0.25);
		margin: 0;
	}
</style>
