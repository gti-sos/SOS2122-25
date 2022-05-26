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


	import IntegrationEco1 from './frontEconomies/integrationApi1.svelte';
	import IntegrationEco2 from './frontEconomies/integrationApi2.svelte';
	import IntegrationEco3 from './frontEconomies/integrationApi3.svelte';

	import Integration1 from './esco-stats/integration1.svelte';
	import IntegrationExpo1 from './expo-stats/integrationAPIpneumonia.svelte';
	//import Integration2 from './esco-stats/integration2.svelte';
	//import Integration3 from './esco-stats/integration3.svelte';
	//import Integration4 from './esco-stats/integration4.svelte';
	//import Integration5 from './esco-stats/integration5.svelte';
	//import Integration6 from './esco-stats/integration6.svelte';
	

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
		"/graph": MyGraph,
		"/expo/integrationExpo1": IntegrationExpo1,
		"/economies/integracion1": IntegrationEco1,
		"/economies/integracion2": IntegrationEco2,
		"/economies/integracion3": IntegrationEco3,

		"/integration1": Integration1,
		//"/integration2": Integration2,
		//"/integration3": Integration3,
		//"/integration4": Integration4,
		//"/integration5": Integration5,
		//"/integration6": Integration6,


	};
	


</script>

<main>
	<Router {routes} />
</main>

