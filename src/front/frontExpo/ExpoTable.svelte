<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

	let expo=[];
	let newexpo= {
		country: "",
		year: "",
		percapita: "",
		currency: "",
		currentprices:""
		
	};


	let from = "";
	let to = "";
	let offset = 0;
	let page = 1;
	let maxPages = 0;
    let numPage = 0;
    let year1 = "";
    let totaldata=11;

	let loading = true;

	onMount(getexpo);

	async function getexpo(){
		console.log("fetching ...");
		const res =await fetch("/api/v1/expo");
		if(res.ok){
			const data = await res.json();
			expo = data;
			console.log("Received countries: "+expo.length);
		}
	}
    async function searchyear(year){
        
        const res = await fetch("api/v1/expo?year="+year1);
        if(res.ok){
            const json = await res.json();
            expo=json;
            console.log("Found "+ expo.length + " countries");
        }    
    }

	async function maxPagesFunction(total){
		maxPages = Math.floor(total/10);
		if(maxPages === total/10){
			maxPages = maxPages-1;
		}
	}


	async function insertexpo(){
		console.log("Insterting expo:"+JSON.stringify(newexpo));
		const res =await fetch("/api/v1/expo",
					{
						method: "POST",
						body: JSON.stringify(newexpo),
						headers: {
							"Content-type":"application/json"
						}

					}).then(function(res){
						getexpo();
					});
		console.log("DONE");
	}


	async function Borrarexpos(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/expo/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getexpo();
				window.alert("Entrada eliminada con éxito");
			});
    }

	async function Borrarexpo(){
        console.log("Deleting expo....");
        const res = await fetch("/api/v1/expo",
			{
				method: "DELETE"
			}).then(function (res){
				getexpo();
				window.alert("Entradas elimidas con éxito");
			});
    }


	async function Loadexpo(){
        console.log("Loading expo....");
        const res = await fetch("/api/v1/expo/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getexpo();
				window.alert("Entradas cargadas con éxito");
			});
    }
    async function getPreviewPage() {
        console.log(totaldata);
        if (page-10 > 1) {
            page-=5; 
        } else page = 1
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v1/expo?limit=10&offset="+(-1+page));
        
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            expo = json;
            console.log("Received "+expo.length+" resources.");
        } else {
            checkMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
        numPage = Math.round(page/10);
    }
    async function getNextPage() {
        console.log(totaldata);
        if (page+10 > totaldata) {
            page = 1
        } else {
            page+=10
        }
        numPage = Math.round(page/10);
        
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v1/expo?limit=10&offset="+(-1+page));

        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            expo = json;
            console.log("Received " + expo.length + " resources.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
</script>
<main>
{#await expo}	
loading
	{:then expo}
	
    <Table>
        <thead>
            <tr>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input bind:value={from} type="number"/></td>
                <td><input bind:value={to} type="number"/> </td>
                <td><Button color="dark" on:click={getexpo(`?from=${from}&to=${to}`,true)}>Buscar</Button></td>
                <td>
                    <Button color="outline-dark" on:click="{
                        ()=>{from = null; to = null; getexpo();}
                    }">Limpiar Busqueda</Button>
                </td>
            </tr>
        </tbody>
    </Table>

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

				<td><Button outline color="primary" on:click="{insertexpo}">
					Añadir
					</Button>
				</td>

			</tr>
			{#each expo as expo}
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
					<td><Button outline color="danger" on:click={Borrarexpos(expo.country,expo.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={Loadexpo}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={Borrarexpo}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
    <Button id ="atrasbtn" on:click="{getPreviewPage}">
        Atrás
    </Button>
    <Button id ="siguientebtn" on:click="{getNextPage}">
        Siguiente
    </Button>
    <div align="center">
        Página {numPage} 
    </div>
{/await}
</main>