<script>
    import { onMount } from 'svelte';
		import Table from 'C:/Users/adria/SOS/SOS2122-25/node_modules/sveltestrap/src/Table.svelte';
		import Button from 'sveltestrap/src/Button.svelte';
	

	let expo=[];
	let loading = true;
	let p1;
	
	let expos = [];
	let expos1 = {
		country : "",
        year : "",
        expo_tec : "",
        expo_m : "",
        expo_bys : ""
	};
	onMount(getExpo);

	async function getExpo(){
		console.log("fetching ...");
		const res =await fetch("/api/v1/expo");
		if(res.ok){
			const data = await res.json();
			expo = data;
			console.log("Received countries: "+expo.length);
		}

	}
</script>

<main>
    {#await expo}
loading
	{:then expo}
	{p1}

	<Table bordered>
		<thead>
			<tr>
				<th>
					País
				</th>
				<th>
					Año
				</th>
				<th>
					Expo_tec
				</th>
				<th>
					Expo_m
				</th>
				<th>
					Expo_bys
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{expos1.country}"></td>
				<td><input bind:value="{expos1.year}"></td>
				<td><input bind:value="{expos1.expo_tec}"></td>
                <td><input bind:value="{expos1.expo_m}"></td>
				<td><input bind:value="{expos1.expo_bys}"></td>
			</tr>
				{#each expo as expos}
				<tr>
					<td>{expos.country}</td>
					<td>{expos.year}</td>
					<td>{expos.expo_tec}</td>
					<td>{expos.expo_m}</td>
					<td>{expos.expo_bys}</td>
				</tr>
				{/each}
		</tbody>
	</Table>
{/await}
</main>