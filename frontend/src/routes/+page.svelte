<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';

	import MapIcon from '~icons/mdi/map-outline';
	import CameraIcon from '~icons/mdi/camera-outline';
	import CalendarIcon from '~icons/mdi/calendar-outline';
	import TrophyIcon from '~icons/mdi/trophy-outline';
	import ChevronRight from '~icons/mdi/chevron-right';
	import GlobeIcon from '~icons/mdi/earth';
	import LightningIcon from '~icons/mdi/lightning-bolt';

	export let data;

	let currentImageIndex = 0;
	let isVisible = false;

	// Beautiful travel destination images from Unsplash
	const heroImages = [
		'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80', // Beach sunset
		'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountain landscape
		'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&q=80', // Northern lights
		'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80', // City skyline
		'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80' // Desert landscape
	];

	onMount(() => {
		setTimeout(() => (isVisible = true), 100);

		// Auto-rotate images every 5 seconds
		const interval = setInterval(() => {
			currentImageIndex = (currentImageIndex + 1) % heroImages.length;
		}, 5000);

		return () => clearInterval(interval);
	});

	const features = [
		{
			icon: MapIcon,
			title: $t('home.feature_1'),
			description: $t('home.feature_1_desc'),
			color: 'text-sky-500',
			bgColor: 'bg-sky-50 dark:bg-sky-900/20'
		},
		{
			icon: CameraIcon,
			title: $t('home.feature_2'),
			description: $t('home.feature_2_desc'),
			color: 'text-emerald-500',
			bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
		},
		{
			icon: TrophyIcon,
			title: $t('home.feature_3'),
			description: $t('home.feature_3_desc'),
			color: 'text-amber-500',
			bgColor: 'bg-amber-50 dark:bg-amber-900/20'
		}
	];
</script>

<svelte:head>
	<title>AdventureLog - {$t('home.tagline')}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Work+Sans:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Full Page Hero Section -->
<section class="relative w-full h-screen overflow-hidden">
	<!-- Rotating Background Images with Parallax -->
	<div class="absolute inset-0">
		{#each heroImages as image, index}
			<div
				class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
				style="background-image: url('{image}'); opacity: {index === currentImageIndex
					? 1
					: 0}; transform: scale({index === currentImageIndex ? 1 : 1.1});"
			></div>
		{/each}

		<!-- Gradient Overlay -->
		<div
			class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"
		></div>

		<!-- Mesh Gradient Aurora Effect -->
		<div
			class="absolute inset-0 opacity-30 mix-blend-screen"
			style="background: conic-gradient(from 180deg at 50% 50%, rgba(14, 165, 233, 0.3) 0deg, rgba(249, 115, 22, 0.3) 120deg, rgba(14, 165, 233, 0.3) 240deg, rgba(249, 115, 22, 0.3) 360deg); animation: rotate 20s linear infinite;"
		></div>
	</div>

	<!-- Hero Content -->
	<div class="relative z-10 h-full flex items-center justify-center px-6">
		<div class="max-w-6xl mx-auto text-center space-y-8">
			<!-- Badge -->
			<div
				class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full {isVisible
					? 'animate-fade-in-down'
					: 'opacity-0'}"
			>
				<LightningIcon class="w-5 h-5 text-orange-400" />
				<span class="text-white font-medium">{$t('home.start_your_journey')}</span>
			</div>

			<!-- Main Headline -->
			<h1
				class="text-6xl md:text-7xl lg:text-8xl font-black leading-tight {isVisible
					? 'animate-fade-in-up'
					: 'opacity-0'}"
				style="font-family: 'Outfit', sans-serif; animation-delay: 0.1s;"
			>
				<span class="block text-white mb-4">{$t('home.hero_1')}</span>
				<span
					class="block bg-gradient-to-r from-sky-400 via-blue-500 to-orange-400 bg-clip-text text-transparent"
				>
					{$t('home.hero_highlight')}
				</span>
			</h1>

			<!-- Subheadline -->
			<p
				class="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed {isVisible
					? 'animate-fade-in-up'
					: 'opacity-0'}"
				style="font-family: 'Work Sans', sans-serif; animation-delay: 0.2s;"
			>
				{$t('home.hero_2')}
			</p>

			<!-- CTA Buttons -->
			<div
				class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 {isVisible
					? 'animate-fade-in-up'
					: 'opacity-0'}"
				style="animation-delay: 0.3s;"
			>
				<button
					on:click={() => goto('/signup')}
					class="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
					style="font-family: 'Outfit', sans-serif;"
				>
					{$t('home.get_started')}
					<ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
				</button>

				<button
					on:click={() => goto('/login')}
					class="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all duration-300 hover:scale-105"
					style="font-family: 'Outfit', sans-serif;"
				>
					{$t('home.login')}
				</button>
			</div>

			<!-- Scroll Indicator -->
			<div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
				<svg
					class="w-6 h-6 text-white/60"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 14l-7 7m0 0l-7-7m7 7V3"
					/>
				</svg>
			</div>
		</div>
	</div>

	<!-- Image Pagination Dots -->
	<div class="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
		{#each heroImages as _, index}
			<button
				on:click={() => (currentImageIndex = index)}
				class="w-2 h-2 rounded-full transition-all duration-300 {index === currentImageIndex
					? 'bg-white w-8'
					: 'bg-white/50 hover:bg-white/70'}"
				aria-label="Image {index + 1}"
			/>
		{/each}
	</div>
</section>

<!-- Features Section -->
<section class="py-24 bg-gradient-to-br from-slate-50 via-white to-sky-50">
	<div class="container mx-auto px-6">
		<div class="max-w-3xl mx-auto text-center mb-16">
			<h2
				class="text-4xl md:text-5xl font-bold mb-6"
				style="font-family: 'Outfit', sans-serif;"
			>
				{$t('home.features_title')}
			</h2>
			<p class="text-xl text-slate-600" style="font-family: 'Work Sans', sans-serif;">
				{$t('home.features_subtitle')}
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{#each features as feature, index}
				<div
					class="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
				>
					<div class="mb-6 {feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
						<svelte:component this={feature.icon} class="w-8 h-8 {feature.color}" />
					</div>
					<h3 class="text-2xl font-bold mb-4" style="font-family: 'Outfit', sans-serif;">
						{feature.title}
					</h3>
					<p class="text-slate-600 leading-relaxed" style="font-family: 'Work Sans', sans-serif;">
						{feature.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-24 bg-gradient-to-r from-sky-500 to-orange-500 relative overflow-hidden">
	<!-- Decorative Elements -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
		<div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
	</div>

	<div class="container mx-auto px-6 relative z-10">
		<div class="max-w-4xl mx-auto text-center text-white space-y-8">
			<h2 class="text-4xl md:text-6xl font-bold" style="font-family: 'Outfit', sans-serif;">
				{$t('home.cta_title')}
			</h2>
			<p class="text-xl md:text-2xl text-white/90" style="font-family: 'Work Sans', sans-serif;">
				{$t('home.cta_subtitle')}
			</p>
			<button
				on:click={() => goto('/signup')}
				class="group px-10 py-5 bg-white text-sky-600 hover:text-sky-700 font-bold rounded-xl shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
				style="font-family: 'Outfit', sans-serif; font-size: 1.125rem;"
			>
				{$t('home.start_free')}
				<ChevronRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
			</button>
		</div>
	</div>
</section>

<style>
	:global(body) {
		font-family: 'Work Sans', sans-serif;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fade-in-down {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out forwards;
	}

	.animate-fade-in-down {
		animation: fade-in-down 0.8s ease-out forwards;
	}
</style>
