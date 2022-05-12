<script>

    export let params={};
    import {pop} from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import {Button} from 'sveltestrap';
    import Table from 'sveltestrap/src/Table.svelte';
    import Alert from 'sveltestrap/src/Alert.svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';
    let expo={};

    
    let updatedCountry;
    let updatedYear;
    let updatedExpoTec;
    let updatedExpoM;
    let updatedExpoByS;
    
    let checkMSG = "";
    let visible = false;
    let color = "danger";

    onMount(getExpo);

	async function getExpo(){
		console.log("fetching expos ....");
		const res= await fetch("/api/v1/expo/" +params.country+"/"+params.year);
		if(res.ok){
			const data= await res.json();
			expo=data;
			updatedCountry=expo.country;
            updatedYear=expo.year;
            updatedExpoTec=expo.expo_tec;
            updatedExpoM=expo.expo_m;
            updatedExpoM=expo.expo_bys;
		}else{
            Fallos(res.status,params.country);
            pop();
        }
	}

    async function EditExpo(){
        console.log("Updating expo...."+updatedCountry);
        const res = await fetch("/api/v1/expo/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    expo_tec: updatedExpoTec,
                    expo_m: updatedExpoM,
                    expo_bys: updatedExpoM
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
				  <DropdownItem href="./api/v2/economies">Economies-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/esco-stats">esco-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/expo">expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">economies FRONT-END</DropdownItem>
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
				  <DropdownItem href="#/expo">expo FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">economies-Stats</DropdownItem>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphexpo">expo-Stats</DropdownItem>
                  <DropdownItem href="#/graph">Grafica comun</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
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
    {#await expo}
    loading
        {:then expo}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Exportaciones Tecnológicas</th>
                    <th>Exportaciones Productos Manufacturados</th>
                    <th>Exportaciones Bienes y Servicios</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{params.country}</td>
                    <td>{params.year}</td>
                    <td><input bind:value="{updatedExpoTec}"></td>
                    <td><input bind:value="{updatedExpoM}"></td>
                    <td><input bind:value="{updatedExpoM}"></td>
    
                    <td><Button outline color="primary" on:click="{EditExpo}">
                        Editar
                        </Button>
                    </td>
                </tr>                
            </tbody>
        </Table>
    
    {/await}
    <Button outline color="secondary" on:click= "{pop}">Volver</Button> 
</main>