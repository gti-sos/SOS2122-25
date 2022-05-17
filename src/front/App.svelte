<script>
	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import Info from './Info.svelte';

	import esco from './esco-stats/esco.svelte';
	import Editesco from "./esco-stats/Editesco.svelte";
	import MyGraphesco from './esco-stats/MyGraphesco.svelte';
	import economies from './frontEconomies/economies.svelte';
	import EditEconomies from "./frontEconomies/EditEconomies.svelte";
	import MyGraphEconomies from "./frontEconomies/MyGraphEconomies.svelte";
	import Expo from './expo-stats/Expo.svelte';
	import EditExpo from "./expo-stats/EditExpo.svelte";
	import ExpoGraph from './expo-stats/ExpoGraph.svelte';
	import MyGraph from './MyGraph.svelte';
	//export let name;

	const routes={
		'/' : Home,
		"/info" : Info,

		"/esco-stats" : esco,
		"/esco/:country/:year" : Editesco,
		"/graphesco": MyGraphesco,
		"/economies" : economies,
		"/economies/:country/:year" : EditEconomies,
		"/economies-graph": MyGraphEconomies,
		"/expo" : Expo,
		"/expo/:country/:year" : EditExpo,
		"/graphexpo" : ExpoGraph,
		"/graph": MyGraph


	};
	


</script>

<main>
	<Router {routes} />
</main>

