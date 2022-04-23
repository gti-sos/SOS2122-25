<script>
	import Router from "svelte-spa-router"
	import EconomiesTable from './economiesTable.svelte'
	import edit from "./editEconomies.svelte";

	const routes ={
		"/economiesTable": EconomiesTable,
		"/economiesTable/:countryName": edit,
	}
</script>

<main>
	<Router {routes}></Router>
</main>