<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { Pin } from '$lib/types.js';

	export let pins: Pin[] = [];

	const dispatch = createEventDispatcher<{ placeSelected: { lat: number; lon: number } }>();

	// ─── DOM refs ───────────────────────────────────────────────────────────────
	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let tooltip: HTMLDivElement;
	let infoPanel: HTMLDivElement;

	// ─── UI state (Svelte-reactive) ─────────────────────────────────────────────
	let tooltipVisible = false;
	let tooltipX = 0;
	let tooltipY = 0;
	let tooltipData: { name: string; category: string; is_visited: boolean } | null = null;

	let panelVisible = false;
	let panelPin: Pin | null = null;

	let addMode = false;
	let addPreviewVisible = false;
	let addPreviewX = 0;
	let addPreviewY = 0;
	let addPreviewLat = 0;
	let addPreviewLon = 0;

	let isMobile = false;

	// ─── Three.js module refs (filled in onMount after lazy import) ─────────────
	let THREE: typeof import('three');
	let rafHandle: number;
	let renderer: import('three').WebGLRenderer;
	let scene: import('three').Scene;
	let camera: import('three').PerspectiveCamera;
	let controls: import('three/examples/jsm/controls/OrbitControls.js').OrbitControls;
	let globeGroup: import('three').Group;
	let markersGroup: import('three').Group;
	let markerHitboxes: import('three').Mesh[] = [];
	let markerDataArr: {
		pin: Pin;
		ring: import('three').Mesh;
		beacon: import('three').Mesh;
		farDot: import('three').Mesh;
		halo: import('three').Mesh;
	}[] = [];
	let hoveredIdx = -1;
	let selectedIdx = -1;
	let isAutoRotating = true;
	let cameraAnim: {
		startPos: import('three').Vector3;
		targetPos: import('three').Vector3;
		startTime: number;
		duration: number;
	} | null = null;

	// ─── Category style config ───────────────────────────────────────────────────
	const CAT_COLORS: Record<string, number> = {
		default: 0x50c878,
		Adventure: 0xff7f2a,
		Beach: 0x00bfff,
		Mountain: 0xa67c52,
		City: 0xb3a0ff,
		Food: 0xff6b6b,
		Nature: 0x44dd88,
		Cultural: 0xffd700,
		Wildlife: 0xffaa33
	};

	function catColor(pin: Pin): number {
		const name = pin.category?.name ?? 'default';
		return CAT_COLORS[name] ?? CAT_COLORS['default'];
	}

	function catLabel(pin: Pin): string {
		return pin.category?.name ?? 'Location';
	}

	// ─── Coordinate helpers ──────────────────────────────────────────────────────
	function latLonToVec3(lat: number, lon: number, radius: number) {
		const phi = (90 - lat) * Math.PI / 180;
		const theta = (lon + 180) * Math.PI / 180;
		return new THREE.Vector3(
			-radius * Math.sin(phi) * Math.cos(theta),
			radius * Math.cos(phi),
			radius * Math.sin(phi) * Math.sin(theta)
		);
	}

	// Inverse: from a hit point on globe sphere to lat/lon
	function vec3ToLatLon(v: import('three').Vector3, radius: number) {
		const n = v.clone().divideScalar(radius);
		const lat = 90 - Math.acos(n.y) * 180 / Math.PI;
		const lon = (Math.atan2(n.z, -n.x) * 180 / Math.PI) - 180;
		return { lat, lon: lon < -180 ? lon + 360 : lon };
	}

	// ─── Main mount ──────────────────────────────────────────────────────────────
	onMount(async () => {
		isMobile = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;

		// Lazy-load Three.js — does NOT affect other pages
		const [threeModule, { OrbitControls }] = await Promise.all([
			import('three'),
			import('three/examples/jsm/controls/OrbitControls.js')
		]);
		THREE = threeModule;

		const GLOBE_R = 2;
		const LOD_NEAR = 3.8;
		const LOD_FAR = 8.5;

		// ── Renderer ────────────────────────────────────────────────────────────
		renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, canvas });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.3;
		renderer.outputColorSpace = THREE.SRGBColorSpace;

		// ── Scene + Camera ───────────────────────────────────────────────────────
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
		camera.position.set(0, 1.0, 5.5);

		// ── Controls ─────────────────────────────────────────────────────────────
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = isMobile ? 0.08 : 0.05;
		controls.minDistance = 3.0;
		controls.maxDistance = 15;
		controls.rotateSpeed = isMobile ? 0.4 : 0.5;
		controls.zoomSpeed = isMobile ? 0.6 : 0.8;
		controls.enablePan = false; // cleaner on mobile

		// ── Lighting ─────────────────────────────────────────────────────────────
		const sun = new THREE.DirectionalLight(0xfff5e6, 2.8);
		sun.position.set(10, 8, 15);
		scene.add(sun);
		scene.add(new THREE.AmbientLight(0x334466, 0.6));
		const rim = new THREE.DirectionalLight(0x4466aa, 1.2);
		rim.position.set(-10, -5, -15);
		scene.add(rim);

		// ── Globe group ──────────────────────────────────────────────────────────
		globeGroup = new THREE.Group();
		scene.add(globeGroup);

		// Ocean sphere
		const oceanGeo = new THREE.SphereGeometry(GLOBE_R * 0.995, isMobile ? 32 : 64, isMobile ? 32 : 64);
		const oceanMat = new THREE.MeshStandardMaterial({ color: 0x0a1628, roughness: 0.6, metalness: 0.1 });
		globeGroup.add(new THREE.Mesh(oceanGeo, oceanMat));

		// Atmosphere (back side glow)
		const atmoGeo = new THREE.SphereGeometry(GLOBE_R * 1.12, 64, 64);
		const atmoMat = new THREE.ShaderMaterial({
			vertexShader: `
				varying vec3 vNormal; varying vec3 vViewDir;
				void main(){
					vNormal=normalize(normalMatrix*normal);
					vec4 mvPos=modelViewMatrix*vec4(position,1.0);
					vViewDir=normalize(-mvPos.xyz);
					gl_Position=projectionMatrix*mvPos;
				}`,
			fragmentShader: `
				varying vec3 vNormal; varying vec3 vViewDir;
				void main(){
					float i=pow(0.72-dot(vNormal,vViewDir),3.0);
					vec3 c=mix(vec3(0.15,0.4,0.9),vec3(0.3,0.6,1.0),i);
					gl_FragColor=vec4(c,i*0.55);
				}`,
			transparent: true, depthWrite: false, side: THREE.BackSide,
			blending: THREE.AdditiveBlending
		});
		globeGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

		// Inner atmosphere rim
		const innerAtmoGeo = new THREE.SphereGeometry(GLOBE_R * 1.02, 64, 64);
		const innerAtmoMat = new THREE.ShaderMaterial({
			vertexShader: `
				varying vec3 vNormal; varying vec3 vViewDir;
				void main(){
					vNormal=normalize(normalMatrix*normal);
					vec4 mvPos=modelViewMatrix*vec4(position,1.0);
					vViewDir=normalize(-mvPos.xyz);
					gl_Position=projectionMatrix*mvPos;
				}`,
			fragmentShader: `
				varying vec3 vNormal; varying vec3 vViewDir;
				void main(){
					float f=1.0-dot(vNormal,vViewDir);
					float r=pow(f,4.0);
					gl_FragColor=vec4(0.2,0.5,1.0,r*0.3);
				}`,
			transparent: true, depthWrite: false, side: THREE.FrontSide,
			blending: THREE.AdditiveBlending
		});
		globeGroup.add(new THREE.Mesh(innerAtmoGeo, innerAtmoMat));

		// Wireframe grid
		const wireGeo = new THREE.SphereGeometry(GLOBE_R * 0.993, 48, 24);
		const wireMat = new THREE.MeshBasicMaterial({ color: 0x334466, wireframe: true, transparent: true, opacity: 0.06, depthWrite: false });
		globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

		// ── Dot-matrix earth (land) ──────────────────────────────────────────────
		const dotDensity = isMobile ? 140 : 220;
		const dotSize = isMobile ? 0.018 : 0.02;
		const landColor = new THREE.Color(0x22aa55);
		const landHighColor = new THREE.Color(0x55cc77);
		const oceanDotColor = new THREE.Color(0x112244);

		const waterCanvas = document.createElement('canvas');
		waterCanvas.width = 512;
		waterCanvas.height = 256;
		const waterCtx = waterCanvas.getContext('2d')!;

		const waterImg = new Image();
		waterImg.crossOrigin = 'anonymous';
		waterImg.onload = () => {
			waterCtx.drawImage(waterImg, 0, 0, 512, 256);
			const imageData = waterCtx.getImageData(0, 0, 512, 256);
			const positions: number[] = [], colors: number[] = [], sizes: number[] = [];

			for (let lat = -90; lat <= 90; lat += 180 / dotDensity) {
				const latRad = lat * Math.PI / 180;
				const circ = Math.cos(latRad);
				const dotsInRow = Math.max(1, Math.floor(dotDensity * 2 * circ));
				for (let j = 0; j < dotsInRow; j++) {
					const lon = (j / dotsInRow) * 360 - 180;
					const lonRad = lon * Math.PI / 180;
					const u = 1.0 - (lon + 180) / 360;
					const v = (90 - lat) / 180;
					const px = Math.floor(u * 511);
					const py = Math.floor(v * 255);
					const idx = (py * 512 + px) * 4;
					const brightness = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3;
					const isLand = brightness < 128;

					const r = GLOBE_R * 1.0003;
					const x = r * Math.cos(latRad) * Math.cos(lonRad);
					const y = r * Math.sin(latRad);
					const z = r * Math.cos(latRad) * Math.sin(lonRad);

					if (isLand) {
						positions.push(x, y, z);
						const latFactor = Math.abs(lat) / 90;
						const col = landColor.clone().lerp(landHighColor, latFactor * 0.5 + Math.random() * 0.2);
						colors.push(col.r, col.g, col.b);
						sizes.push(dotSize * 1.8);
					} else if (Math.random() > 0.82) {
						positions.push(x, y, z);
						colors.push(oceanDotColor.r * 0.6, oceanDotColor.g * 0.6, oceanDotColor.b * 0.8);
						sizes.push(dotSize * 0.5);
					}
				}
			}

			const geom = new THREE.BufferGeometry();
			geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
			geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

			const dotMat = new THREE.ShaderMaterial({
				vertexShader: `
					attribute float size; attribute vec3 color;
					varying vec3 vColor; varying vec3 vNormal; varying vec3 vViewDir;
					void main(){
						vColor=color;
						vNormal=normalize(normalMatrix*normalize(position));
						vec4 mvPos=modelViewMatrix*vec4(position,1.0);
						vViewDir=normalize(-mvPos.xyz);
						gl_PointSize=size*(700.0/-mvPos.z);
						gl_Position=projectionMatrix*mvPos;
					}`,
				fragmentShader: `
					varying vec3 vColor; varying vec3 vNormal; varying vec3 vViewDir;
					void main(){
						float d=length(gl_PointCoord-vec2(0.5));
						if(d>0.45)discard;
						float facing=dot(vNormal,vViewDir);
						if(facing<0.0)discard;
						float e=smoothstep(0.45,0.15,d);
						float f=smoothstep(0.0,0.25,facing);
						gl_FragColor=vec4(vColor,e*f);
					}`,
				transparent: true, depthWrite: false, depthTest: true, blending: THREE.NormalBlending
			});

			const dotMesh = new THREE.Points(geom, dotMat);
			globeGroup.add(dotMesh);
		};
		waterImg.src = 'https://unpkg.com/three-globe@2.34.0/example/img/earth-water.png';

		// ── Starfield ─────────────────────────────────────────────────────────────
		const starCount = isMobile ? 1500 : 3000;
		const starPos = new Float32Array(starCount * 3);
		const starSz = new Float32Array(starCount);
		for (let i = 0; i < starCount; i++) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			const r = 80 + Math.random() * 120;
			starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
			starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
			starPos[i * 3 + 2] = r * Math.cos(phi);
			starSz[i] = 0.3 + Math.random() * 1.2;
		}
		const starGeom = new THREE.BufferGeometry();
		starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
		starGeom.setAttribute('size', new THREE.Float32BufferAttribute(starSz, 1));
		const starMat = new THREE.ShaderMaterial({
			vertexShader: `
				attribute float size;
				void main(){
					vec4 mvPos=modelViewMatrix*vec4(position,1.0);
					gl_PointSize=size*(200.0/-mvPos.z);
					gl_Position=projectionMatrix*mvPos;
				}`,
			fragmentShader: `
				void main(){
					float d=length(gl_PointCoord-vec2(0.5));
					if(d>0.5)discard;
					float a=smoothstep(0.5,0.0,d)*0.7;
					gl_FragColor=vec4(0.8,0.85,1.0,a);
				}`,
			transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
		});
		scene.add(new THREE.Points(starGeom, starMat));

		// ── Adventure markers ────────────────────────────────────────────────────
		markersGroup = new THREE.Group();
		globeGroup.add(markersGroup);

		const ringGeo = new THREE.RingGeometry(0.03, 0.05, 24);
		const hitboxGeo = new THREE.SphereGeometry(0.06, 8, 8);
		const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });

		pins.forEach((pin, i) => {
			const lat = parseFloat(pin.latitude as unknown as string);
			const lon = parseFloat(pin.longitude as unknown as string);
			if (isNaN(lat) || isNaN(lon)) return;

			const color = catColor(pin);
			const pos = latLonToVec3(lat, lon, GLOBE_R * 1.005);

			const container_ = new THREE.Group();
			container_.position.copy(pos);
			const up = pos.clone().normalize();
			const quat = new THREE.Quaternion();
			quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
			container_.quaternion.copy(quat);

			// Beacon dot
			const beaconGeo = new THREE.SphereGeometry(0.022, 8, 8);
			const beaconMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
			const beacon = new THREE.Mesh(beaconGeo, beaconMat);
			beacon.position.set(0, 0.065, 0);
			container_.add(beacon);

			// Ring
			const ringMat = new THREE.MeshBasicMaterial({
				color, transparent: true, opacity: 0.4, side: THREE.DoubleSide,
				depthTest: true, depthWrite: false
			});
			const ring = new THREE.Mesh(ringGeo, ringMat);
			ring.rotation.x = -Math.PI / 2;
			container_.add(ring);

			// Far dot (visible at distance)
			const farDotMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
			const farDot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), farDotMat);
			farDot.position.set(0, 0.015, 0);
			container_.add(farDot);

			// Halo
			const haloMat = new THREE.MeshBasicMaterial({
				color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
			});
			const halo = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), haloMat);
			halo.position.set(0, 0.015, 0);
			container_.add(halo);

			// Hitbox (invisible, for raycasting)
			const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
			hitbox.userData = { index: markerHitboxes.length };
			hitbox.position.set(0, 0.025, 0);
			container_.add(hitbox);

			markersGroup.add(container_);
			markerHitboxes.push(hitbox);
			markerDataArr.push({ pin, ring, beacon, farDot, halo });
		});

		// ── Raycaster ────────────────────────────────────────────────────────────
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		const globeHitSphere = new THREE.Mesh(
			new THREE.SphereGeometry(GLOBE_R, 32, 32),
			new THREE.MeshBasicMaterial({ visible: false })
		);
		globeGroup.add(globeHitSphere);

		function getEventXY(e: MouseEvent | TouchEvent) {
			if ('touches' in e && e.touches.length > 0) {
				return { x: e.touches[0].clientX, y: e.touches[0].clientY };
			}
			if ('changedTouches' in e && e.changedTouches.length > 0) {
				return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
			}
			return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
		}

		function setMouse(clientX: number, clientY: number) {
			const rect = container.getBoundingClientRect();
			mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
		}

		function handleMove(e: MouseEvent | TouchEvent) {
			if (addMode) {
				// Show add-preview overlay
				const { x, y } = getEventXY(e);
				setMouse(x, y);
				raycaster.setFromCamera(mouse, camera);
				const [hit] = raycaster.intersectObject(globeHitSphere);
				if (hit) {
					const { lat, lon } = vec3ToLatLon(hit.point, GLOBE_R);
					addPreviewLat = lat;
					addPreviewLon = lon;
					addPreviewX = x;
					addPreviewY = y;
					addPreviewVisible = true;
				} else {
					addPreviewVisible = false;
				}
				return;
			}

			if ('touches' in e) return; // skip hover on touch when not in add mode

			const { x, y } = getEventXY(e);
			setMouse(x, y);
			raycaster.setFromCamera(mouse, camera);
			const hits = raycaster.intersectObjects(markerHitboxes);
			if (hits.length > 0) {
				const idx = hits[0].object.userData.index;
				if (hoveredIdx !== idx) {
					hoveredIdx = idx;
					const p = markerDataArr[idx].pin;
					tooltipData = {
						name: p.name,
						category: catLabel(p),
						is_visited: p.is_visited ?? false
					};
					tooltipVisible = true;
				}
				tooltipX = Math.min(x + 20, window.innerWidth - 280);
				tooltipY = Math.max(y - 20, 10);
				container.style.cursor = 'pointer';
			} else {
				if (hoveredIdx !== -1) {
					hoveredIdx = -1;
					tooltipVisible = false;
				}
				container.style.cursor = addMode ? 'crosshair' : 'grab';
			}
		}

		function handleClick(e: MouseEvent | TouchEvent) {
			const { x, y } = getEventXY(e);
			setMouse(x, y);
			raycaster.setFromCamera(mouse, camera);

			if (addMode) {
				const [hit] = raycaster.intersectObject(globeHitSphere);
				if (hit) {
					const { lat, lon } = vec3ToLatLon(hit.point, GLOBE_R);
					dispatch('placeSelected', { lat, lon });
					addMode = false;
					addPreviewVisible = false;
					container.style.cursor = 'grab';
				}
				return;
			}

			const hits = raycaster.intersectObjects(markerHitboxes);
			if (hits.length > 0) {
				const idx = hits[0].object.userData.index;
				selectedIdx = idx;
				panelPin = markerDataArr[idx].pin;
				panelVisible = true;
				isAutoRotating = false;
				tooltipVisible = false;

				// Fly to marker
				const lat = parseFloat(panelPin!.latitude as unknown as string);
				const lon = parseFloat(panelPin!.longitude as unknown as string);
				const target = latLonToVec3(lat, lon, GLOBE_R * 1.005).normalize().multiplyScalar(5.5);
				cameraAnim = {
					startPos: camera.position.clone(),
					targetPos: target,
					startTime: performance.now(),
					duration: 1200
				};
			} else {
				if (panelVisible) {
					panelVisible = false;
					selectedIdx = -1;
					isAutoRotating = true;
				}
			}
		}

		renderer.domElement.addEventListener('mousemove', handleMove as EventListener);
		renderer.domElement.addEventListener('click', handleClick as EventListener);
		renderer.domElement.addEventListener('touchend', handleClick as EventListener, { passive: true });
		renderer.domElement.addEventListener('touchmove', handleMove as EventListener, { passive: true });

		// ── Animation loop ────────────────────────────────────────────────────────
		const clock = new THREE.Clock();

		function animate() {
			rafHandle = requestAnimationFrame(animate);
			const elapsed = clock.getElapsedTime();

			if (isAutoRotating) globeGroup.rotation.y = elapsed * 0.06;

			// Camera fly-to
			if (cameraAnim) {
				const { startPos, targetPos, startTime, duration } = cameraAnim;
				const t = Math.min(1, (performance.now() - startTime) / duration);
				const ease = 1 - Math.pow(1 - t, 3);
				camera.position.lerpVectors(startPos, targetPos, ease);
				if (t >= 1) cameraAnim = null;
			}

			const camDist = camera.position.length();
			const lodRaw = Math.max(0, Math.min(1, (camDist - LOD_NEAR) / (LOD_FAR - LOD_NEAR)));
			const lod = lodRaw * lodRaw * (3 - 2 * lodRaw);
			const buildOp = 1.0 - lod;
			const dotOp = lod;

			markerDataArr.forEach((md, i) => {
				const pulse = Math.sin(elapsed * 3 + i * 0.5) * 0.5 + 0.5;
				const active = i === hoveredIdx || i === selectedIdx;

				// Far dot
				md.farDot.visible = dotOp > 0.01 && !active;
				if (md.farDot.visible) {
					(md.farDot.material as THREE.MeshBasicMaterial).opacity += (dotOp * (0.85 + pulse * 0.15) - (md.farDot.material as THREE.MeshBasicMaterial).opacity) * 0.15;
					md.halo.visible = true;
					(md.halo.material as THREE.MeshBasicMaterial).opacity += (dotOp * (0.2 + pulse * 0.15) - (md.halo.material as THREE.MeshBasicMaterial).opacity) * 0.15;
				} else {
					md.halo.visible = false;
				}

				// Ring
				const ringScale = active ? 2.0 + pulse * 0.8 : 1.0 + pulse * 0.3;
				md.ring.scale.setScalar(ringScale);
				(md.ring.material as THREE.MeshBasicMaterial).opacity = active ? 0.6 : 0.15 + pulse * 0.1;

				// Beacon
				const bOp = active ? 1.0 : 0.5 + pulse * 0.3;
				(md.beacon.material as THREE.MeshBasicMaterial).opacity = bOp;
				md.beacon.scale.setScalar(active ? 1.5 + pulse * 0.5 : 0.8 + pulse * 0.2);
			});

			controls.update();
			renderer.render(scene, camera);
		}

		animate();

		// ── Resize handler ────────────────────────────────────────────────────────
		const resizeObserver = new ResizeObserver(() => {
			if (!renderer || !camera) return;
			renderer.setSize(container.clientWidth, container.clientHeight);
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
		});
		resizeObserver.observe(container);

		return () => resizeObserver.disconnect();
	});

	onDestroy(() => {
		if (rafHandle) cancelAnimationFrame(rafHandle);
		if (renderer) renderer.dispose();
	});

	function enableAddMode() {
		addMode = true;
		panelVisible = false;
		selectedIdx = -1;
		isAutoRotating = false;
		if (container) container.style.cursor = 'crosshair';
	}

	function cancelAddMode() {
		addMode = false;
		addPreviewVisible = false;
		if (container) container.style.cursor = 'grab';
	}

	function closePanel() {
		panelVisible = false;
		selectedIdx = -1;
		isAutoRotating = true;
	}
