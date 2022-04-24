<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import { Alert,Pagination,NavItem,
        NavLink,
		Nav,
        PaginationItem,
        PaginationLink, } from 'sveltestrap';
    let expos = [];
	let newexpo = {
		country : "",
        year : "",
        expo_m : "",
        expo_tec : "",
        expo_bys : ""
	};
   //Pagination
   let current_offset = 2;
    let limit = 6;
    let current_page = 1;
    let last_page = 1;
    let total = 0;
    let visitado = "no";
    let alertError = "";
    let alertOk = "";
    let fullQuery = "";
    var queryT = "";
    let evictionsDataTocho = [];
	let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=6;
 
    onMount(getStats);
    async function getStats(){
        console.log("Fetching....");
        const res = await fetch("/api/v1/expo"); 
        if(res.ok){
            const data = await res.json();
            expos = data;
            console.log("Received STATS: "+expos.length);
        }else {
                checkMSG= res.status + ": Recursos no encontrados ";
                console.log("ERROR! no encontrado");
            }
    }
	async function getData() {
        console.log("Fetching data...");
        const res = await fetch(
            "api/v1/expo?limit=" + limit + "&offset=" + current_offset
        );
        if (res.ok) {
            console.log("Ok");
            const json = await res.json();
            expos = json;
            console.log(`We have received ${expos.length} resources.`);
        } else {
            console.log("Error");
        }
    }
	async function getDataSearch(query) {
        console.log("Fetching data...");
        const res = await fetch(
            "api/v1/expo" +query +
                "?limit=" +
                limit +
                "&offset=" +
                current_offset
        );
        if (res.ok) {
            console.log("Ok");
            const json = await res.json();
            expos = json;
            console.log(`We have received ${expos.length} resources.`);
        } else {
            console.log("Error");
        }
        //getNumDataSearch(query);
    }
	
	
	async function getNumDataSearch(query) {
        //botonCancelar();
        console.log(
            "LA QUERY: " +
                query +
                "LIMITE: " +
                limit +
                "OFFSET: " +
                current_offset
        );
        //const res = await fetch("api/v1/evictions" + query + "&limit=" + limit + "&offset="+current_offset);
        const res = await fetch("api/v1/expo" + query);
        if (res.ok) {
            const json = await res.json();
            total = json.length;
            console.log("Number of stats : " + total);
            queryT = query;
            console.log("queryT = " + queryT);
            changePageSearch(current_page, current_offset, query, total);
        } else if (res.status == 404) {
            total = 0;
            changePageSearch(current_page, current_offset, query, total);
        } else {
            alertError = "No se han encontrado datos.";
        }
    }
    function changePageSearch(page, offset, query, total) {
        console.log("------Change page------");
        console.log("Params page: " + page + " offset: " + offset);
        last_page = Math.ceil(total / 10);
        console.log("new last page: " + last_page);
        console.log(page, current_page, offset, query, total);
        if (page !== current_page) {
            current_offset = offset;
            current_page = page;
            console.log("page: " + page);
            console.log("current_offset: " + current_offset);
            console.log("current_page: " + current_page);
            console.log("la query es: " + query);
            getDataSearch(query);
        }
        console.log("---------Exit change page-------");
    }
    async function getNumData() {
        const res = await fetch("api/v1/expo-stats");
        if (res.ok) {
            const json = await res.json();
            total = json.length;
            console.log("Number of stats : " + total);
            changePage(current_page, current_offset);
        } else if (res.status == 404) {
            total = 0;
            changePage(current_page, current_offset);
        } else {
            alertError = "No se han encontrado datos.";
        }
    }
    //Calcula el rango entre dos valores
    function range(size, startAt = 0) {
        return [...Array(size).keys()].map((i) => i + startAt);
    }
    function changePage(page, offset) {
        console.log("------Change page------");
        console.log("Params page: " + page + " offset: " + offset);
        last_page = Math.ceil(total / 10);
        console.log("new last page: " + last_page);
        if (page !== current_page) {
            current_offset = offset;
            current_page = page;
            console.log("page: " + page);
            console.log("current_offset: " + current_offset);
            console.log("current_page: " + current_page);
            //NUEVO
            var campos = new Map(
                Object.entries(newexpo).filter((o) => {
                    return o[1] != "";
                })
            );
            let querySymbol = "?";
            for (var [clave, valor] of campos.entries()) {
                querySymbol += clave + "=" + valor + "&";
            }
            fullQuery = querySymbol.slice(0, -1);
            if (fullQuery != "") {
                searchData();
            } else {
                getData();
                getNumData();
            }
        }
        console.log("---------Exit change page-------");
    }
    async function searchData() {
        visitado = "si";
        console.log("Searching data...");
        var campos = new Map(
            Object.entries(newexpo).filter((o) => {
                return o[1] != "";
            })
        );
        let querySymbol = "?";
        let aux = "";
        for (var [clave, valor] of campos.entries()) {
            querySymbol += clave + "=" + valor + "&";
            if (clave == "year") {
                aux = aux + "Año=" + valor + " ";
            } else if (clave == "country") {
                aux = aux + "Localización=" + valor + " ";
			}
        }
        fullQuery = querySymbol.slice(0, -1);
        if (fullQuery != "") {
            const limityOffset =
                "?limit=" + limit + "&offset=" + current_offset;
            const res = await fetch(
                "api/v1/expo-stats" + fullQuery + limityOffset
            );
            console.log("FULL QUERY: " + fullQuery + limityOffset);
            if (res.ok) {
                console.log("OK");
                const json = await res.json();
                evictionsDataTocho = expos;
                expos = json;
                console.log(
                    `We have received ${expos.length} resources.`
                );
                alertError = "";
                alertOk = "Búsqueda realizada con éxito: " + aux;
            } else {
                if (res.status == 404) {
                    alertOk = "";
                    alertError = "No se encuentra el dato solicitado: " + aux;
                } else if (res.status == 500) {
                    alertOk = "";
                    alertError = "No se han podido acceder a la base de datos";
                }
                alertOk = "";
                console.log("Error: " + alertError);
            }
        } else {
            alertError = "";
            alertOk = "Búsqueda realizada con éxito";
            //getDataSearch();
            //getData();
        }
        getNumDataSearch(fullQuery);
        //getNumData(fullQuery);
    }
	/*
    function botonCancelar() {
        var cancelar = document.getElementById("cancelar").innerHTML;
        console.log("Boton cancelar " + cancelar);
        document.getElementById("cancelar").innerHTML =
            '<button style="border-radius:5px; margin-left:18px; padding:10px 8px; background-color: #dc3545; color:#fff; border-color: #dc3545;" onClick="window.location.reload();">Cancelar</button>';
    }
	*/
	async function LoadStats(){
        console.log("Loading stats....");
        
        await fetch("/api/v1/expo/loadInitialData");
        const res2 = await fetch("api/v1/expo/loadInitialData" + "?limit=10&offset=0");
        if (res2.ok) {
            console.log("Ok:");
            const json = await res2.json();
            expos = json;
            visible = true;
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + "Los datos no se han podido cargar";
            console.log("ERROR! ");
        }
    }
	async function insertStat(){
		console.log("Inserting new Stat: "+JSON.stringify(newexpo));
        const res = await fetch("/api/v1/expo",
					{
						method: "POST",
						body: JSON.stringify(newexpo),
						headers: {
							"Content-Type":"application/json"
						}
					}).then(function (res){
						Errores(res.status);
					}); 
					
		console.log("Done.");
	}
	async function 	DeleteStats(){
	console.log("Deleting stats....");
    const res = await fetch("/api/v1/expo/",
		{
			method: "DELETE"
		}).then(function (res){
			getStats();
			
		});	
	}
	async function DeleteStat(country, year){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/expo/"+country+"/"+year,
			{
				method: "DELETE"
			}).then(function (res){
				getStats();
				if (res.status==200) {
                totaldata--;
                color = "success";
                checkMSG = "Recurso "+country+" "+year+ " borrado correctamente";
                console.log("Deleted " + country);            
            } else if (res.status==404) {
                color = "danger";
                checkMSG = "No se ha encontrado el objeto " + country;
                console.log("Resource NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
            }     
				
				//window.alert("Registro Eliminado");
			});
		
    }
