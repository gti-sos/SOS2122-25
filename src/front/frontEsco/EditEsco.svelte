<script>
    export let params={};
    import {pop} from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import {Button} from 'sveltestrap';
    import Table from 'sveltestrap/src/Table.svelte';
    let esco={};
    
    let updatedCountry;
    let updatedYear;
    let updatedEsco_tot;
    let updatedEsco_men;
    let updatedEsco_wom;
    onMount(getesco);

	async function getesco(){
		console.log("fetching esco ....");
		const res= await fetch("/api/v1/esco-stats/" +params.country);
		if(res.ok){
			const data= await res.json();
			esco=data;
			updatedCountry=esco.country;
            updatedYear=esco.year;
            updatedEsco_tot=esco.esco_tot;
            updatedEsco_men=esco.esco_men;
            updatedEsco_wom=esco.esco_wom;
		}else{
            Fallos(res.status,params.country);
            pop();
        }
	}
    async function Editesco(){
        console.log("Updating esco...."+updatedCountry);
        const res = await fetch("/api/v1/esco-stats/"+params.country,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    esco_tot: updatedEsco_tot,
                    esco_men: updatedEsco_men,
                    esco_wom: updatedEsco_wom
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}); 
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
    {#await esco}
    loading
        {:then esco}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Escolarizacon total</th>
                    <th>Escolarizacion hombres</th>
                    <th>Escolarizacion mujeres</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td><input bind:value="{updatedYear}"></td>
                    <td><input bind:value="{updatedEsco_tot}"></td>
                    <td><input bind:value="{updatedEsco_men}"></td>
                    <td><input bind:value="{updatedEsco_wom}"></td>
    
                    <td><Button outline color="primary" on:click="{Editesco}">
                        Editar
                        </Button>
                    </td>
                </tr>                
            </tbody>
        </Table>
    
    {/await}
    <Button outline color="secondary" on:click= "{pop}">Back</Button> 
</main>