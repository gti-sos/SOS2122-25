<script>

    export let params={};
    import {pop} from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import {Button} from 'sveltestrap';
    import Table from 'sveltestrap/src/Table.svelte';
    import Alert from 'sveltestrap/src/Alert.svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';
    
    
    let esco={};

    let checkMSG = "";
    let visible = false;
    let color = "danger";

    
    let updatedCountry;
    let updatedYear;
    let updatedtot_wom;
    let updatedtot_man;
    let updatedtot_esco;

    onMount(getesco);

	async function getesco(){
		console.log("fetching esco ....");
		const res= await fetch("/api/v1/esco-stats/" +params.country +"/"+params.year);
		if(res.ok){
			const data= await res.json();
			esco=data;
			updatedCountry=esco.country;
            updatedYear=esco.year;
            updatedtot_wom=esco.tot_wom;
            updatedtot_man=esco.tot_man;
            updatedtot_esco=esco.tot_esco;
		}else{
            Fallos(res.status,params.country);
            pop();
        }
	}

    async function Editesco(){
        console.log("Updating esco...."+updatedCountry);
        const res = await fetch("/api/v1/esco-stats/"+params.country +"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    tot_wom: parseInt(updatedtot_wom),
                    tot_man: parseInt(updatedtot_man),
                    tot_esco: parseInt(updatedtot_esco)
                }),
				headers: {
					"Content-Type": "application/json"
				}
			});
            color="success";
			checkMSG="Se ha editado correctamente";
			visible="true";
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
    <Navbar style="background-color: lightgreen; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./api/v2/economies">economies</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/esco-stats">esco-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/expo-stats">expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">Economies FRONT-END</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="#/expo-stats">expo FRONT-END</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">economies</DropdownItem>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphexpo">expo-Stats</DropdownItem>
                  <DropdownItem divider/>
                  <DropdownItem href="./#/graph">Grafica comun</DropdownItem>
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
    {#await esco}
    loading
        {:then esco}
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Escolarizacion total</th>
                    <th>Escolarizacion hombres</th>
                    <th>Escolarizacion mujeres</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{params.country}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedtot_wom}"></td>
                    <td><input bind:value="{updatedtot_man}"></td>
                    <td><input bind:value="{updatedtot_esco}"></td>
    
                    <td><Button outline color="primary" on:click="{Editesco}">
                        Editar
                        </Button>
                    </td>
                </tr>                
            </tbody>
        </Table>
    
    {/await}
    <Button outline color="secondary" on:click= "{pop}">Volver</Button> 
</main>