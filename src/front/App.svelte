<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import esco from './frontEsco/esco.svelte';
	import Editesco from "./frontEsco/Editesco.svelte";
	import ExpoTable from './frontExpo/ExpoTable.svelte';
	import EditExpoTable from './frontExpo/editExpoTable.svelte';
	import EconomiesTable from './frontEconomies/economiesTable.svelte';
	import edit from "./frontEconomies/editEconomies.svelte";

	//export let name;
	const routes={
		"/" : Home,
		"/esco-stats" : esco,
		"/esco/:country" : Editesco,
		"/ExpoTable" : ExpoTable,
		"/ExpoTable/:country" : EditExpoTable,
		"/economiesTable": EconomiesTable,
		"/economiesTable/:country": edit,
		"/info" : Home
		
	};
	
</script>

<main>
	<!--<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<esco /> -->
	<Router {routes} />
	
</main>