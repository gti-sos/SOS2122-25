<script>
    import { onMount } from 'svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

   
    let expos = [];
    let escos = [];
    let economies = [];

    let country= [];
    let year = [];
    let tot_esco = [];
    let tot_wom =[];
    let tot_man=[];
    let expo_m = [];
    let expo_tec = [];
    let percapita = [];
    let currency = [];
    let currentprices = [];
    let ages1 =[];
    let ages2=[];
    let ages3=[];
    async function loadGraph(){
        const res1= await fetch("/api/v1/expo");
        const res2= await fetch("/api/v2/economies");
        const res3= await fetch("/api/v1/esco-stats");
        if(res1.ok && res2.ok && res3.ok){
            const data1 = await res1.json();
            const data3 = await res2.json();
            const data2 = await res3.json();
            expos = data1;
            console.log("Recibido: "+expos.length);
            //inicializamos los arrays para mostrar los datos
            expos.forEach(expo => {
                //country.push(expo.country+"-"+expo.year);
                //year.push(expo.year);
                ages1.push(expo.expo_m+expo.expo_tec);
                expo_m.push(expo.expo_m);
                expo_tec.push(expo.expo_tec);   
            });

            economies=data3;
            console.log("Recibido: " + economies.length);
            economies.forEach(economies=>{
                percapita.push(economies.percapita);
                currency.push(economies.currency);
                ages3.push(economies.percapita+economies.currency+economies.currentprices);
                currentprices.push(economies.currentprices);
            });
            
            escos=data2;
            console.log("Recibido: " + escos.length);
            escos.forEach(esco=>{
                year.push(esco.year);
                country.push(esco.country+"-"+esco.year);
                tot_wom.push(esco.tot_wom);
                tot_man.push(esco.tot_man);
                ages2.push(esco.tot_esco+esco.tot_man+esco.tot_wom);
                tot_esco.push(esco.tot_esco);
            });



        }else{
            console.log("Error in request");
        }
    

    

        Highcharts.chart('container', {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Economia escolarizacion exportaciones'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            xAxis: {
                type: "category",
                categories: country
            },
            yAxis: {
                title: {
                    text: 'units'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Economies',
                data: ages3
            }, {
                name: 'esco',
                data: ages2
            },{
                name: 'expo',
                data: ages1                
            }]
        });

    }
   
    onMount(loadGraph);
</script>
<svelte:head>


    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>

<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Basic line chart showing trends in a dataset. This chart includes the
            <code>series-label</code> module, which adds a label to each line for
            enhanced readability.
        </p>
    </figure>

</main>
