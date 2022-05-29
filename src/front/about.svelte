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


    <h3>Videos</h3>
    <p>- <a href="https://youtu.be/5HJVgtZk1V4">Enlace video  Damian Gonzalez Carrasco</a></p>
    <p>- <a href="https://www.youtube.com/watch?v=InXnaN-PVNU">Enlace video Angel Simon Mesa </a></p>
    <p>- <a href="https://github.com/adriperez01">Enlace video Adrián Pérez Gómez</a></p>
    <br>

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