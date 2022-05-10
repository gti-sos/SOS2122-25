<script>

    export let params={};
    import {pop} from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import {Button} from 'sveltestrap';
    import Table from 'sveltestrap/src/Table.svelte';
    import Alert from 'sveltestrap/src/Alert.svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';
    let airpollution={};

    
    let updatedCountry;
    let updatedYear;
    let updatedAgesZeroFifty;
    let updatedAgesFiftySeventy;
    let updatedAgesSeventy;
    
    let checkMSG = "";
    let visible = false;
    let color = "danger";

    onMount(getAirpollution);

	async function getAirpollution(){
		console.log("fetching Airpollution ....");
		const res= await fetch("/api/v1/air-pollution-stats/" +params.country+"/"+params.year);
		if(res.ok){
			const data= await res.json();
			airpollution=data;
			updatedCountry=airpollution.country;
            updatedYear=airpollution.year;
            updatedAgesZeroFifty=airpollution.ages_zero_fifty;
            updatedAgesFiftySeventy=airpollution.ages_fifty_seventy;
            updatedAgesSeventy=airpollution.ages_seventy;
		}else{
            Fallos(res.status,params.country);
            pop();
        }
	}

    async function EditAirpollution(){
        console.log("Updating Airpollution...."+updatedCountry);
        const res = await fetch("/api/v1/air-pollution-stats/"+params.country+"/"+params.year,
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
            color="success";
			checkMSG="Se ha editado correctamente";
			visible="true";
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
    <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
<<<<<<< HEAD
				  <DropdownItem href="./api/v2/economies">Economies-Stats</DropdownItem>
=======
				  <DropdownItem href="./api/v1/cancerdeaths-stats">Cancerdeaths-Stats</DropdownItem>
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/esco-stats">esco-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/air-pollution-stats">Airpollution-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
<<<<<<< HEAD
				  <DropdownItem href="./#/Cancerdeaths-stats">economies FRONT-END</DropdownItem>
=======
				  <DropdownItem href="./#/Cancerdeaths-stats">Cancerdeaths FRONT-END</DropdownItem>
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
				  <DropdownItem href="#/air-pollution-stats">AirPollution FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/analytics">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
<<<<<<< HEAD
				  <DropdownItem href="./#/economies-graph">economies-Stats</DropdownItem>
=======
				  <DropdownItem href="./#/cancerdeaths-graph">Cancerdeaths-Stats</DropdownItem>
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphAirPollution">AirPollution-Stats</DropdownItem>
                  <DropdownItem href="#/graph">Grafica comun</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/analytics">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
		  <!--<NavItem>
			<NavLink style="float:right; margin:left;" href="#/about">Acerca de</NavLink>
		  </NavItem>-->
		</Nav>
	</Navbar>
    <h1> Editar "{params.country}" </h1>
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
		{#if checkMSG}
			{checkMSG}
		{/if}
	</Alert>
    {#await airpollution}
    loading
        {:then airpollution}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
<<<<<<< HEAD
                    <th>Per capita</th>
                    <th>currency</th>
                    <th>currentprices</th>
=======
                    <th>Muertes 0-50 años</th>
                    <th>Muertes 50-70 años</th>
                    <th>Muertes 70 años</th>
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{params.country}</td>
                    <td>{params.year}</td>
                    <td><input bind:value="{updatedAgesZeroFifty}"></td>
                    <td><input bind:value="{updatedAgesFiftySeventy}"></td>
                    <td><input bind:value="{updatedAgesSeventy}"></td>
    
                    <td><Button outline color="primary" on:click="{EditAirpollution}">
                        Editar
                        </Button>
                    </td>
                </tr>                
            </tbody>
        </Table>
    
    {/await}
    <Button outline color="secondary" on:click= "{pop}">Volver</Button> 
</main>