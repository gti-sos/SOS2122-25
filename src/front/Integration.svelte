<script>  
	import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
</script>


<body>
    <Navbar style="background-color: lightgreen; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./api/v2/economies">economies-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/esco-stats">esco-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/expo">Expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">economies FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/esco-stats">esco FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/expo">Expo FRONT-END</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
		  <Dropdown >
			<DropdownToggle nav caret> Gráficas </DropdownToggle>
			<DropdownMenu end>
			  <DropdownItem href="./#/economies-graph">economies-Stats</DropdownItem>
			  <DropdownItem divider/>
			  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
			  <DropdownItem divider/>
			  <DropdownItem href="#/graphexpo">Expo-Stats</DropdownItem>
			  <DropdownItem divider/>
            	<DropdownItem href="./#/graph">Grafica comun</DropdownItem>
			</DropdownMenu>
		  </Dropdown>
		  <!--<NavItem>
			<NavLink style="float:right; margin:left;" href="#/about">Acerca de</NavLink>
		  </NavItem>-->
		</Nav>
	</Navbar>
  </body>
<main>
    <h3>Integraciones Damián González Carrasco:</h3>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion1">https://SOS2122-25.herokuapp.com/#/economies/integracion1 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion2">https://SOS2122-25.herokuapp.com/#/economies/integracion2 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion3">https://SOS2122-25.herokuapp.com/#/economies/integracion3 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion4">https://SOS2122-25.herokuapp.com/#/economies/integracion4 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion5">https://SOS2122-25.herokuapp.com/#/economies/integracion5 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion6">https://SOS2122-25.herokuapp.com/#/economies/integracion6 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion7">https://SOS2122-25.herokuapp.com/#/economies/integracion7 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/economies/integracion8">https://SOS2122-25.herokuapp.com/#/economies/integracion8 </a></p>
    <br>
    <h3>Integraciones Adrián Pérez:</h3>
	<h5>APIs Internas</h5>	
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExpo1">https://SOS2122-25.herokuapp.com/#/expo/IntegrationExpo1 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExpo2">https://SOS2122-25.herokuapp.com/#/expo/integrationExpo2 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExpo3">https://SOS2122-25.herokuapp.com/#/expo/IntegrationExpo3 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExpo4">https://SOS2122-25.herokuapp.com/#/expo/integrationExpo4 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExpo5">https://SOS2122-25.herokuapp.com/#/expo/integrationExpo5 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExpo6">https://SOS2122-25.herokuapp.com/#/expo/integrationExpo6 </a></p>
	<h5>APIs Externas</h5>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExt1">https://SOS2122-25.herokuapp.com/#/expo/integrationExt1 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/expo/integrationExt2">https://SOS2122-25.herokuapp.com/#/expo/IntegrationExt2 </a></p>
    <br>
	<h3>Integraciones Ángel Simón Mesa:</h3>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration1">https://SOS2122-25.herokuapp.com/#/integration1 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration2">https://SOS2122-25.herokuapp.com/#/integration2 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration3">https://SOS2122-25.herokuapp.com/#/integration3 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration4">https://SOS2122-25.herokuapp.com/#/integration4 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration5">https://SOS2122-25.herokuapp.com/#/integration5 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration5b">https://SOS2122-25.herokuapp.com/#/integration5b </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration6">https://SOS2122-25.herokuapp.com/#/integration6 </a></p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/#/integration7">https://SOS2122-25.herokuapp.com/#/integration7 </a></p>
</main>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>