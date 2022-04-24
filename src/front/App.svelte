<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import esco from './esco-stats/esco.svelte';
	import Editesco from "./esco-stats/Editesco.svelte";
	
	//export let name;
	const routes={
		"/" : Home,
		"/esco-stats" : esco,
		"/esco/:country" : Editesco,
		
	};
	
</script>

<main>
	<!--<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<esco /> -->
	<Router {routes} />
	
</main>