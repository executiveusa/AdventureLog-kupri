<script lang="ts">
	import { page } from '$app/stores';
	import SurpriseRevealFlow from '$lib/surprise/SurpriseRevealFlow.svelte';

	$: slug = $page.params.slug;
</script>

<svelte:head>
	<title>Sacred Experience — Querencia™</title>
	<meta name="description" content="Discover a curated surprise experience by Querencia™" />
</svelte:head>

<SurpriseRevealFlow
	{slug}
	experienceTitle="✨ Sorpresa en Cuernavaca ✨"
	experienceSubtitle="A treasure hunt of love and discovery"
/>