</script>

<main>


{#await expos}	
loading
	{:then stats}
	
	
	<Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if checkMSG}
		    {checkMSG}
	    {/if}
    </Alert>
	<Table bordered responsive>
		<thead>
			<tr>
				<th>País</th>
				<th>Año</th>
				<th>Exportaciones Tec.</th>
				<th>Exportaciones de prod. manuf.</th>
                <th>Exportaciones de bienes y servicios</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newexpo.country}"></td>
				<td><input bind:value="{newexpo.year}"></td>
				<td><input bind:value="{newexpo.expo_tec}"></td>
                <td><input bind:value="{newexpo.expo_m}"></td>
				<td><input bind:value="{newexpo.expo_bys}"></td>

				<td><Button outline color="primary" on:click="{insertStat}">
					Añadir
					</Button>
				</td>
				<td><Button color="primary" on:click={searchData}>Buscar</Button></td>

			</tr>
			{#each expos as expo}
				<tr>
					<td><a href="#/ExpoTable/{expo.country}">{expo.country}</a></td>
					<td>{expo.year}</td>
					<td>{expo.expo_tec}</td>
                    <td>{expo.expo_m}</td>
                    <td>{expo.expo_bys}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/ExpoTable/${expo.country}/${expo.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={DeleteStat(expo.country,expo.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadStats}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={DeleteStats}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>

<div class="paginacion">
	<Pagination ariaLabel="Web pagination">
		<PaginationItem class={current_page == 1 ? "disabled" : ""}>
			<PaginationLink	
				previous
				href="#/ExpoTable"
				on:click={() =>
					changePage(current_page - 1, current_offset - 10)}
			/>
		</PaginationItem>
		{#each range(last_page, 1) as page}
			<PaginationItem
				class={current_page == page ? "active" : ""}
			>
				<PaginationLink
					previous
					href="#/ExpoTable"
					on:click={() => changePage(page, (page - 1) * 10)}
					>{page}</PaginationLink
				>
			</PaginationItem>
		{/each}
		<PaginationItem
			class={current_page == last_page ? "disabled" : ""}
		>
			<PaginationLink
				next
				href="#/ExpoTable"
				on:click={() =>changePage(current_page + 1, current_offset + 10)}/>
		</PaginationItem>
	</Pagination>
</div>
{/await}
    

</main>