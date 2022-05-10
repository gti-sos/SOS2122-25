<script>  
	import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
</script>


<body>
    <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
<<<<<<< HEAD
				  <DropdownItem href="./api/v2/economies">economies-Stats</DropdownItem>
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
				  <DropdownItem divider/>
				  <DropdownItem href="./#/esco-stats">esco FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/air-pollution-stats">AirPollution FRONT-END</DropdownItem>
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
			  <DropdownItem divider/>
			  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
			  <DropdownItem divider/>
			  <DropdownItem href="#/graphAirPollution">AirPollution-Stats</DropdownItem>
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
    <p>- <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a>(fuente de datos: <a href="https://ourworldindata.org/cancer#deaths-from-cancer">Cancerdeaths-stats</a>)</p>
    <p>- <a href="https://github.com/AngelSM11">Angel Simon Mesa </a> (fuente de datos: <a href="https://ourworldindata.org/esco">esco-stats</a>)</p>
<<<<<<< HEAD
    <p>- <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castelló</a>(fuente de datos: AirPollution-stats)</p>
=======
    <p>- <a href="https://github.com/adrmg">Adrian Perez Gomez</a>(fuente de datos: AirPollution-stats)</p>
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
    <br>
    <h3>Project description:</h3> Nuestras fuentes de información esta orientadas a analizar la relación que existe entre la tasa de escolarizacion, la tasa de muertes por cancer y la contaminacion del aire en interiores. 
    <br><br>
    <h3>Repository:</h3><a href="https://github.com/gti-sos/SOS2122-25.git">gti-sos/SOS2122-25</a>
    <br><br>
    <h3>URL:</h3><a href="http://SOS2122-25.herokuapp.com">http://SOS2122-25.herokuapp.com</a>
    <br><br>
    <h3>Documentos POSTMAN:</h3>
<<<<<<< HEAD
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v2/economies/docs">https://SOS2122-25.herokuapp.com/api/v2/economies/docs </a>(developed by <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a>)</p>
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/esco-stats/docs">https://SOS2122-25.herokuapp.com/api/v1/esco-stats/docs </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats/docs">https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats/docs </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castelló</a>)</p>
    <br>
	<h3>APIS:</h3>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v2/economies">https://SOS2122-25.herokuapp.com/api/v2/economies </a>(developed by <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>)</p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/esco-stats">https://SOS2122-25.herokuapp.com/api/v1/esco-stats </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats">https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castello</a>)</p>
    <br>
    <h3>FRONT-END:</h3>
	<p>- <a href="#/Cancerdeaths-stats">https://SOS2122-25.herokuapp.com/#/Cancerdeaths-stats </a>(developed by <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>)</p>
	<p>- <a href="#/esco-stats">https://SOS2122-25.herokuapp.com/#/esco-stats </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
	<p>- <a href="#/air-pollution-stats">https://SOS2122-25.herokuapp.com/#/air-pollution-stats </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castello</a>)</p>
    <br>
    <h3>GÁFRICAS:</h3>
    <p>- <a href="./#/economies-graph">https://SOS2122-25.herokuapp.com/#/economies-graph </a>(developed by <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>)</p>
    <p>- <a href="./#/graphesco">https://SOS2122-25.herokuapp.com/#/graphesco </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
    <p>- <a href="#/air-pollution-stats">https://SOS2122-25.herokuapp.com/#/air-pollution-stats </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castello</a>)</p>
=======
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/cancerdeaths-stats/docs">https://SOS2122-25.herokuapp.com/api/v1/cancerdeaths-stats/docs </a>(developed by <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a>)</p>
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/esco-stats/docs">https://SOS2122-25.herokuapp.com/api/v1/esco-stats/docs </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
    <p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats/docs">https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats/docs </a>(developed by <a href="https://github.com/adrmg">Adrian Perez Gomez</a>)</p>
    <br>
	<h3>APIS:</h3>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/cancerdeaths-stats">https://SOS2122-25.herokuapp.com/api/v1/cancerdeaths-stats </a>(developed by <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a>)</p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/esco-stats">https://SOS2122-25.herokuapp.com/api/v1/esco-stats </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
	<p>- <a href="https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats">https://SOS2122-25.herokuapp.com/api/v1/air-pollution-stats </a>(developed by <a href="https://github.com/adrmg">Adrian Perez Gomez</a>)</p>
    <br>
    <h3>FRONT-END:</h3>
	<p>- <a href="#/Cancerdeaths-stats">https://SOS2122-25.herokuapp.com/#/Cancerdeaths-stats </a>(developed by <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a>)</p>
	<p>- <a href="#/esco-stats">https://SOS2122-25.herokuapp.com/#/esco-stats </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
	<p>- <a href="#/air-pollution-stats">https://SOS2122-25.herokuapp.com/#/air-pollution-stats </a>(developed by <a href="https://github.com/adrmg">Adrian Perez Gomez</a>)</p>
    <br>
    <h3>GÁFRICAS:</h3>
    <p>- <a href="./#/cancerdeaths-graph">https://SOS2122-25.herokuapp.com/#/cancerdeaths-graph </a>(developed by <a href="https://github.com/damiangc99">Damian Gonzalez Carrasco</a>)</p>
    <p>- <a href="./#/graphesco">https://SOS2122-25.herokuapp.com/#/graphesco </a>(developed by <a href="https://github.com/AngelSM11">Angel Simon Mesa</a>)</p>
    <p>- <a href="#/air-pollution-stats">https://SOS2122-25.herokuapp.com/#/air-pollution-stats </a>(developed by <a href="https://github.com/adrmg">Adrian Perez Gomez</a>)</p>
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
	<p>- <a href="./#/graph">https://SOS2122-25.herokuapp.com/#/graph </a></p>
</main>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
    h1 {
		color: #ff3e00;
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
