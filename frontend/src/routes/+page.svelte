<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { playClick, playHover, playSuccess, playWhoosh, playAmbientRise, playMilestone, unlockAudio, setSoundEnabled, isSoundEnabled } from '$lib/utils/sound';
	import { hapticTap, hapticClick, hapticHeavy } from '$lib/utils/haptic';

	export let data;

	// State
	let mounted = false;
	let scrollY = 0;
	let innerWidth = 0;
	let innerHeight = 0;
	let isMobile = false;
	let cursorX = 0;
	let cursorY = 0;
	let cursorScale = 1;
	let cursorText = '';
	let showScrollIndicator = true;
	let scrollProgress = 0;

	// Jungle intro state
	let introPhase: 'dark' | 'crack' | 'dawn' | 'done' = 'dark';
	let introError = false;
	let soundEnabled = true;
	let prevScrollScene = -1;

	// Refs
	let atmosphereCanvas: HTMLCanvasElement;
	let heroSection: HTMLElement;
	let authSection: HTMLElement;
	let destinationsSection: HTMLElement;
	let cardsTrack: HTMLElement;
	let editorialSection: HTMLElement;
	let marqueeSection: HTMLElement;
	let bentoSection: HTMLElement;
	let ctaSection: HTMLElement;
	let introCurtain: HTMLElement;
	let lenis: any;
	let animationFrameId: number;

	// Destinations
	const DESTINATIONS = [
		{
			name: 'Cenote Ik Kil',
			region: 'Yucatan, Mexico',
			mood: ['SPIRITUAL', 'ECO'],
			line: 'Descend into the sacred underground',
			image: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=800&h=1100&fit=crop',
			color: '#2a6a8a'
		},
		{
			name: 'Palenque',
			region: 'Chiapas, Mexico',
			mood: ['SPIRITUAL', 'ADVENTURE'],
			line: 'Where the Maya spoke to the stars',
			image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&h=1100&fit=crop',
			color: '#4a7a3a'
		},
		{
			name: 'Hierve el Agua',
			region: 'Oaxaca, Mexico',
			mood: ['ECO', 'ADVENTURE'],
			line: 'Petrified waterfalls above the valley',
			image: 'https://images.unsplash.com/photo-1570737543098-ffc5c1b1aef4?w=800&h=1100&fit=crop',
			color: '#8a6a2a'
		},
		{
			name: 'Sierra Norte',
			region: 'Oaxaca, Mexico',
			mood: ['ECO'],
			line: 'Cloud forests, Zapotec villages, no WiFi',
			image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=1100&fit=crop',
			color: '#3a6a4a'
		},
		{
			name: 'Barichara',
			region: 'Santander, Colombia',
			mood: ['ECO', 'SPIRITUAL'],
			line: 'The most beautiful town in Colombia',
			image: 'https://images.unsplash.com/photo-1569839333583-7ef2e1c1a8c7?w=800&h=1100&fit=crop',
			color: '#8a5a3a'
		},
		{
			name: 'Parque Tayrona',
			region: 'Magdalena, Colombia',
			mood: ['ADVENTURE', 'ECO'],
			line: 'Jungle meets Caribbean, untouched',
			image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1100&fit=crop',
			color: '#2a7a6a'
		},
		{
			name: 'Valle Sagrado',
			region: 'Cusco, Peru',
			mood: ['SPIRITUAL', 'ADVENTURE'],
			line: 'The heartbeat of the Inca world',
			image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=1100&fit=crop',
			color: '#6a4a8a'
		},
		{
			name: 'Monteverde',
			region: 'Puntarenas, Costa Rica',
			mood: ['ECO'],
			line: 'Walk through the clouds',
			image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=1100&fit=crop',
			color: '#4a8a5a'
		},
		{
			name: 'Teotihuacan',
			region: 'Estado de Mexico',
			mood: ['SPIRITUAL', 'ADVENTURE'],
			line: 'Climb the Pyramid of the Sun at dawn',
			image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=1100&fit=crop',
			color: '#9a7a2a'
		}
	];

	const MARQUEE_ITEMS = [
		'CENOTE SWIM', 'PALENQUE RUINS', 'OAXACA MEZCAL TRAIL',
		'SIERRA NORTE TREK', 'TAYRONA CAMPING', 'SACRED VALLEY',
		'MONTEVERDE CANOPY', 'TEOTIHUACAN SUNRISE', 'BARICHARA WALK'
	];

	const ECO_ITEMS = [
		'LOCAL GUIDES', 'CARBON NEUTRAL', 'SMALL GROUPS', 'REFORESTATION',
		'ZERO MASS TOURISM', 'COMMUNITY FIRST', 'SACRED PLACES', 'ECO-CERTIFIED'
	];

	const ECO_CARDS = [
		{
			icon: '\u{1F91D}',
			title: 'Local Guides Only',
			body: '100% of guides are from the community they serve. Not outsiders. Not corporations.',
			stat: '0',
			statLabel: 'outside guides ever hired',
			large: true
		},
		{
			icon: '\u{1F33F}',
			title: 'Carbon Offset',
			body: 'Every journey is carbon neutral. Included. Not optional.',
			stat: '1',
			statLabel: 'tree planted per traveler'
		},
		{
			icon: '\u{1F465}',
			title: 'Max 8 Travelers',
			body: 'We keep groups small so destinations stay sacred.',
			stat: '8',
			statLabel: 'max always'
		},
		{
			icon: '\u{1F49B}',
			title: '1% to Reforestation',
			body: '1% of every booking funds reforestation in the Yucatan.',
			stat: '1%',
			statLabel: 'through New World Kids 501(c)3'
		}
	];

	// Animated numbers
	let statTravelers = 0;
	let statDestinations = 0;
	let statEco = 0;
	let statsAnimated = false;

	function animateNumber(target: number, setter: (v: number) => void, duration = 2000) {
		const start = performance.now();
		const step = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setter(Math.round(target * eased));
			if (progress < 1) requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	}

	// GLSL Atmosphere
	function initAtmosphere() {
		if (!atmosphereCanvas) return;
		const gl = atmosphereCanvas.getContext('webgl');
		if (!gl) return;

		const resize = () => {
			const dpr = isMobile ? 0.5 : Math.min(window.devicePixelRatio, 1.5);
			atmosphereCanvas.width = window.innerWidth * dpr;
			atmosphereCanvas.height = window.innerHeight * dpr;
			gl.viewport(0, 0, atmosphereCanvas.width, atmosphereCanvas.height);
		};
		resize();
		window.addEventListener('resize', resize, { passive: true });

		const vert = 'attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }';
		const frag = [
			'precision mediump float;',
			'uniform vec2 u_res;',
			'uniform float u_time;',
			'vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }',
			'float snoise(vec2 v) {',
			'  const vec4 C = vec4(0.211325,0.366025,-0.577350,0.024390);',
			'  vec2 i = floor(v + dot(v, C.yy));',
			'  vec2 x0 = v - i + dot(i, C.xx);',
			'  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);',
			'  vec4 x12 = x0.xyxy + C.xxzz;',
			'  x12.xy -= i1;',
			'  i = mod(i, 289.0);',
			'  vec3 p = permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));',
			'  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);',
			'  m = m*m; m = m*m;',
			'  vec3 x_ = 2.0*fract(p * C.www) - 1.0;',
			'  vec3 h = abs(x_) - 0.5;',
			'  vec3 ox = floor(x_ + 0.5);',
			'  vec3 a0 = x_ - ox;',
			'  m *= 1.79284291 - 0.85373472 * (a0*a0 + h*h);',
			'  vec3 g;',
			'  g.x = a0.x * x0.x + h.x * x0.y;',
			'  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
			'  return 130.0 * dot(m, g);',
			'}',
			'void main() {',
			'  vec2 uv = gl_FragCoord.xy / u_res;',
			'  float t = u_time * 0.06;',
			'  float n = snoise(uv * 2.5 + vec2(t, t * 0.4));',
			'  float n2 = snoise(uv * 5.0 - vec2(t * 0.3, t * 0.7));',
			'  float mist = smoothstep(-0.2, 0.8, (n + n2 * 0.4) * 0.5 + 0.5);',
			'  vec3 gold = vec3(0.77, 0.59, 0.24);',
			'  vec3 sage = vec3(0.35, 0.48, 0.32);',
			'  vec3 color = mix(sage, gold, uv.y + n * 0.3);',
			'  gl_FragColor = vec4(color, mist * 0.45);',
			'}'
		].join('\n');

		const compile = (type: number, src: string) => {
			const s = gl.createShader(type);
			if (!s) return null;
			gl.shaderSource(s, src);
			gl.compileShader(s);
			return s;
		};
		const prog = gl.createProgram();
		if (!prog) return;
		const vs = compile(gl.VERTEX_SHADER, vert);
		const fs = compile(gl.FRAGMENT_SHADER, frag);
		if (!vs || !fs) return;
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		gl.useProgram(prog);

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
		const pos = gl.getAttribLocation(prog, 'a_pos');
		gl.enableVertexAttribArray(pos);
		gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

		const uRes = gl.getUniformLocation(prog, 'u_res');
		const uTime = gl.getUniformLocation(prog, 'u_time');

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		const startTime = performance.now();
		const render = () => {
			gl.uniform2f(uRes, atmosphereCanvas.width, atmosphereCanvas.height);
			gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			animationFrameId = requestAnimationFrame(render);
		};
		render();
	}

	// Jungle intro sequence
	function runJungleIntro() {
		try {
			// Phase 1: pure black (already), then crack of light at 300ms
			setTimeout(() => { introPhase = 'crack'; }, 300);
			// Phase 2: dawn breaks at 900ms
			setTimeout(() => {
				introPhase = 'dawn';
				playAmbientRise();
			}, 900);
			// Phase 3: curtain fully gone at 2200ms
			setTimeout(() => { introPhase = 'done'; }, 2200);
		} catch (e) {
			console.warn('[Querencia] Intro error:', e);
			introPhase = 'done';
		}
	}

	// Sound toggle
	function toggleSound() {
		soundEnabled = !soundEnabled;
		setSoundEnabled(soundEnabled);
		hapticTap();
		playClick();
	}

	// Scroll milestone tracker — play tone on each major scene
	$: {
		const scene = Math.floor(scrollProgress * 7);
		if (scene !== prevScrollScene && scene > 0 && scene < 7 && mounted) {
			prevScrollScene = scene;
			if (scene % 2 === 0) { playMilestone(); hapticHeavy(); }
		}
	}

	// Cursor
	function handleMouseMove(e: MouseEvent) {
		cursorX = e.clientX;
		cursorY = e.clientY;
	}

	function setCursorHover(text: string, scale: number) {
		cursorText = text;
		cursorScale = scale;
		playHover();
	}

	function resetCursor() {
		cursorText = '';
		cursorScale = 1;
	}

	// Auth
	let authTab: 'begin' | 'login' = 'begin';
	let emailValue = '';
	let authError = '';
	let authLoading = false;

	function handleAuth() {
		authError = '';
		if (!emailValue || !emailValue.includes('@')) {
			authError = 'Please enter a valid email address.';
			hapticTap();
			return;
		}
		playClick();
		hapticClick();
		authLoading = true;
		setTimeout(() => {
			authLoading = false;
			if (authTab === 'begin') {
				goto('/signup');
			} else {
				goto('/login');
			}
		}, 200);
	}

	function handleTabSwitch(tab: 'begin' | 'login') {
		authTab = tab;
		authError = '';
		playClick();
		hapticTap();
	}

	// Scroll engine
	async function initScrollEngine() {
		const { default: Lenis } = await import('lenis');
		const gsapModule = await import('gsap');
		const gsap = gsapModule.default || gsapModule.gsap;
		const stModule = await import('gsap/ScrollTrigger');
		const ScrollTrigger = stModule.ScrollTrigger || stModule.default;

		gsap.registerPlugin(ScrollTrigger);

		if (!isMobile) {
			lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
			lenis.on('scroll', ScrollTrigger.update);
			gsap.ticker.add((time: number) => {
				if (lenis) lenis.raf(time * 1000);
			});
			gsap.ticker.lagSmoothing(0);
		}

		// Scroll progress
		ScrollTrigger.create({
			trigger: document.body,
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (self: any) => {
				scrollProgress = self.progress;
				showScrollIndicator = self.progress < 0.05;
			}
		});

		// Scene 1: Hero pin + char reveal
		if (heroSection) {
			const heroTl = gsap.timeline({
				scrollTrigger: {
					trigger: heroSection,
					start: 'top top',
					end: '+=400',
					scrub: 1,
					pin: true,
					anticipatePin: 1
				}
			});

			const heroChars = heroSection.querySelectorAll('.hero-char');
			heroTl.fromTo(
				heroChars,
				{ opacity: 0, y: 80, rotateX: -45 },
				{
					opacity: 1, y: 0, rotateX: 0,
					stagger: { amount: 0.6, from: 'start' },
					ease: 'power3.out'
				}
			);

			// Parallax layers
			const layers = heroSection.querySelectorAll('.parallax-layer');
			layers.forEach((layer: Element, i: number) => {
				const speed = (layers.length - i) * 30;
				gsap.to(layer, {
					y: speed,
					ease: 'none',
					scrollTrigger: {
						trigger: heroSection,
						start: 'top top',
						end: 'bottom top',
						scrub: true
					}
				});
			});
		}

		// Scene 2: Auth card emerge
		if (authSection) {
			const authCard = authSection.querySelector('.auth-card-wrapper');
			if (authCard) {
				gsap.fromTo(authCard,
					{ y: 80, opacity: 0, filter: 'blur(20px)' },
					{
						y: 0, opacity: 1, filter: 'blur(0px)',
						ease: 'power3.out', duration: 1.2,
						scrollTrigger: {
							trigger: authSection,
							start: 'top 80%',
							end: 'center center',
							toggleActions: 'play none none reverse'
						}
					}
				);
			}
		}

		// Scene 3: Horizontal destination scroll (desktop)
		if (destinationsSection && cardsTrack && !isMobile) {
			const cards = cardsTrack.querySelectorAll('.dest-card');
			const cardW = 400;
			const gap = 24;
			const totalScroll = (cards.length - 1) * (cardW + gap);

			const horizontalTl = gsap.to(cardsTrack, {
				x: () => -totalScroll,
				ease: 'none',
				scrollTrigger: {
					trigger: destinationsSection,
					pin: true,
					start: 'top top',
					end: () => '+=' + totalScroll,
					scrub: 1,
					invalidateOnRefresh: true
				}
			});

			cards.forEach((card: Element) => {
				const img = card.querySelector('.card-img');
				if (img) {
					gsap.to(img, {
						xPercent: 25,
						ease: 'none',
						scrollTrigger: {
							trigger: card,
							containerAnimation: horizontalTl,
							start: 'left right',
							end: 'right left',
							scrub: true
						}
					});
				}
			});
		}

		// Scene 4: Editorial lines + clip-path
		if (editorialSection) {
			const editLines = editorialSection.querySelectorAll('.edit-line');
			gsap.fromTo(editLines,
				{ opacity: 0, y: 40 },
				{
					opacity: 1, y: 0,
					stagger: 0.15,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: editorialSection,
						start: 'top 70%',
						toggleActions: 'play none none reverse'
					}
				}
			);

			const editImg = editorialSection.querySelector('.edit-image');
			if (editImg) {
				gsap.fromTo(editImg,
					{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
					{
						clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
						ease: 'power3.inOut',
						duration: 1.5,
						scrollTrigger: {
							trigger: editImg,
							start: 'top 75%',
							toggleActions: 'play none none reverse'
						}
					}
				);
			}
		}

		// Scene 6: Bento cards
		if (bentoSection) {
			const bentoCards = bentoSection.querySelectorAll('.bento-card');
			gsap.fromTo(bentoCards,
				{ opacity: 0, y: 40, scale: 0.96 },
				{
					opacity: 1, y: 0, scale: 1,
					stagger: 0.12,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: bentoSection,
						start: 'top 75%',
						toggleActions: 'play none none reverse'
					}
				}
			);
		}

		// Scene 7: CTA zoom
		if (ctaSection) {
			const ctaBg = ctaSection.querySelector('.cta-bg');
			if (ctaBg) {
				gsap.fromTo(ctaBg,
					{ scale: 1 },
					{
						scale: 1.15,
						ease: 'none',
						scrollTrigger: {
							trigger: ctaSection,
							start: 'top bottom',
							end: 'bottom top',
							scrub: true
						}
					}
				);
			}

			const ctaContent = ctaSection.querySelector('.cta-content');
			if (ctaContent) {
				gsap.fromTo(ctaContent,
					{ opacity: 0, y: 30 },
					{
						opacity: 1, y: 0,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: ctaSection,
							start: 'top 60%',
							toggleActions: 'play none none reverse'
						}
					}
				);
			}
		}

		// Scroll reveals via IntersectionObserver
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					observer.unobserve(entry.target);
					if (entry.target.classList.contains('stats-row') && !statsAnimated) {
						statsAnimated = true;
						animateNumber(127, (v) => statTravelers = v);
						animateNumber(9, (v) => statDestinations = v, 1200);
						animateNumber(100, (v) => statEco = v, 1800);
					}
				}
			});
		}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

		document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
	}

	// Lifecycle
	onMount(() => {
		if (!browser) return;
		isMobile = window.innerWidth < 768;
		mounted = true;
		soundEnabled = isSoundEnabled();

		// Jungle curtain intro
		runJungleIntro();

		// Unlock audio on first interaction
		const unlock = () => { unlockAudio(); };
		window.addEventListener('pointerdown', unlock, { once: true });

		setTimeout(() => {
			try { initAtmosphere(); } catch (e) { console.warn('[Querencia] Atmosphere init failed:', e); }
		}, 100);
		setTimeout(() => {
			try { initScrollEngine(); } catch (e) { console.warn('[Querencia] Scroll engine init failed:', e); }
		}, 200);
	});

	onDestroy(() => {
		if (browser) {
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
			if (lenis) lenis.destroy();
		}
	});
