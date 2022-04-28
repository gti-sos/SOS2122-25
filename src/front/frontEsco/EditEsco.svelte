<script>
    import { onMount } from 'svelte'
    export let params={};
    import { pop } from "svelte-spa-router";
    import {Table , Button} from "sveltestrap";


    onMount(getesco);

    let esco ={};

    let updatedCountry;
    let updatedYear;
    let updatedesco_tot;
    let updatedesco_men;
    let updatedesco_wom;

    async function getesco(){
        console.log("fetching ..."+JSON.stringify(params.country)+JSON.stringify(params.year));
        const res =await fetch("/api/v2/esco/"+params.country);
        if(res.ok){
            const data = await res.json();
            esco = data;
            updatedCountry = esco.country;
            updatedYear= esco.year;
            updatedesco_tot= esco.esco_tot;
            updatedesco_men= esco.esco_men;
            updatedesco_wom= esco.esco_wom;
            console.log("Received country");
        }
    }

    async function updateesco(){
		console.log("Updating country...." + JSON.stringify(params.country));
		const res = await fetch("/api/v2/esco/" + params.country+"/"+updatedYear,{
			method: "PUT",
			body: JSON.stringify({
                country : params.country,
                year : esco.year,
                esco_tot : updatedesco_tot,
                esco_men : updatedesco_men,
                esco_wom : updatedesco_wom}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (res) {
            getesco(updatedYear);
		});
	}
</script>

<main>
    This is country {updatedCountry}

        {#await esco}
    loading
        {:then esco}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>Pais</th>
                    <th>Año</th>
                    <th>Escolarizacion totalt</th>
                    <th>Escolarizacion hombres</th>
                    <th>Escolarizacion mujeres</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                    <tr>
                        <td>{updatedCountry}</td>
                        <td>{updatedYear}</td>
                        <td><input bind:value="{updatedesco_tot}"></td>
                        <td><input bind:value="{updatedesco_men}"></td>
                        <td><input bind:value="{updatedesco_wom}"></td>
                        <td><Button outline color="primary" on:click={updateesco}>
                            Editar
                            </Button>
                        </td>
                    </tr>
            </tbody>
        </Table>
    {/await}
    



    <Button outline color="secondary" on:click="{pop}">Back</Button>
</main> 