<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pin } from '$lib/types.js';
	import GlobeViewer from '$lib/components/globe/GlobeViewer.svelte';
	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';

	export let data;

	const pins: Pin[] = data.props.pins ?? [];

	let addModalOpen = false;
	let pendingLat: number | null = null;
	let pendingLon: number | null = null;

	function onPlaceSelected(e: CustomEvent<{ lat: number; lon: number }>) {
		pendingLat = e.detail.lat;
		pendingLon = e.detail.lon;
		addModalOpen = true;
	}

	function handleAddLocation() {
		if (pendingLat !== null && pendingLon !== null) {
			goto(
				`/locations/new?lat=${pendingLat.toFixed(5)}&lon=${pendingLon.toFixed(5)}`
			);
		}
		addModalOpen = false;
	}
</script>

<svelte:head>
	<title>Adventure Globe | AdventureLog</title>
</svelte:head>

<div class="globe-page">
	<GlobeViewer {pins} on:placeSelected={onPlaceSelected} />
</div>

<!-- Add-location modal -->
{#if addModalOpen && pendingLat !== null && pendingLon !== null}
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		aria-label="Add adventure location"
		on:click|self={() => (addModalOpen = false)}
		on:keydown={(e) => e.key === 'Escape' && (addModalOpen = false)}
	>
		<div class="modal-card">
			<h2>Add Adventure Here?</h2>
			<p class="coords">
				📍 {pendingLat.toFixed(4)}° N, {pendingLon.toFixed(4)}° E
			</p>
			<p class="hint">Create a new location at these coordinates.</p>
			<div class="modal-actions">
				<button class="btn-primary" on:click={handleAddLocation}>Add Location</button>
				<button class="btn-ghost" on:click={() => (addModalOpen = false)}>Cancel</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.globe-page {
		position: fixed;
		inset: 0;
		background: #000;
		overflow: hidden;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9000;
	}

	.modal-card {
		background: rgb(12, 16, 28);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 32px;
		max-width: 360px;
		width: 90%;
		color: #e0e6f0;
		font-family: 'Inter', sans-serif;
		text-align: center;
	}

	.modal-card h2 {
		font-size: 20px;
		font-weight: 600;
		margin: 0 0 12px;
	}

	.coords {
		font-size: 13px;
		color: rgba(200, 210, 230, 0.6);
		margin: 0 0 8px;
		font-family: 'DM Mono', monospace;
	}

	.hint {
		font-size: 13px;
		color: rgba(200, 210, 230, 0.5);
		margin: 0 0 24px;
	}

	.modal-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.btn-primary {
		background: rgba(80, 200, 120, 0.85);
		color: #080c18;
		font-weight: 600;
		border: none;
		border-radius: 8px;
		padding: 10px 24px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.2s;
	}

	.btn-primary:hover {
		background: rgba(80, 200, 120, 1);
	}

	.btn-ghost {
		background: transparent;
		color: rgba(200, 210, 230, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 10px 24px;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.2s;
	}

	.btn-ghost:hover {
		color: rgba(200, 210, 230, 0.9);
		border-color: rgba(255, 255, 255, 0.25);
	}
</style>
