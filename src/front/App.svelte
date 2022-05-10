<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import Info from './Info.svelte';

	import esco from './esco-stats/esco.svelte';
	import Editesco from "./esco-stats/Editesco.svelte";
	import MyGraphesco from './esco-stats/MyGraphesco.svelte';
<<<<<<< HEAD
	import Cancerdeaths from './frontEconomies/Cancerdeaths.svelte';
	import EditCancerdeaths from "./frontEconomies/EditCancerdeaths.svelte";
	import MyGraphEconomies from "./frontEconomies/MyGraphCancerdeaths.svelte";
=======
	import Cancerdeaths from './cancerdeaths-stats/Cancerdeaths.svelte';
	import EditCancerdeaths from "./cancerdeaths-stats/EditCancerdeaths.svelte";
	import MyGraphCancerdeaths from "./cancerdeaths-stats/MyGraphCancerdeaths.svelte";
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
	import Airpollution from './air-pollution-stats/Airpollution.svelte';
	import EditAirpollution from "./air-pollution-stats/EditAirpollution.svelte";

	
import AirPollutionGraph from './air-pollution-stats/AirPollutionGraph.svelte';
import MyGraph from './MyGraph.svelte';
	//export let name;

	const routes={
		'/' : Home,
		"/info" : Info,

		"/esco-stats" : esco,
		"/esco/:country/:year" : Editesco,
		"/graphesco": MyGraphesco,
		"/cancerdeaths-stats" : Cancerdeaths,
		"/cancerdeaths/:country/:year" : EditCancerdeaths,
<<<<<<< HEAD
		"/economies-graph": MyGraphEconomies,
=======
		"/cancerdeaths-graph": MyGraphCancerdeaths,
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
		"/air-pollution-stats" : Airpollution,
		"/air-pollution/:country/:year" : EditAirpollution,
		"/graphAirPollution" : AirPollutionGraph,
		"/graph": MyGraph


	};
	


</script>

<main>
	<!--<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<esco /> -->
	<Router {routes} />
	
</main>

