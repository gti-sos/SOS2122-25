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
    <h1>SOS2122-25</h1>

    <h3>Team</h3>
    <p>- <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a></p>
    <p>- <a href="https://github.com/AngelSM11">Angel Simon Mesa </a> </p>
    <p>- <a href="https://github.com/adriperez01">Adrián Pérez Gómez</a></p>
    <br>
    <h3>Project description:</h3> Nuestras fuentes de información esta orientadas a analizar la relación que existe entre las exportaciones. 
    <br><br>
    <h3>Repository:</h3><a href="https://github.com/gti-sos/SOS2122-25.git">gti-sos/SOS2122-25</a>
    <br><br>
    <h3>URL:</h3><a href="http://SOS2122-25.herokuapp.com">http://SOS2122-25.herokuapp.com</a>
    <br><br>
    <h3>Documentos POSTMAN:</h3>
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v2/economies/docs">https://SOS2122-25.herokuapp.com/api/v2/economies/docs </a>(developed by <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a>)</p>
    <p>- <a href="https://documenter.getpostman.com/view/19481634/UyxjFko9">https://SOS2122-25.herokuapp.com/api/v1/esco-stats/docs </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/expo/docs">https://SOS2122-25.herokuapp.com/api/v1/expo/docs </a>(developed by <a href="https://github.com/adriperez01">Adrián Pérez Gómez</a>)</p>
    <br>
	<h3>APIS:</h3>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v2/economies">https://SOS2122-25.herokuapp.com/api/v2/economies </a>(developed by <a href="https://github.com/Damiangc99">Damiangc99</a>)</p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/esco-stats">https://SOS2122-25.herokuapp.com/api/v1/esco-stats </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/expo">https://SOS2122-25.herokuapp.com/api/v1/expo </a>(developed by <a href="https://github.com/adriperez01">Adrián Pérez Gómez</a>)</p>
    <br>
    <h3>FRONT-END:</h3>
	<p>- <a href="#/economies">https://SOS2122-25.herokuapp.com/#/economies </a>(developed by <a href="https://github.com/Damiangc99">Damiangc99</a>)</p>
	<p>- <a href="#/esco-stats">https://SOS2122-25.herokuapp.com/#/esco-stats </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
	<p>- <a href="#/expo">https://SOS2122-25.herokuapp.com/#/expo </a>(developed by <a href="https://github.com/adriperez01">Adrián Pérez Gómez</a>)</p>
    <br>
    <h3>GRÁFICAS:</h3>
    <p>- <a href="./#/economies-graph">https://SOS2122-25.herokuapp.com/#/economies-graph </a>(developed by <a href="https://github.com/Damiangc99">Damiangc99</a>)</p>
    <p>- <a href="./#/graphesco">https://SOS2122-25.herokuapp.com/#/graphesco </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
    <p>- <a href="#/graphexpo">https://SOS2122-25.herokuapp.com/#/graphexpo </a>(developed by <a href="https://github.com/adriperez01">Adrián Pérez Gómez</a>)</p>
	<br>
	<h3>GRÁFICA COMÚN:</h3>
	<p>- <a href="./#/graph">https://SOS2122-25.herokuapp.com/#/graph </a></p>
	<br>
	<h3><a href="https://SOS2122-25.herokuapp.com/#/integration">INTEGRACIONES</a></h3>
	<br>
	<h3><a href="https://SOS2122-25.herokuapp.com/#/about">VIDEOS</a></h3>
</main>
<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
    h1 {
		color: brown;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
