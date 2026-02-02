<script lang="ts">
	import LocationCard from '$lib/components/cards/LocationCard.svelte';
	import type { PageData} from './$types';
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';

	// Icons
	import FlagCheckeredVariantIcon from '~icons/mdi/flag-checkered-variant';
	import Airplane from '~icons/mdi/airplane';
	import CityVariantOutline from '~icons/mdi/city-variant-outline';
	import MapMarkerStarOutline from '~icons/mdi/map-marker-star-outline';
	import CalendarClock from '~icons/mdi/calendar-clock';
	import Plus from '~icons/mdi/plus';
	import TrendingUp from '~icons/mdi/trending-up';

	export let data: PageData;

	const user = data.user;
	const recentAdventures = data.props.adventures;
	const stats = data.props.stats;

	let isVisible = false;

	onMount(() => {
		setTimeout(() => (isVisible = true), 100);
	});

	// Calculate completion percentage
	$: completionPercentage =
		stats.visited_country_count > 0 ? Math.round((stats.visited_country_count / 195) * 100) : 0; // Assuming ~195 countries worldwide
</script>

<svelte:head>
	<title>Dashboard | AdventureLog</title>
	<meta name="description" content="Home dashboard for AdventureLog." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Work+Sans:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5 pointer-events-none">
		<div class="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-orange-500/10"></div>
	</div>

	<div class="container mx-auto px-6 py-12 relative z-10">
		<!-- Welcome Section -->
		<div
			class="welcome-section mb-16 {isVisible ? 'animate-fade-in-up' : 'opacity-0'}"
			style="font-family: 'Outfit', sans-serif;"
		>
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
				<div>
					<div class="flex items-center gap-4 mb-4">
						<div>
							<h1 class="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-3">
								{$t('dashboard.welcome_back')}, <span
									class="bg-gradient-to-r from-sky-500 to-orange-500 bg-clip-text text-transparent"
									>{user?.first_name ? `${user.first_name}` : user?.username}</span
								>!
							</h1>
							<p
								class="text-xl text-slate-600 dark:text-slate-300 mt-2"
								style="font-family: 'Work Sans', sans-serif;"
							>
								{#if stats.location_count > 0}
									{$t('dashboard.welcome_text_1')}
									<span class="font-bold text-sky-600 dark:text-sky-400"
										>{stats.location_count}</span
									>
									{$t('dashboard.welcome_text_2')}
								{:else}
									{$t('dashboard.welcome_text_3')}
								{/if}
							</p>
						</div>
					</div>
				</div>

				<!-- Quick Action -->
				<div class="flex flex-col sm:flex-row gap-3">
					<a
						href="/locations"
						class="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
						style="font-family: 'Outfit', sans-serif;"
					>
						<Plus class="w-5 h-5" />
						{$t('map.add_location')}
					</a>
					<a
						href="/worldtravel"
						class="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
						style="font-family: 'Outfit', sans-serif;"
					>
						<FlagCheckeredVariantIcon class="w-5 h-5" />
						{$t('home.explore_world')}
					</a>
				</div>
			</div>
		</div>

		<!-- Stats Grid -->
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-16 {isVisible
				? 'animate-fade-in-up'
				: 'opacity-0'}"
			style="animation-delay: 0.2s; font-family: 'Outfit', sans-serif;"
		>
			<!-- Countries Visited -->
			<div
				class="group stat-card bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700 overflow-hidden relative"
			>
				<!-- Gradient accent bar -->
				<div
					class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-500"
				></div>

				<div class="p-8">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<div class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase mb-2">
								{$t('dashboard.countries_visited')}
							</div>
							<div class="text-5xl font-black text-slate-900 dark:text-white mb-4">
								{stats.visited_country_count}
							</div>
							<div class="space-y-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-slate-600 dark:text-slate-300 font-medium"
										>{completionPercentage}% {$t('home.of_world')}</span
									>
									<TrendingUp class="w-4 h-4 text-sky-500" />
								</div>
								<div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
									<div
										class="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000"
										style="width: {completionPercentage}%"
									></div>
								</div>
							</div>
						</div>
						<div
							class="ml-4 p-5 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-2xl group-hover:scale-110 transition-transform"
						>
							<FlagCheckeredVariantIcon class="w-10 h-10 text-sky-600 dark:text-sky-400" />
						</div>
					</div>
				</div>
			</div>

			<!-- Regions Visited -->
			<div
				class="group stat-card bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700 overflow-hidden relative"
			>
				<!-- Gradient accent bar -->
				<div
					class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-500"
				></div>

				<div class="p-8">
					<div class="flex items-center justify-between">
						<div>
							<div class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase mb-2">
								{$t('dashboard.total_visited_regions')}
							</div>
							<div class="text-5xl font-black text-slate-900 dark:text-white">
								{stats.visited_region_count}
							</div>
						</div>
						<div
							class="ml-4 p-5 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl group-hover:scale-110 transition-transform"
						>
							<MapMarkerStarOutline class="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
						</div>
					</div>
				</div>
			</div>

			<!-- Cities Visited -->
			<div
				class="group stat-card bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700 overflow-hidden relative"
			>
				<!-- Gradient accent bar -->
				<div
					class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500"
				></div>

				<div class="p-8">
					<div class="flex items-center justify-between">
						<div>
							<div class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase mb-2">
								{$t('dashboard.total_visited_cities')}
							</div>
							<div class="text-5xl font-black text-slate-900 dark:text-white">
								{stats.visited_city_count}
							</div>
						</div>
						<div
							class="ml-4 p-5 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl group-hover:scale-110 transition-transform"
						>
							<CityVariantOutline class="w-10 h-10 text-orange-600 dark:text-orange-400" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Adventures Section -->
		{#if recentAdventures.length > 0}
			<div
				class="mb-8 {isVisible ? 'animate-fade-in-up' : 'opacity-0'}"
				style="animation-delay: 0.4s;"
			>
				<div class="flex items-center justify-between mb-8">
					<div class="flex items-center gap-4">
						<div class="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-2xl">
							<CalendarClock class="w-7 h-7 text-sky-600 dark:text-sky-400" />
						</div>
						<div>
							<h2 class="text-4xl font-black text-slate-900 dark:text-white" style="font-family: 'Outfit', sans-serif;">
								{$t('dashboard.recent_adventures')}
							</h2>
							<p class="text-lg text-slate-600 dark:text-slate-300 mt-1" style="font-family: 'Work Sans', sans-serif;">
								{$t('home.latest_travel_experiences')}
							</p>
						</div>
					</div>
					<a
						href="/locations"
						class="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
						style="font-family: 'Outfit', sans-serif;"
					>
						{$t('dashboard.view_all')}
						<span
							class="px-3 py-1 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full text-sm font-bold"
							>{stats.location_count}</span
						>
					</a>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{#each recentAdventures as adventure}
						<div class="adventure-card">
							<LocationCard {adventure} readOnly user={null} />
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Empty State / Inspiration -->
		{#if recentAdventures.length === 0}
			<div
				class="empty-state bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden {isVisible
					? 'animate-fade-in-up'
					: 'opacity-0'}"
				style="animation-delay: 0.4s;"
			>
				<div class="p-16 text-center">
					<div class="flex justify-center mb-8">
						<div class="p-8 bg-gradient-to-br from-sky-100 to-orange-100 dark:from-sky-900/30 dark:to-orange-900/30 rounded-3xl">
							<Airplane class="w-20 h-20 text-sky-600 dark:text-sky-400" />
						</div>
					</div>

					<h2
						class="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-sky-500 to-orange-500 bg-clip-text text-transparent"
						style="font-family: 'Outfit', sans-serif;"
					>
						{$t('dashboard.no_recent_adventures')}
					</h2>
					<p
						class="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg mx-auto leading-relaxed"
						style="font-family: 'Work Sans', sans-serif;"
					>
						{$t('dashboard.document_some_adventures')}
					</p>

					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/locations"
							class="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
							style="font-family: 'Outfit', sans-serif;"
						>
							<Plus class="w-5 h-5" />
							{$t('map.add_location')}
						</a>
						<a
							href="/worldtravel"
							class="px-8 py-4 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
							style="font-family: 'Outfit', sans-serif;"
						>
							<FlagCheckeredVariantIcon class="w-5 h-5" />
							{$t('home.explore_world')}
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
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

	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out forwards;
	}
</style>