</script>

<!-- ─── Layout ──────────────────────────────────────────────────────────────── -->
<div class="globe-wrap" bind:this={container}>
	<canvas bind:this={canvas}></canvas>

	<!-- Header HUD -->
	<header class="hud-header">
		<div class="hud-title">Adventure Globe</div>
		<div class="hud-sub">
			{pins.length} location{pins.length !== 1 ? 's' : ''} logged
		</div>
	</header>

	<!-- Add-mode controls -->
	{#if addMode}
		<div class="add-mode-bar">
			<span class="add-mode-label">🌍 Click anywhere on the globe to place a new location</span>
			<button class="btn-cancel" on:click={cancelAddMode}>Cancel</button>
		</div>
	{:else}
		<button class="btn-add" on:click={enableAddMode} title="Add new location on globe">
			＋ Add Location
		</button>
	{/if}

	<!-- Add-mode preview bubble -->
	{#if addPreviewVisible && addMode}
		<div
			class="add-preview"
			style="left:{addPreviewX + 16}px; top:{addPreviewY - 48}px"
		>
			📍 {addPreviewLat.toFixed(3)}° {addPreviewLon.toFixed(3)}°
		</div>
	{/if}

	<!-- Hover tooltip -->
	{#if tooltipVisible && tooltipData}
		<div
			class="tooltip"
			style="left:{tooltipX}px; top:{tooltipY}px"
		>
			<div class="tooltip-name">{tooltipData.name}</div>
			<div class="tooltip-meta">
				{tooltipData.category}
				{#if tooltipData.is_visited}
					· <span class="visited-badge">✓ Visited</span>
				{:else}
					· <span class="planned-badge">Planned</span>
				{/if}
			</div>
			<div class="tooltip-hint">Click for details</div>
		</div>
	{/if}

	<!-- Info panel (selected marker) -->
	{#if panelVisible && panelPin}
		<div class="info-panel">
			<button class="panel-close" on:click={closePanel} aria-label="Close panel">✕</button>
			<div class="panel-name">{panelPin.name}</div>
			<div class="panel-cat">
				{catLabel(panelPin)}
				{#if panelPin.is_visited}
					<span class="panel-visited">✓ Visited</span>
				{:else}
					<span class="panel-planned">Planned</span>
				{/if}
			</div>
			<div class="panel-coords">
				📍 {parseFloat(String(panelPin.latitude)).toFixed(4)}°N,
				{parseFloat(String(panelPin.longitude)).toFixed(4)}°E
			</div>
			<a
				class="panel-link"
				href="/locations/{panelPin.id}"
				on:click={closePanel}
			>
				View Details →
			</a>
		</div>
	{/if}

	<!-- Legend -->
	<div class="legend">
		{#each Object.entries(CAT_COLORS).filter(([k]) => k !== 'default').slice(0, 5) as [cat, color]}
			<span class="legend-item">
				<span
					class="legend-dot"
					style="background:#{(color).toString(16).padStart(6,'0')}"
				></span>
				{cat}
			</span>
		{/each}
	</div>

	<!-- Back nav -->
	<a class="back-link" href="/map">← Map View</a>
</div>

<!-- ─── Styles ───────────────────────────────────────────────────────────────── -->
<style>
	.globe-wrap {
		position: absolute;
		inset: 0;
		overflow: hidden;
		cursor: grab;
		font-family: 'Inter', system-ui, sans-serif;
	}

	canvas {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}

	/* ── HUD Header ─────────────────────────────────────────────────────────── */
	.hud-header {
		position: absolute;
		top: 20px;
		left: 24px;
		pointer-events: none;
		color: #e0e6f0;
		z-index: 10;
	}

	.hud-title {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.5px;
		margin-bottom: 4px;
	}

	.hud-sub {
		font-size: 12px;
		color: rgba(200, 210, 230, 0.5);
		font-weight: 300;
	}

	/* ── Add button ─────────────────────────────────────────────────────────── */
	.btn-add {
		position: absolute;
		top: 20px;
		right: 24px;
		z-index: 10;
		padding: 9px 18px;
		background: rgba(80, 200, 120, 0.15);
		border: 1px solid rgba(80, 200, 120, 0.35);
		border-radius: 8px;
		color: rgba(80, 200, 120, 0.9);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		backdrop-filter: blur(12px);
		transition: all 0.2s;
		font-family: inherit;
	}

	.btn-add:hover {
		background: rgba(80, 200, 120, 0.25);
		border-color: rgba(80, 200, 120, 0.6);
	}

	/* ── Add mode bar ───────────────────────────────────────────────────────── */
	.add-mode-bar {
		position: absolute;
		top: 16px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 16px;
		background: rgba(8, 12, 24, 0.9);
		border: 1px solid rgba(80, 200, 120, 0.25);
		border-radius: 10px;
		padding: 10px 20px;
		color: #e0e6f0;
		font-size: 13px;
		backdrop-filter: blur(16px);
		white-space: nowrap;
	}

	.add-mode-label {
		opacity: 0.85;
	}

	.btn-cancel {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 6px;
		color: rgba(200, 210, 230, 0.6);
		padding: 5px 14px;
		font-size: 12px;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.2s;
	}

	.btn-cancel:hover {
		border-color: rgba(255, 255, 255, 0.3);
		color: rgba(200, 210, 230, 0.9);
	}

	/* ── Add preview bubble ─────────────────────────────────────────────────── */
	.add-preview {
		position: absolute;
		z-index: 30;
		pointer-events: none;
		background: rgba(8, 12, 24, 0.85);
		border: 1px solid rgba(80, 200, 120, 0.3);
		border-radius: 6px;
		padding: 5px 10px;
		font-size: 11px;
		font-family: 'DM Mono', monospace;
		color: rgba(80, 200, 120, 0.9);
		white-space: nowrap;
		backdrop-filter: blur(8px);
	}

	/* ── Tooltip ────────────────────────────────────────────────────────────── */
	.tooltip {
		position: absolute;
		z-index: 100;
		pointer-events: none;
		min-width: 180px;
		max-width: 280px;
		background: rgba(8, 12, 24, 0.92);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 14px 16px;
		color: #e0e6f0;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.tooltip-name {
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 4px;
	}

	.tooltip-meta {
		font-size: 11px;
		color: rgba(200, 210, 230, 0.5);
		margin-bottom: 6px;
	}

	.tooltip-hint {
		font-size: 10px;
		color: rgba(200, 210, 230, 0.3);
	}

	.visited-badge {
		color: rgba(80, 200, 120, 0.8);
	}

	.planned-badge {
		color: rgba(255, 200, 80, 0.8);
	}

	/* ── Info panel ─────────────────────────────────────────────────────────── */
	.info-panel {
		position: absolute;
		top: 50%;
		right: 24px;
		transform: translateY(-50%);
		z-index: 50;
		width: 280px;
		background: rgba(8, 12, 24, 0.95);
		backdrop-filter: blur(24px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 14px;
		padding: 24px;
		color: #e0e6f0;
		box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
	}

	.panel-close {
		position: absolute;
		top: 14px;
		right: 14px;
		background: transparent;
		border: none;
		color: rgba(200, 210, 230, 0.4);
		font-size: 16px;
		cursor: pointer;
		padding: 4px;
		line-height: 1;
		transition: color 0.2s;
	}

	.panel-close:hover {
		color: rgba(200, 210, 230, 0.9);
	}

	.panel-name {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 6px;
		padding-right: 24px;
	}

	.panel-cat {
		font-size: 12px;
		color: rgba(200, 210, 230, 0.5);
		margin-bottom: 12px;
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.panel-visited {
		color: rgba(80, 200, 120, 0.8);
	}

	.panel-planned {
		color: rgba(255, 200, 80, 0.8);
	}

	.panel-coords {
		font-size: 11px;
		font-family: 'DM Mono', monospace;
		color: rgba(200, 210, 230, 0.4);
		margin-bottom: 20px;
		padding-top: 12px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.panel-link {
		display: inline-block;
		background: rgba(80, 200, 120, 0.12);
		border: 1px solid rgba(80, 200, 120, 0.25);
		border-radius: 7px;
		padding: 8px 16px;
		color: rgba(80, 200, 120, 0.9);
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s;
	}

	.panel-link:hover {
		background: rgba(80, 200, 120, 0.22);
		border-color: rgba(80, 200, 120, 0.45);
	}

	/* ── Legend ─────────────────────────────────────────────────────────────── */
	.legend {
		position: absolute;
		bottom: 20px;
		left: 24px;
		z-index: 10;
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		pointer-events: none;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		color: rgba(200, 210, 230, 0.5);
	}

	.legend-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* ── Back link ──────────────────────────────────────────────────────────── */
	.back-link {
		position: absolute;
		bottom: 20px;
		right: 24px;
		z-index: 10;
		font-size: 12px;
		color: rgba(200, 210, 230, 0.4);
		text-decoration: none;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: rgba(200, 210, 230, 0.8);
	}

	/* ── Mobile adjustments ─────────────────────────────────────────────────── */
	@media (max-width: 640px) {
		.hud-title {
			font-size: 16px;
		}

		.info-panel {
			top: auto;
			bottom: 0;
			right: 0;
			left: 0;
			transform: none;
			width: 100%;
			border-radius: 14px 14px 0 0;
			max-height: 50vh;
			overflow-y: auto;
		}

		.legend {
			gap: 8px;
			bottom: 12px;
		}

		.add-mode-bar {
			font-size: 11px;
			padding: 8px 12px;
			gap: 10px;
			max-width: 90vw;
		}
	}
</style>
