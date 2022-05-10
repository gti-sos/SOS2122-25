<script>

    export let params={};
    import {pop} from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import {Button} from 'sveltestrap';
    import Table from 'sveltestrap/src/Table.svelte';
    import { Alert } from "sveltestrap";

    let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";

    let cancerdeaths={};

    
    let updatedCountry;
    let updatedYear;
    let updatedAgesZeroFifty;
    let updatedAgesFiftySeventy;
    let updatedAgesSeventy;

    onMount(getCancerdeaths);

	async function getCancerdeaths(){
		console.log("fetching cancerdeaths ....");
		const res= await fetch("/api/v1/cancerdeaths-stats/" +params.country+"/"+params.year);
		if(res.ok){
			const data= await res.json();
			cancerdeaths=data;
			updatedCountry=cancerdeaths.country;
            updatedYear=cancerdeaths.year;
            updatedAgesZeroFifty=cancerdeaths.ages_zero_fifty;
            updatedAgesFiftySeventy=cancerdeaths.ages_fifty_seventy;
            updatedAgesSeventy=cancerdeaths.ages_seventy;
		}else{
            Fallos(res.status,params.country);
            pop();
        }
	}

    async function EditCancerdeaths(){
        console.log("Updating Cancerdeaths...."+updatedCountry);
        const res = await fetch("/api/v1/cancerdeaths-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    ages_zero_fifty: updatedAgesZeroFifty,
                    ages_fifty_seventy: updatedAgesFiftySeventy,
                    ages_seventy: updatedAgesSeventy
                }),
				headers: {
					"Content-Type": "application/json"
				}
                
			}); 
            visibleError = false;
					visibleMsg = true;
					msg = updatedCountry+" se ha editado correctamente";
            //window.alert("Se ha editado correctamente");
    }
    async function Fallos(code,entrada){
        
        let msg;
        if(code == 404){
            msg = "No se encuentra "+entrada
        }
        if(code == 400){
            msg = "solicitud incorrecta"
        }
        if(code == 409){
            msg = "El dato introducido ya existe"
        }
        if(code == 401){
            msg = "No autorizado"
        }
        if(code == 405){
            msg = "Método no permitido"
        }
        window.alert(msg)
            return;
    }



    

</script>

<main>
    <h1> Editar "{params.country}" </h1>
    <Alert color="danger" isOpen={visibleError} toggle={() => (visibleError = false)}>
		{#if msg}
			<p>ERROR: {msg}</p>
		   {/if}
	</Alert>
	<Alert color="success" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>
		{#if msg}
			<p>Correcto: {msg}</p>
		{/if}
	</Alert>
    {#await cancerdeaths}
    loading
        {:then cancerdeaths}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Muertes 0-50 años</th>
                    <th>Muertes 50-70 años</th>
                    <th>Muertes 70 años</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{params.country}</td>
                    <td>{params.year}</td>
                    <td><input bind:value="{updatedAgesZeroFifty}"></td>
                    <td><input bind:value="{updatedAgesFiftySeventy}"></td>
                    <td><input bind:value="{updatedAgesSeventy}"></td>
    
                    <td><Button outline color="primary" on:click="{EditCancerdeaths}">
                        Editar
                        </Button>
                    </td>
                </tr>                
            </tbody>
        </Table>
    
    {/await}
    <Button outline color="secondary" on:click= "{pop}">Volver</Button> 
</main>