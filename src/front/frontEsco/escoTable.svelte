<script>
    import { onMount } from 'svelte';
	

	let esco=[];
	let loading = true;
	let p1;

	onMount(getEsco);

	async function getEsco(){
		console.log("fetching ...");
		const res =await fetch("/api/v1/esco");
		if(res.ok){
			const data = await res.json();
			esco = data;
			console.log("Received countries: "+esco.length);
		}

	}
</script>

<main>
    {#await esco}
loading
	{:then esco}
	{p1}

	<table>
		<thead>
			<tr>
				<th>
					Country
				</th>
				<th>
					Year
				</th>
				<th>
					Esco_tot
				</th>
				<th>
					Esco_men
				</th>
				<th>
					Esco_wom
				</th>
			</tr>
		</thead>
		<tbody>
				{#each esco as escos}
				<tr>
					<td>{escos.country}</td>
					<td>{escos.year}</td>
					<td>{escos.Esco_tot}</td>
					<td>{escos.Esco_men}</td>
					<td>{escos.Esco_wom}</td>
				</tr>
				{/each}
		</tbody>
	</table>
{/await}
</main>