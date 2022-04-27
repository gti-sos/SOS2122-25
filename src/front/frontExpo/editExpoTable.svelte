<script>
    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import { Alert } from 'sveltestrap';
    let visible = false;
    let color = "danger";
    let entry = {};
    let updatedCountry;
    let updatedYear;
    let updatedExpoTec;
    let updatedExpoM;
    let updatedExpoByS;
    let errorMsg = "";
    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/expo/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedExpoTec = entry.expo_tec;
            updatedExpoM = entry.expo_m;
            updatedExpoByS = entry.expo_bys;
        }else{
            visible = true;
            color = "danger"
            errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.country +" " + params.year;
            console.log("ERROR" + errorMsg);
        }
    }
    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v1/expo/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: parseInt(updatedYear),
                    expo_tec: parseFloat(updatedExpoTec),
                    expo_m: parseFloat(updatedExpoM),
                    expo_bys: parseFloat(updatedExpoByS)
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
                    visible = true;
                    if(res.status == 200){
                        getEntries(); 
                        console.log("Data introduced");
                        color = "success";
                        errorMsg="Recurso actualizado correctamente";
                    }else{
                        console.log("Data not edited");
                        color = "danger";
                        errorMsg= "Compruebe los campos";
                    }
                });	
    }
</script>

<main>
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMsg}
		    {errorMsg}
	    {/if}
    </Alert>

    <h1>Editar entrada "{params.country}","{params.year}"</h1>
    {#await entry}
    loading
        {:then entry}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Exportaciones Tecnológicas</th>
                    <th>Exportaciones Prod. Manufacturados</th>
                    <th>Exportaciones Bienes y Servicios</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input bind:value="{updatedCountry}"></td>
                    <td><input bind:value = "{updatedYear}"></td>
                    <td><input bind:value="{updatedExpoTec}"></td>
                    <td><input bind:value="{updatedExpoM}"></td>
                    <td><input bind:value="{updatedExpoByS}"></td>
                    <td><Button outline color="primary" on:click="{EditEntry}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>
    </main>
 