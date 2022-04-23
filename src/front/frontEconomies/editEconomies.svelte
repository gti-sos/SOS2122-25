<script>
    import { onMount } from 'svelte'
    let params={};
    import { pop } from "svelte-spa-router";
    import {Table , Button} from "sveltestrap";


    onMount(getEconomy);

    let economy ={};

    let updatedCountry;
    let updateYear;
    let updatePercapita;
    let updateCurrency;
    let updateCurrentPrices;

    async function getEconomy(){
        console.log("fetching ...");
        const res =await fetch("/api/v1/economies/"+countryName);
        if(res.ok){
            const data = await res.json();
            economy = data;
            updatedCountry = economy.country;
            updatedYear= economy.year;
            updatePercapita= economy.percapita;
            updateCurrency= economy.currency;
            updateCurrentPrices= economy.currentprices;
            console.log("Received country");
        }

    }
</script>

<main>
    This is country {params.countryName};

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
                        <td><input bind:value="{updatedCountry}"></td>
                        <td><input bind:value="{updateYear}"></td>
                        <td><input bind:value="{updatePercapita}"></td>
                        <td><input bind:value="{updateCurrency}"></td>
                        <td><input bind:value="{updateCurrentPrices}"></td>
                    </tr>
            </tbody>
        </Table>
    {/await}
    



    <Button outline color="secondary" on:click="{pop}">Back</Button>
</main> 