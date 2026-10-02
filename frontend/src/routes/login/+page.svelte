<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let isSubmitting: boolean = false;
	let isVisible = false;

	export let data;

	let socialProviders = data.props?.socialProviders ?? [];
	let socialOnly: boolean = data.props?.socialOnly ?? false;

	import FileImageBox from '~icons/mdi/file-image-box';
	import GitHub from '~icons/mdi/github';
	import OpenIdConnect from '~icons/mdi/openid';
	import LockOutline from '~icons/mdi/lock-outline';
	import AccountOutline from '~icons/mdi/account-outline';

	let isImageInfoModalOpen: boolean = false;

	function handleEnhanceSubmit() {
		isSubmitting = true;
		return async ({ update, result }: { update: any; result: any }) => {
			if (result.type === 'success') {
				await update(result);
			} else {
				isSubmitting = false;
				await update(result);
			}
		};
	}

	import ImageInfoModal from '$lib/components/ImageInfoModal.svelte';
	import type { Background } from '$lib/types.js';

	let quote: { quote: string; author: string } = data.props?.quote ?? { quote: '', author: '' };
	let background: Background = data.props?.background ?? { url: '' };

	onMount(() => {
		setTimeout(() => (isVisible = true), 100);
	});
</script>

<svelte:head>
	<title>Login | AdventureLog</title>
	<meta
		name="description"
		content="Login to your AdventureLog account to start logging your adventures!"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Work+Sans:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if isImageInfoModalOpen}
	<ImageInfoModal {background} on:close={() => (isImageInfoModalOpen = false)} />
{/if}

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
	<!-- Background image with overlay -->
	{#if background.url}
		<div class="fixed inset-0 z-0">
			<div
				class="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style="background-image: url('{background.url}')"
			></div>
			<div class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-transparent backdrop-blur-sm"></div>
		</div>
	{/if}

	<div class="main-container relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
		<div class="w-full max-w-6xl {isVisible ? 'animate-fade-in-up' : 'opacity-0'}">
			<div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
				<div class="grid lg:grid-cols-2 min-h-[700px]">
					<!-- Login Section -->
					<div class="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
						<!-- Header -->
						<div class="mb-10">
							<div class="flex items-center gap-3 mb-6">
								<div class="w-12 h-12 bg-gradient-to-br from-sky-500 to-orange-500 rounded-2xl flex items-center justify-center">
									<span class="text-white font-black text-xl" style="font-family: 'Outfit', sans-serif;">A</span>
								</div>
								<h1 class="text-2xl font-black text-slate-900 dark:text-white" style="font-family: 'Outfit', sans-serif;">
									AdventureLog
								</h1>
							</div>
							<h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2" style="font-family: 'Outfit', sans-serif;">
								{$t('auth.login')}
							</h2>
							<p class="text-lg text-slate-600 dark:text-slate-300" style="font-family: 'Work Sans', sans-serif;">
								Welcome back! Continue your adventure
							</p>
						</div>

						<!-- Form / Social Only -->
						<div class="max-w-md mx-auto w-full">
							{#if socialOnly}
								{#if socialProviders.length > 0}
									<div class="space-y-3">
										<div class="divider text-sm text-slate-500">{$t('auth.or_3rd_party')}</div>
										{#each socialProviders as provider}
											<a
												href={provider.url}
												class="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-105"
												style="font-family: 'Outfit', sans-serif;"
											>
												{#if provider.provider === 'github'}
													<GitHub class="w-5 h-5" />
												{:else if provider.provider === 'openid_connect'}
													<OpenIdConnect class="w-5 h-5" />
												{/if}
												Continue with {provider.name}
											</a>
										{/each}
									</div>
								{/if}

								<div class="flex justify-between text-sm mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
									<a href="/signup" class="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
										>{$t('auth.signup')}</a
									>
									<a
										href="/user/reset-password"
										class="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
										>{$t('auth.forgot_password')}</a
									>
								</div>
							{:else}
								<form method="post" use:enhance={handleEnhanceSubmit} class="space-y-5">
									<!-- Username -->
									<div class="form-control">
										<label class="label" for="username">
											<span class="label-text font-semibold text-slate-700 dark:text-slate-200" style="font-family: 'Outfit', sans-serif;">
												{$t('auth.username')}
											</span>
										</label>
										<div class="relative">
											<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<AccountOutline class="w-5 h-5 text-slate-400" />
											</div>
											<input
												name="username"
												id="username"
												type="text"
												class="input w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
												placeholder={$t('auth.enter_username')}
												autocomplete="username"
												style="font-family: 'Work Sans', sans-serif;"
											/>
										</div>
									</div>

									<!-- Password -->
									<div class="form-control">
										<label class="label" for="password">
											<span class="label-text font-semibold text-slate-700 dark:text-slate-200" style="font-family: 'Outfit', sans-serif;">
												{$t('auth.password')}
											</span>
										</label>
										<div class="relative">
											<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<LockOutline class="w-5 h-5 text-slate-400" />
											</div>
											<input
												type="password"
												name="password"
												id="password"
												class="input w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
												placeholder={$t('auth.enter_password')}
												autocomplete="current-password"
												style="font-family: 'Work Sans', sans-serif;"
											/>
										</div>
									</div>

									<!-- TOTP -->
									{#if $page.form?.mfa_required}
										<div class="form-control">
											<label class="label" for="totp">
												<span class="label-text font-semibold text-slate-700 dark:text-slate-200" style="font-family: 'Outfit', sans-serif;">
													{$t('auth.totp')}
												</span>
											</label>
											<input
												type="text"
												name="totp"
												id="totp"
												inputmode="numeric"
												pattern="[0-9]*"
												autocomplete="one-time-code"
												class="input w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all text-center text-2xl tracking-widest"
												placeholder="000000"
												maxlength="6"
												style="font-family: 'Outfit', sans-serif;"
											/>
										</div>
									{/if}

									<!-- Submit Button -->
									<div class="form-control mt-8">
										<button
											type="submit"
											class="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
											disabled={isSubmitting}
											style="font-family: 'Outfit', sans-serif;"
										>
											{#if isSubmitting}
												<span class="loading loading-spinner loading-sm"></span>
												<span class="ml-2">{$t('auth.logging_in')}...</span>
											{:else}
												{$t('auth.login')}
											{/if}
										</button>
									</div>

									<!-- Error Message -->
									{#if ($page.form?.message && $page.form?.message.length > 1) || $page.form?.type === 'error'}
										<div class="alert bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mt-4">
											<span class="text-red-700 dark:text-red-300 font-medium" style="font-family: 'Work Sans', sans-serif;">
												{$t($page.form.message) || $t('auth.login_error')}
											</span>
										</div>
									{/if}

									<!-- Social Login -->
									{#if socialProviders.length > 0}
										<div class="divider text-sm text-slate-500 my-6">{$t('auth.or_3rd_party')}</div>

										<div class="space-y-3">
											{#each socialProviders as provider}
												<a
													href={provider.url}
													class="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-105"
													style="font-family: 'Outfit', sans-serif;"
												>
													{#if provider.provider === 'github'}
														<GitHub class="w-5 h-5" />
													{:else if provider.provider === 'openid_connect'}
														<OpenIdConnect class="w-5 h-5" />
													{/if}
													Continue with {provider.name}
												</a>
											{/each}
										</div>
									{/if}

									<!-- Footer Links -->
									<div class="flex justify-between text-sm mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
										<a
											href="/signup"
											class="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
											style="font-family: 'Work Sans', sans-serif;"
											>{$t('auth.signup')}</a
										>
										<a
											href="/user/reset-password"
											class="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
											style="font-family: 'Work Sans', sans-serif;"
											>{$t('auth.forgot_password')}</a
										>
									</div>
								</form>
							{/if}
						</div>
					</div>

					<!-- Quote/Info Section -->
					<div class="hidden lg:flex bg-gradient-to-br from-sky-500 to-orange-500 p-12 items-center justify-center relative overflow-hidden">
						<!-- Decorative elements -->
						<div class="absolute inset-0 opacity-10">
							<div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
							<div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
						</div>

						<div class="text-center max-w-md relative z-10">
							{#if quote && quote.quote}
								<div class="space-y-6">
									<div class="text-8xl text-white/20 mb-4" style="font-family: 'Outfit', sans-serif;">"</div>
									<blockquote class="text-2xl font-medium text-white leading-relaxed" style="font-family: 'Work Sans', sans-serif;">
										{quote.quote}
									</blockquote>
									<footer class="text-white/80 font-semibold text-lg" style="font-family: 'Outfit', sans-serif;">
										— {quote.author}
									</footer>
								</div>
							{:else}
								<div class="space-y-6">
									<div class="text-8xl text-white/20 mb-4" style="font-family: 'Outfit', sans-serif;">"</div>
									<blockquote class="text-2xl font-medium text-white leading-relaxed" style="font-family: 'Work Sans', sans-serif;">
										Every adventure begins with a single step. Start documenting your journey today.
									</blockquote>
									<footer class="text-white/80 font-semibold text-lg" style="font-family: 'Outfit', sans-serif;">
										— AdventureLog
									</footer>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Sign up prompt -->
			<div class="text-center mt-6">
				<p class="text-slate-600 dark:text-slate-300" style="font-family: 'Work Sans', sans-serif;">
					Don't have an account?
					<a href="/signup" class="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-bold transition-colors">
						Sign up now
					</a>
				</p>
			</div>
		</div>
	</div>

	<!-- Image Info Button -->
	{#if background.url}
		<button
			class="btn btn-circle btn-sm fixed bottom-6 right-6 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 z-20 shadow-xl"
			on:click={() => (isImageInfoModalOpen = true)}
		>
			<FileImageBox class="w-4 h-4" />
		</button>
	{/if}
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

	input.input {
		font-size: 1rem;
	}

	input.input:focus {
		outline: none;
	}
</style>