</script>

<svelte:window bind:scrollY bind:innerWidth bind:innerHeight />

<svelte:head>
	<title>Querencia — Sacred Eco-Journeys | AdventureLog</title>
	<meta name="description" content="Eco-conscious journeys to Latin America's most spiritually alive places. Small groups. Local guides. Zero mass tourism." />
	<meta name="theme-color" content="#0c0d0a" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=DM+Mono:wght@300;400;500&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
</svelte:head>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="querencia-root" on:mousemove={handleMouseMove}>

	<!-- Jungle intro curtain -->
	{#if introPhase !== 'done'}
		<div
			bind:this={introCurtain}
			class="intro-curtain"
			class:curtain-crack={introPhase === 'crack'}
			class:curtain-dawn={introPhase === 'dawn'}
			aria-hidden="true"
		></div>
	{/if}

	<!-- Sound toggle -->
	{#if mounted}
		<button
			class="sound-toggle"
			on:click={toggleSound}
			aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
			title={soundEnabled ? 'Mute' : 'Sound on'}
		>
			{#if soundEnabled}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M11 5L6 9H2v6h4l5 4V5z"/>
					<path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
				</svg>
			{:else}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M11 5L6 9H2v6h4l5 4V5z"/>
					<line x1="23" y1="9" x2="17" y2="15"/>
					<line x1="17" y1="9" x2="23" y2="15"/>
				</svg>
			{/if}
		</button>
	{/if}

	<!-- Custom Cursor (desktop) -->
	{#if !isMobile && mounted}
		<div
			class="custom-cursor"
			class:cursor-expanded={cursorText !== ''}
			style="transform: translate({cursorX - 4}px, {cursorY - 4}px) scale({cursorScale})"
		>
			{#if cursorText}
				<span class="cursor-label">{cursorText}</span>
			{/if}
		</div>
	{/if}

	<!-- Scroll Progress -->
	<div
		class="scroll-progress"
		style="transform: scaleX({scrollProgress}); opacity: {scrollProgress > 0.02 ? 1 : 0}"
	></div>

	<!-- GLSL Atmosphere -->
	<canvas bind:this={atmosphereCanvas} class="atmosphere-canvas"></canvas>

	<!-- ======================================================= -->
	<!-- SCENE 1: THE ARRIVAL (Hero Parallax)                    -->
	<!-- ======================================================= -->
	<section bind:this={heroSection} class="scene scene-hero" id="hero">
		<div class="parallax-container">
			<div class="parallax-layer layer-sky">
				<div class="sky-gradient"></div>
			</div>
			<div class="parallax-layer layer-mountains">
				<svg viewBox="0 0 1440 400" preserveAspectRatio="none" class="mountain-svg">
					<path d="M0,400 L0,280 Q180,120 360,200 Q540,80 720,180 Q900,60 1080,160 Q1260,100 1440,220 L1440,400 Z" fill="rgba(30,35,24,0.8)"/>
					<path d="M0,400 L0,300 Q240,180 480,260 Q720,140 960,240 Q1200,160 1440,280 L1440,400 Z" fill="rgba(18,20,16,0.9)"/>
				</svg>
			</div>
			<div class="parallax-layer layer-mist">
				<div class="mist-overlay"></div>
			</div>
			<div class="parallax-layer layer-canopy">
				<div class="canopy-fade"></div>
			</div>
			<div class="parallax-layer layer-foreground">
				<div class="foreground-fade"></div>
			</div>
		</div>

		<div class="hero-ui">
			<div class="hero-content">
				<div class="eyebrow">
					<span>Kupuri Media</span>
					<span class="eyebrow-dot">&middot;</span>
					<span>Eco-Journeys</span>
				</div>

				<h1 class="hero-title" aria-label="Querencia">
					{#each 'Querencia'.split('') as char, i}
						<span class="hero-char" style="--char-index: {i}">{char}</span>
					{/each}
				</h1>

				<p class="hero-subtitle">The place you feel most yourself</p>

				<div class="hero-scroll-indicator" class:hidden-indicator={!showScrollIndicator}>
					<span class="scroll-text">Scroll to enter</span>
					<div class="scroll-chevron">
						<svg width="14" height="8" viewBox="0 0 14 8" fill="none">
							<path d="M1 1L7 7L13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ======================================================= -->
	<!-- SCENE 2: THE DESCENT (Auth Card)                        -->
	<!-- ======================================================= -->
	<section bind:this={authSection} class="scene scene-auth" id="auth">
		<div class="scene-inner">
			<div class="auth-card-wrapper">
				<div class="bezel-outer">
					<div class="bezel-inner">
						<div class="border-trail"></div>
						<div class="auth-content">
							<div class="auth-logo">
								<span class="q-mark">Q</span>
								<span class="brand-name">Querencia</span>
							</div>
							<p class="auth-tagline">Sacred journeys through Latin America</p>
							<div class="auth-divider"></div>

							<div class="auth-tabs">
								<button
									class="auth-tab"
									class:active={authTab === 'begin'}
									on:click={() => authTab = 'begin'}
								>Begin Journey</button>
								<button
									class="auth-tab"
									class:active={authTab === 'login'}
									on:click={() => authTab = 'login'}
								>Already Traveling</button>
							</div>

							<form class="auth-form" on:submit|preventDefault={handleAuth}>
								<input
									type="email"
									placeholder="Your email address"
									class="auth-input"
									class:auth-input-error={authError}
									bind:value={emailValue}
									autocomplete="email"
									required
								/>
								{#if authError}
									<p class="auth-error-msg" role="alert">{authError}</p>
								{/if}
								{#if authTab === 'login'}
									<input
										type="password"
										placeholder="Password"
										class="auth-input"
										autocomplete="current-password"
										required
									/>
								{/if}
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<button
									type="submit"
									class="btn-cta btn-cta-full"
									disabled={authLoading}
									on:mouseenter={() => setCursorHover('GO', 2.5)}
									on:mouseleave={resetCursor}
									on:click={() => { playClick(); hapticClick(); }}
								>
									{#if authLoading}
										<span class="btn-loading"></span>
									{:else}
										{authTab === 'begin' ? 'Begin Your Journey' : 'Continue'}
										<span class="btn-icon-wrap">&#x2197;</span>
									{/if}
								</button>
							</form>

							<p class="auth-trust">No spam. No mass tourism. No compromises.</p>
							<div class="auth-social-proof">
								<span>47 eco-tours completed</span>
								<span class="proof-dot">&middot;</span>
								<span>9 destinations</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ======================================================= -->
	<!-- SCENE 3: THE DESTINATIONS (Horizontal Scroll)           -->
	<!-- ======================================================= -->
	<section bind:this={destinationsSection} class="scene scene-destinations" id="destinations">
		<div class="destinations-header" data-reveal>
			<div class="eyebrow">Sacred Destinations &middot; 9 Places</div>
			<h2 class="section-title">Where the land remembers you</h2>
		</div>

		{#if isMobile}
			<div class="cards-mobile-scroll">
				{#each DESTINATIONS as dest}
					<div class="dest-card" style="--accent: {dest.color}">
						<div class="card-bezel-outer">
							<div class="card-bezel-inner">
								<div class="card-img-container">
									<img src={dest.image} alt={dest.name} class="card-img" loading="lazy" />
									<div class="card-overlay">
										<div class="card-moods">
											{#each dest.mood as m}
												<span class="mood-badge">{m}</span>
											{/each}
										</div>
										<h3 class="card-name">{dest.name}</h3>
										<p class="card-region">{dest.region}</p>
										<p class="card-line">{dest.line}</p>
										<button class="card-btn">Explore</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="cards-track-wrapper">
				<div bind:this={cardsTrack} class="cards-track">
					{#each DESTINATIONS as dest}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class="dest-card"
							style="--accent: {dest.color}"
							on:mouseenter={() => setCursorHover('EXPLORE', 2)}
							on:mouseleave={resetCursor}
						>
							<div class="card-bezel-outer">
								<div class="card-bezel-inner">
									<div class="card-img-container">
										<img src={dest.image} alt={dest.name} class="card-img" loading="lazy" />
										<div class="card-overlay">
											<div class="card-moods">
												{#each dest.mood as m}
													<span class="mood-badge">{m}</span>
												{/each}
											</div>
											<h3 class="card-name">{dest.name}</h3>
											<p class="card-region">{dest.region}</p>
											<p class="card-line">{dest.line}</p>
											<button class="card-btn">Explore</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>

	<!-- ======================================================= -->
	<!-- SCENE 4: THE EDITORIAL SPLIT (Manifesto)                -->
	<!-- ======================================================= -->
	<section bind:this={editorialSection} class="scene scene-editorial" id="editorial">
		<div class="editorial-inner">
			<div class="editorial-left">
				<div class="eyebrow" data-reveal>Our Belief</div>
				<h2 class="editorial-headline">
					<span class="edit-line" data-reveal>We don't sell</span>
					<span class="edit-line" data-reveal>destinations.</span>
					<span class="edit-line edit-line-accent" data-reveal>We find the places</span>
					<span class="edit-line edit-line-accent" data-reveal>that find you.</span>
				</h2>
				<p class="editorial-body" data-reveal>
					Querencia curates eco-conscious journeys to Latin America's most
					spiritually alive places. Small groups. Local guides. Zero mass tourism.
					The kind of travel that leaves the land better than you found it.
				</p>
				<div class="stats-row" data-reveal>
					<div class="stat-item">
						<span class="stat-number">{statTravelers}</span>
						<span class="stat-label">Travelers</span>
					</div>
					<div class="stat-divider"></div>
					<div class="stat-item">
						<span class="stat-number">{statDestinations}</span>
						<span class="stat-label">Destinations</span>
					</div>
					<div class="stat-divider"></div>
					<div class="stat-item">
						<span class="stat-number">{statEco}%</span>
						<span class="stat-label">Eco-Certified</span>
					</div>
				</div>
			</div>
			<div class="editorial-right">
				<div class="edit-image" data-reveal>
					<img
						src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=900&h=1200&fit=crop"
						alt="Sacred ceremony in the jungle"
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- ======================================================= -->
	<!-- SCENE 5: THE DUAL MARQUEE                               -->
	<!-- ======================================================= -->
	<section bind:this={marqueeSection} class="scene scene-marquee" id="marquee">
		<div class="marquee-track">
			<div class="marquee-inner">
				{#each [...MARQUEE_ITEMS, ...MARQUEE_ITEMS] as item}
					<span class="marquee-item">
						<span class="marquee-dot">&#x2726;</span>
						{item}
					</span>
				{/each}
			</div>
		</div>
		<div class="marquee-track marquee-reverse">
			<div class="marquee-inner marquee-inner-reverse">
				{#each [...ECO_ITEMS, ...ECO_ITEMS] as item}
					<span class="marquee-item marquee-item-dim">
						<span class="marquee-dot">&#x2726;</span>
						{item}
					</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- ======================================================= -->
	<!-- SCENE 6: ECO COMMITMENT (Bento Grid)                    -->
	<!-- ======================================================= -->
	<section bind:this={bentoSection} class="scene scene-bento" id="eco">
		<div class="bento-inner">
			<div class="eyebrow" data-reveal>Eco Commitment</div>
			<h2 class="section-title" data-reveal>Travel that gives back</h2>
			<div class="bento-grid">
				{#each ECO_CARDS as card, i}
					<div class="bento-card bento-card-{i}" data-reveal class:bento-large={card.large}>
						<div class="bento-spotlight"></div>
						<div class="bento-content">
							<span class="bento-icon">{card.icon}</span>
							<h3 class="bento-title">{card.title}</h3>
							<p class="bento-body">{card.body}</p>
							<div class="bento-stat">
								<span class="bento-stat-number">{card.stat}</span>
								<span class="bento-stat-label">{card.statLabel}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ======================================================= -->
	<!-- SCENE 7: THE CINEMATIC CTA                              -->
	<!-- ======================================================= -->
	<section bind:this={ctaSection} class="scene scene-cta" id="cta">
		<div class="cta-bg">
			<img
				src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&h=900&fit=crop"
				alt="Aerial jungle canopy at golden hour"
				loading="lazy"
			/>
		</div>
		<div class="cta-overlay"></div>
		<div class="cta-content">
			<h2 class="cta-headline">Your querencia is waiting.</h2>
			<p class="cta-sub">Eco-conscious journeys &middot; Latin America &middot; Small groups</p>
			<button
				class="btn-cta btn-cta-large"
				on:click={() => { playWhoosh(); hapticClick(); goto(data.user ? '/dashboard' : '/signup'); }}
				on:mouseenter={() => setCursorHover('GO', 2.5)}
				on:mouseleave={resetCursor}
			>
				Begin Your Journey
				<span class="btn-icon-wrap">&#x2197;</span>
			</button>
			<footer class="cta-footer">
				<p class="footer-brand">Querencia by Kupuri Media &middot; Puerto Vallarta, Mexico</p>
				<div class="footer-links">
					<a href="https://wa.me/" target="_blank" rel="noopener noreferrer" class="footer-link" aria-label="WhatsApp">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.486a.5.5 0 00.627.616l4.584-1.207A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.726-5.994-1.957l-.42-.312-2.717.716.729-2.664-.343-.458A9.955 9.955 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
					</a>
					<a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" class="footer-link" aria-label="Instagram">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
					</a>
				</div>
			</footer>
		</div>
	</section>
</div>

<style>
	/* ═══════════════════════════════════════════════ */
	/* SACRED EARTH DESIGN TOKENS                     */
	/* ═══════════════════════════════════════════════ */
	:root {
		--vellum: #0c0d0a;
		--vellum-2: #111410;
		--vellum-3: #181c14;
		--vellum-4: #1e2318;
		--vellum-5: #252c1e;
		--gold: #c4963c;
		--gold-light: #ddb85a;
		--gold-pale: #f0d898;
		--gold-dim: rgba(196,150,60,0.4);
		--gold-glow: rgba(196,150,60,0.1);
		--gold-border: rgba(196,150,60,0.18);
		--rust: #b05c38;
		--sage: #5a7a52;
		--sage-light: #78a06a;
		--ink: #e8e2d4;
		--ink-dim: #a09880;
		--ink-muted: #5a5448;
		--font-display: 'Playfair Display', Georgia, serif;
		--font-mono: 'DM Mono', 'Courier New', monospace;
		--font-body: 'Lato', 'Helvetica Neue', sans-serif;
		--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* ═══════════════════════════════════════════════ */
	/* JUNGLE INTRO CURTAIN                          */
	/* ═══════════════════════════════════════════════ */
	.intro-curtain {
		position: fixed;
		inset: 0;
		z-index: 10000;
		pointer-events: none;
		background: #000;
		transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.9s ease;
	}
	/* Phase: crack — thin gold ray from center */
	.intro-curtain.curtain-crack {
		background: radial-gradient(ellipse 6px 100% at 50% 50%, rgba(196,150,60,0.6) 0%, #000 70%);
		animation: curtainCrack 0.6s ease-out forwards;
	}
	@keyframes curtainCrack {
		from { opacity: 1; background: #000; }
		to   { opacity: 1; background: radial-gradient(ellipse 60px 100% at 50% 50%, rgba(196,150,60,0.4) 0%, #000 80%); }
	}
	/* Phase: dawn — warm light floods in */
	.intro-curtain.curtain-dawn {
		animation: curtainDawn 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	@keyframes curtainDawn {
		0%   { opacity: 1; background: radial-gradient(ellipse 60px 100% at 50% 50%, rgba(196,150,60,0.4) 0%, #000 80%); }
		60%  { opacity: 0.6; background: radial-gradient(ellipse 200% 200% at 50% 60%, rgba(196,150,60,0.15) 0%, rgba(12,13,10,0.3) 60%, transparent 100%); }
		100% { opacity: 0; }
	}

	/* ═══════════════════════════════════════════════ */
	/* SOUND TOGGLE                                   */
	/* ═══════════════════════════════════════════════ */
	.sound-toggle {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 200;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(196,150,60,0.08);
		border: 1px solid var(--gold-border);
		color: var(--ink-dim);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.2s, color 0.2s, border-color 0.2s;
	}
	.sound-toggle:hover {
		background: rgba(196,150,60,0.15);
		color: var(--gold);
		border-color: var(--gold-dim);
	}

	/* Auth error */
	.auth-input-error { border-color: var(--rust) !important; }
	.auth-error-msg {
		font-size: 0.72rem;
		color: var(--rust);
		margin-top: 0.35rem;
		letter-spacing: 0.03em;
	}

	/* Button loading spinner */
	.btn-loading {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* ═══════════════════════════════════════════════ */
	/* ROOT                                           */
	/* ═══════════════════════════════════════════════ */
	.querencia-root {
		background: var(--vellum);
		color: var(--ink);
		font-family: var(--font-body);
		font-weight: 300;
		line-height: 1.7;
		overflow-x: hidden;
		cursor: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	@media (max-width: 767px) {
		.querencia-root { cursor: auto; }
	}

	/* ═══════════════════════════════════════════════ */
	/* CUSTOM CURSOR                                  */
	/* ═══════════════════════════════════════════════ */
	.custom-cursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background: var(--gold);
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		transition: width 0.3s var(--ease-out-expo),
					height 0.3s var(--ease-out-expo),
					background 0.3s var(--ease-out-expo);
		mix-blend-mode: difference;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cursor-expanded {
		width: 48px;
		height: 48px;
		background: transparent;
		border: 1px solid var(--gold);
	}
	.cursor-label {
		font-family: var(--font-mono);
		font-size: 7px;
		letter-spacing: 2px;
		color: var(--gold);
		text-transform: uppercase;
		white-space: nowrap;
	}

	/* ═══════════════════════════════════════════════ */
	/* SCROLL PROGRESS                                */
	/* ═══════════════════════════════════════════════ */
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(to right, var(--gold), var(--gold-light));
		transform-origin: left;
		z-index: 100;
		transition: opacity 0.3s ease;
	}

	/* ═══════════════════════════════════════════════ */
	/* ATMOSPHERE CANVAS                              */
	/* ═══════════════════════════════════════════════ */
	.atmosphere-canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
		opacity: 0.5;
		mix-blend-mode: screen;
	}

	/* ═══════════════════════════════════════════════ */
	/* SHARED COMPONENTS                              */
	/* ═══════════════════════════════════════════════ */
	.scene {
		position: relative;
		min-height: 100vh;
		z-index: 1;
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 14px;
		border-radius: 999px;
		border: 1px solid rgba(196,150,60,0.25);
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 2.5px;
		text-transform: uppercase;
		color: var(--gold-dim);
		margin-bottom: 1.5rem;
		backdrop-filter: blur(8px);
	}
	.eyebrow-dot { color: var(--gold); }
	.section-title {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		color: var(--gold-pale);
		line-height: 1.15;
		margin-bottom: 3rem;
	}

	/* Double-bezel */
	.bezel-outer {
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(196,150,60,0.12);
		border-radius: 24px;
		padding: 6px;
		box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
	}
	.bezel-inner {
		background: rgba(12,16,10,0.8);
		backdrop-filter: blur(24px) saturate(140%);
		-webkit-backdrop-filter: blur(24px) saturate(140%);
		border-radius: 18px;
		box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
		overflow: hidden;
		position: relative;
	}

	/* CTA Button */
	.btn-cta {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 16px 28px 16px 32px;
		background: var(--gold);
		color: var(--vellum);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		font-weight: 500;
		border: none;
		cursor: none;
		transition: all 0.2s var(--ease-out-expo);
	}
	.btn-cta:hover { background: var(--gold-light); }
	.btn-cta:active { transform: scale(0.97); }
	.btn-icon-wrap {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: rgba(0,0,0,0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		transition: transform 0.2s var(--ease-out-expo);
	}
	.btn-cta:hover .btn-icon-wrap { transform: translate(2px, -2px); }
	.btn-cta-full { width: 100%; justify-content: center; }
	.btn-cta-large { padding: 20px 40px 20px 48px; font-size: 12px; }

	/* Reveal animation */
	[data-reveal] {
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo);
	}
	:global([data-reveal].revealed) {
		opacity: 1;
		transform: translateY(0);
	}
	[data-reveal]:nth-child(2) { transition-delay: 0.1s; }
	[data-reveal]:nth-child(3) { transition-delay: 0.2s; }
	[data-reveal]:nth-child(4) { transition-delay: 0.3s; }

	/* ═══════════════════════════════════════════════ */
	/* SCENE 1: HERO                                  */
	/* ═══════════════════════════════════════════════ */
	.scene-hero {
		height: 100vh;
		overflow: hidden;
		background: var(--vellum);
	}
	.parallax-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.parallax-layer {
		position: absolute;
		inset: 0;
		will-change: transform;
	}
	.sky-gradient {
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, #050608 0%, #0a0f14 20%, #1a1812 50%, #2a2218 70%, #3a2a14 100%);
	}
	.mountain-svg {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 60%;
	}
	.mist-overlay {
		width: 100%;
		height: 100%;
		background: radial-gradient(ellipse 120% 60% at 50% 80%, rgba(90,122,82,0.15) 0%, transparent 70%);
		filter: blur(2px);
	}
	.canopy-fade {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 50%;
		background: linear-gradient(0deg, var(--vellum) 0%, transparent 100%);
	}
	.foreground-fade {
		position: absolute;
		bottom: -5%;
		left: -5%;
		right: -5%;
		height: 30%;
		background: linear-gradient(0deg, var(--vellum) 30%, transparent 100%);
	}
	.hero-ui {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 5;
	}
	.hero-content {
		text-align: center;
		max-width: 900px;
		padding: 0 2rem;
	}
	.hero-title {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 700;
		font-size: clamp(4rem, 12vw, 10rem);
		color: var(--gold);
		line-height: 1;
		margin: 0 0 1rem;
		display: inline-block;
	}
	.hero-char {
		display: inline-block;
		opacity: 0;
		transform: translateY(80px) rotateX(-45deg);
		transform-origin: center bottom;
		will-change: transform, opacity;
	}
	.hero-subtitle {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 4px;
		text-transform: uppercase;
		color: var(--ink-muted);
		margin-bottom: 3rem;
		opacity: 0;
		animation: fadeInUp 1s var(--ease-out-expo) 0.8s forwards;
	}
	.hero-scroll-indicator {
		position: absolute;
		bottom: 3rem;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		transition: opacity 0.5s ease;
	}
	.hidden-indicator {
		opacity: 0;
		pointer-events: none;
	}
	.scroll-text {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--ink-muted);
		display: block;
		margin-bottom: 0.5rem;
	}
	.scroll-chevron {
		color: var(--gold-dim);
		animation: bounceDown 2s ease-in-out infinite;
	}
	@keyframes bounceDown {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(6px); }
	}
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ═══════════════════════════════════════════════ */
	/* SCENE 2: AUTH                                  */
	/* ═══════════════════════════════════════════════ */
	.scene-auth {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6rem 1.5rem;
		background: radial-gradient(ellipse at center, var(--vellum-3) 0%, var(--vellum) 70%);
	}
	.scene-inner { width: 100%; max-width: 440px; }
	.auth-card-wrapper { opacity: 0; }
	.border-trail {
		position: absolute;
		inset: -1px;
		border-radius: 18px;
		overflow: hidden;
		z-index: 0;
		pointer-events: none;
	}
	.border-trail::before {
		content: '';
		position: absolute;
		width: 200px;
		height: 200px;
		top: -100px;
		left: -100px;
		background: radial-gradient(circle, rgba(196,150,60,0.6) 0%, transparent 70%);
		animation: borderTrailRotate 4s linear infinite;
	}
	@keyframes borderTrailRotate {
		0% { transform: rotate(0deg) translateX(250px) rotate(0deg); }
		100% { transform: rotate(360deg) translateX(250px) rotate(-360deg); }
	}
	.auth-content {
		position: relative;
		z-index: 1;
		padding: 2.5rem;
	}
	.auth-logo {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-bottom: 0.5rem;
	}
	.q-mark {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 28px;
		color: var(--gold);
	}
	.brand-name {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 24px;
		color: var(--gold-pale);
	}
	.auth-tagline {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--ink-muted);
		margin-bottom: 1.5rem;
	}
	.auth-divider {
		height: 1px;
		background: var(--gold-border);
		margin-bottom: 1.5rem;
	}
	.auth-tabs {
		display: flex;
		margin-bottom: 1.5rem;
		border: 1px solid var(--gold-border);
		border-radius: 10px;
		overflow: hidden;
	}
	.auth-tab {
		flex: 1;
		padding: 10px 16px;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--ink-muted);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.auth-tab.active {
		background: var(--gold-glow);
		color: var(--gold);
	}
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 1.5rem;
	}
	.auth-input {
		width: 100%;
		padding: 14px 18px;
		background: rgba(255,255,255,0.04);
		border: 1px solid var(--gold-border);
		border-radius: 12px;
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--ink);
		outline: none;
		transition: border-color 0.2s ease;
		box-sizing: border-box;
	}
	.auth-input::placeholder { color: var(--ink-muted); }
	.auth-input:focus {
		border-color: var(--gold-dim);
		box-shadow: 0 0 0 3px var(--gold-glow);
	}
	.auth-trust {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--ink-muted);
		text-align: center;
		margin-bottom: 1.5rem;
	}
	.auth-social-proof {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--ink-dim);
	}
	.proof-dot { color: var(--gold); }

	/* ═══════════════════════════════════════════════ */
	/* SCENE 3: DESTINATIONS                          */
	/* ═══════════════════════════════════════════════ */
	.scene-destinations {
		padding: 6rem 2rem 0;
		background: var(--vellum);
		overflow: hidden;
	}
	.destinations-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	.cards-track-wrapper {
		overflow: visible;
		width: 100%;
	}
	.cards-track {
		display: flex;
		gap: 24px;
		padding: 2rem 0 4rem;
		will-change: transform;
	}
	.dest-card {
		flex-shrink: 0;
		width: 380px;
		height: 520px;
		transition: transform 0.4s var(--ease-out-expo);
	}
	.dest-card:hover { transform: translateY(-8px); }
	.card-bezel-outer {
		width: 100%;
		height: 100%;
		background: rgba(255,255,255,0.03);
		border: 1px solid var(--gold-border);
		border-radius: 20px;
		padding: 5px;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}
	.dest-card:hover .card-bezel-outer {
		border-color: var(--accent, var(--gold-dim));
		box-shadow: 0 8px 40px rgba(0,0,0,0.3), 0 0 60px color-mix(in srgb, var(--accent, var(--gold)) 20%, transparent);
	}
	.card-bezel-inner {
		width: 100%;
		height: 100%;
		border-radius: 15px;
		overflow: hidden;
		position: relative;
	}
	.card-img-container {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}
	.card-img {
		width: 120%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transition: transform 0.8s var(--ease-out-expo);
		will-change: transform;
	}
	.dest-card:hover .card-img { transform: scale(1.05); }
	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 60%);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.5rem;
	}
	.card-moods {
		display: flex;
		gap: 6px;
		margin-bottom: 0.75rem;
	}
	.mood-badge {
		font-family: var(--font-mono);
		font-size: 8px;
		letter-spacing: 1.5px;
		padding: 3px 10px;
		border-radius: 999px;
		border: 1px solid var(--gold-dim);
		color: var(--gold-dim);
		text-transform: uppercase;
	}
	.card-name {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 24px;
		color: #fff;
		margin: 0 0 4px;
		line-height: 1.2;
	}
	.card-region {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 1.5px;
		color: var(--ink-dim);
		text-transform: uppercase;
		margin: 0 0 6px;
	}
	.card-line {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 13px;
		color: var(--gold-pale);
		margin: 0 0 12px;
	}
	.card-btn {
		display: inline-flex;
		align-items: center;
		padding: 8px 20px;
		border-radius: 999px;
		border: 1px solid var(--gold-border);
		background: transparent;
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.2s ease;
		width: fit-content;
	}
	.card-btn:hover {
		background: var(--accent, var(--gold));
		border-color: var(--accent, var(--gold));
		color: var(--vellum);
	}
	.cards-mobile-scroll {
		display: flex;
		gap: 16px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scroll-snap-type: x mandatory;
		padding: 1rem 1rem 3rem;
		scrollbar-width: none;
	}
	.cards-mobile-scroll::-webkit-scrollbar { display: none; }
	.cards-mobile-scroll .dest-card {
		width: 300px;
		height: 440px;
		scroll-snap-align: center;
	}

	/* ═══════════════════════════════════════════════ */
	/* SCENE 4: EDITORIAL                             */
	/* ═══════════════════════════════════════════════ */
	.scene-editorial {
		padding: 8rem 2rem;
		background: var(--vellum);
	}
	.editorial-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 55% 45%;
		gap: 4rem;
		align-items: center;
	}
	.editorial-headline {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 700;
		line-height: 1.12;
		margin-bottom: 2rem;
	}
	.edit-line {
		display: block;
		font-size: clamp(2rem, 4.5vw, 3.5rem);
		color: var(--ink);
	}
	.edit-line-accent { color: var(--gold-pale); }
	.editorial-body {
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 1.8;
		color: var(--ink-dim);
		max-width: 55ch;
		margin-bottom: 3rem;
	}
	.stats-row {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.stat-number {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 2.5rem;
		color: var(--gold);
		line-height: 1;
	}
	.stat-label {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.stat-divider {
		width: 1px;
		height: 40px;
		background: var(--gold-border);
	}
	.edit-image {
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0,0,0,0.4);
	}
	.edit-image img {
		width: 100%;
		height: auto;
		display: block;
		aspect-ratio: 3/4;
		object-fit: cover;
	}

	/* ═══════════════════════════════════════════════ */
	/* SCENE 5: MARQUEE                               */
	/* ═══════════════════════════════════════════════ */
	.scene-marquee {
		padding: 4rem 0;
		background: var(--vellum);
		overflow: hidden;
		min-height: auto;
	}
	.marquee-track {
		overflow: hidden;
		white-space: nowrap;
		border-top: 1px solid var(--gold-border);
		padding: 18px 0;
	}
	.marquee-track:last-child { border-bottom: 1px solid var(--gold-border); }
	.marquee-inner {
		display: inline-flex;
		gap: 2.5rem;
		animation: marqueeScroll 35s linear infinite;
	}
	.marquee-inner-reverse {
		animation-direction: reverse;
		animation-duration: 45s;
	}
	.marquee-item {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 3.5px;
		color: var(--ink-muted);
		text-transform: uppercase;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
	}
	.marquee-item-dim { color: var(--gold-dim); }
	.marquee-dot { color: var(--gold); font-size: 8px; }
	@keyframes marqueeScroll {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}

	/* ═══════════════════════════════════════════════ */
	/* SCENE 6: BENTO GRID                            */
	/* ═══════════════════════════════════════════════ */
	.scene-bento {
		padding: 8rem 2rem;
		background: var(--vellum);
	}
	.bento-inner {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}
	.bento-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 12px;
		margin-top: 2rem;
		text-align: left;
	}
	.bento-card {
		background: var(--vellum-3);
		border: 1px solid var(--gold-border);
		border-radius: 20px;
		padding: 2rem;
		position: relative;
		overflow: hidden;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}
	.bento-card:hover {
		border-color: var(--gold-dim);
		box-shadow: 0 4px 24px rgba(196,150,60,0.08);
	}
	.bento-spotlight {
		position: absolute;
		inset: 0;
		opacity: 0;
		background: radial-gradient(300px circle at 50% 50%, rgba(196,150,60,0.08) 0%, transparent 70%);
		transition: opacity 0.3s ease;
		pointer-events: none;
	}
	.bento-card:hover .bento-spotlight { opacity: 1; }
	.bento-content { position: relative; z-index: 1; }
	.bento-icon { font-size: 28px; display: block; margin-bottom: 1rem; }
	.bento-title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 20px;
		color: var(--ink);
		margin-bottom: 0.75rem;
	}
	.bento-body {
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--ink-dim);
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}
	.bento-stat {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}
	.bento-stat-number {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.8rem;
		color: var(--gold);
	}
	.bento-stat-label {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	/* ═══════════════════════════════════════════════ */
	/* SCENE 7: CTA                                   */
	/* ═══════════════════════════════════════════════ */
	.scene-cta {
		position: relative;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.cta-bg {
		position: absolute;
		inset: -10%;
		z-index: 0;
		will-change: transform;
	}
	.cta-bg img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.cta-overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 100%);
		z-index: 1;
	}
	.cta-content {
		position: relative;
		z-index: 2;
		text-align: center;
		padding: 2rem;
		max-width: 900px;
	}
	.cta-headline {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 700;
		font-size: clamp(2.5rem, 7vw, 5rem);
		color: var(--gold-pale);
		line-height: 1.1;
		margin-bottom: 1.5rem;
	}
	.cta-sub {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 3px;
		text-transform: uppercase;
		color: var(--gold-dim);
		margin-bottom: 3rem;
	}
	.cta-footer { margin-top: 4rem; }
	.footer-brand {
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--ink-muted);
		margin-bottom: 1rem;
	}
	.footer-links {
		display: flex;
		justify-content: center;
		gap: 16px;
	}
	.footer-link {
		color: var(--ink-muted);
		transition: color 0.2s ease;
		display: flex;
		align-items: center;
	}
	.footer-link:hover { color: var(--gold); }

	/* ═══════════════════════════════════════════════ */
	/* RESPONSIVE                                     */
	/* ═══════════════════════════════════════════════ */
	@media (max-width: 767px) {
		.hero-title { font-size: clamp(3rem, 14vw, 5rem); }
		.scene-auth { padding: 4rem 1rem; }
		.auth-content { padding: 1.75rem; }
		.scene-destinations { padding: 4rem 0 0; }
		.destinations-header { padding: 0 1.5rem; }
		.editorial-inner { grid-template-columns: 1fr; gap: 2rem; }
		.editorial-right { order: -1; }
		.stats-row { flex-wrap: wrap; gap: 1.5rem; }
		.stat-divider { display: none; }
		.bento-grid { grid-template-columns: 1fr 1fr; }
		.scene-bento { padding: 5rem 1.5rem; }
		.scene-editorial { padding: 5rem 1.5rem; }
		.cta-headline { font-size: clamp(2rem, 9vw, 3.5rem); }
		.btn-cta-large { padding: 16px 32px 16px 36px; font-size: 10px; }
	}
	@media (max-width: 480px) {
		.bento-grid { grid-template-columns: 1fr; }
	}

	/* ═══════════════════════════════════════════════ */
	/* REDUCED MOTION                                 */
	/* ═══════════════════════════════════════════════ */
	@media (prefers-reduced-motion: reduce) {
		.marquee-inner, .marquee-inner-reverse { animation: none; }
		.scroll-chevron { animation: none; }
		.border-trail::before { animation: none; }
		:global([data-reveal]) { opacity: 1; transform: none; transition: none; }
		.hero-char { opacity: 1; transform: none; }
		.hero-subtitle { opacity: 1; animation: none; }
		.atmosphere-canvas { display: none; }
	}
</style>
