<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		window.location.href = '/birthday.html';
	});
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0; url=/birthday.html">
</svelte:head>

<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
	<div style="text-align: center;">
		<div style="font-size: 60px; margin-bottom: 20px;">🎁</div>
		<h1 style="font-size: 32px; color: #8b5cf6;">Redirecting to your birthday surprise...</h1>
		<p style="margin-top: 20px;">
			If you're not redirected, <a href="/birthday.html" style="color: #8b5cf6; font-weight: bold;">click here</a>
		</p>
	</div>
</div>
