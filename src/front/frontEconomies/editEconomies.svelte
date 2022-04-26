<script>
    import { onMount } from 'svelte'
    export let params={};
    import { pop } from "svelte-spa-router";
    import {Table , Button} from "sveltestrap";


    onMount(getEconomy);

    let economy ={};

    let updatedCountry;
    let updatedYear;
    let updatedPercapita;
    let updatedCurrency;
    let updatedCurrentPrices;

    async function getEconomy(){
        console.log("fetching ...");
        const res =await fetch("/api/v2/economies/"+params.country+"/2019");
        if(res.ok){
            const data = await res.json();
            economy = data;
            updatedCountry = economy.country;
            updatedYear= economy.year;
            updatedPercapita= economy.percapita;
            updatedCurrency= economy.currency;
            updatedCurrentPrices= economy.currentprices;
            console.log("Received country");
        }
    }

    async function updateEconomy(){
		console.log("Updating country...." + JSON.stringify(params.country));
		const res = await fetch("/api/v2/economies/" + params.country+"/"+updatedYear,{
			method: "PUT",
			body: JSON.stringify({
                country : params.country,
                year : updatedYear,
                percapita : updatedPercapita,
                currency : updatedCurrency,
                currentprices : updatedCurrentPrices}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (res) {
            getEconomy();
		});
	}
</script>

<main>
    This is country {updatedCountry}

        {#await economy}
    loading
        {:then economy}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>Pais</th>
                    <th>Año</th>
                    <th>PerCapita</th>
                    <th>currency</th>
                    <th>PreciosActual</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                    <tr>
                        <td>{updatedCountry}</td>
                        <td>{updatedYear}</td>
                        <td><input bind:value="{updatedPercapita}"></td>
                        <td><input bind:value="{updatedCurrency}"></td>
                        <td><input bind:value="{updatedCurrentPrices}"></td>
                        <td><Button outline color="primary" on:click={updateEconomy}>
                            Editar
                            </Button>
                        </td>
                    </tr>
            </tbody>
        </Table>
    {/await}
    



    <Button outline color="secondary" on:click="{pop}">Back</Button>
</main> 