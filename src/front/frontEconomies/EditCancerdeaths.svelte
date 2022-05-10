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

    let econos={};

    
    let updatedCountry;
    let updatedYear;
    let updatedpercapita;
    let updatedcurrency;
    let updatedcurrentprices;

    onMount(getEconomies);

	async function getEconomies(){
		console.log("fetching cancerdeaths ....");
		const res= await fetch("/api/v2/economies/" +params.country+"/"+params.year);
		if(res.ok){
			const data= await res.json();
			econos=data;
			updatedCountry=econos.country;
            updatedYear=econos.year;
            updatedpercapita=econos.percapita;
            updatedcurrency=econos.currency;
            updatedcurrentprices=econos.currentprices;
		}else{
            Fallos(res.status,params.country);
            pop();
        }
	}

    async function EditEconomies(){
        console.log("Updating economies...."+updatedCountry);
        const res = await fetch("/api/v2/economies/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    percapita: updatedpercapita,
                    currency: updatedcurrency,
                    currentprices: updatedcurrentprices
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
    {#await econos}
    loading
        {:then econos}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>percapita</th>
                    <th>currency</th>
                    <th>currentprices</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{params.country}</td>
                    <td>{params.year}</td>
                    <td><input bind:value="{updatedpercapita}"></td>
                    <td><input bind:value="{updatedcurrency}"></td>
                    <td><input bind:value="{updatedcurrentprices}"></td>
    
                    <td><Button outline color="primary" on:click="{EditEconomies}">
                        Editar
                        </Button>
                    </td>
                </tr>                
            </tbody>
        </Table>
    
    {/await}
    <Button outline color="secondary" on:click= "{pop}">Volver</Button> 
</main>