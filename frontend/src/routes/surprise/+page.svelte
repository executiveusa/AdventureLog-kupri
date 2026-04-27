<script lang="ts">
	import { goto } from '$app/navigation';

	let name = '';

	function openSurprise() {
		if (name.trim()) {
			goto(`/surprise/yvette-cuernavaca?for=${encodeURIComponent(name.trim())}`);
		} else {
			goto('/surprise/yvette-cuernavaca');
		}
	}
</script>

<svelte:head>
	<title>You're Invited!</title>
	<meta name="description" content="A special surprise awaits you in Cuernavaca" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
	<div class="max-w-2xl w-full">
		<div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-6">
			<!-- Decorative elements -->
			<div class="text-6xl mb-4">🎁</div>

			<!-- Main heading -->
			<h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
				You're Invited!
			</h1>

			<!-- Subheading -->
			<p class="text-xl md:text-2xl text-gray-700 font-medium">
				A Special Birthday Surprise
			</p>

			<!-- Description -->
			<div class="space-y-3 text-gray-600 text-lg max-w-lg mx-auto">
				<p>
					Get ready for an unforgettable adventure through the beautiful streets of Cuernavaca, Mexico.
				</p>
				<p>
					A treasure hunt of amazing locations awaits, each one carefully chosen just for you.
				</p>
			</div>

			<!-- Name input (optional personalization) -->
			<div class="pt-4 space-y-4">
				<div class="max-w-sm mx-auto">
					<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
						Enter your name (optional)
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Yvette"
						class="input input-bordered w-full text-center text-lg"
						on:keypress={(e) => e.key === 'Enter' && openSurprise()}
					/>
				</div>

				<!-- CTA Button -->
				<button
					on:click={openSurprise}
					class="btn btn-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
				>
					<span class="text-xl">Open Your Surprise</span>
					<span class="text-2xl ml-2">✨</span>
				</button>
			</div>

			<!-- Footer decoration -->
			<div class="pt-6 text-4xl space-x-2">
				<span>🎈</span>
				<span>🎉</span>
				<span>🎊</span>
				<span>🎂</span>
			</div>
		</div>
	</div>
</div>

<style>
	.bg-clip-text {
		-webkit-background-clip: text;
		background-clip: text;
	}
</style>
