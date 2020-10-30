Promise.all([d3.json("airports.json"),
d3.json("world-110m.json", d3.autoType)]).then(data=>{
    let airports = data[0]; // data1.csv
    let worldmap = data[1];

  const features = topojson.feature(worldmap, worldmap.objects.countries).features;
  console.log('features', features);
  console.log("worldmap", worldmap);

  const width = 600;
  const height = 400;
  
  const projection = d3.geoMercator()
    .fitExtent([[0,0], [width,height]], topojson.feature(worldmap, worldmap.objects.countries));
  
  const path = d3.geoPath()
    .projection(projection);
  
  const svg = d3.select("body").append("svg")
    .attr("viewBox", [0,0,width,height]);
  
  svg.selectAll("path")
    .data(features)
    .join("path")
    .attr("d", path)
    .attr("fill", "black");
  
  svg.append("path")
    .datum(topojson.mesh(worldmap, worldmap.objects.countries))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path);
})

// d3.selectAll("#map").on("change", event =>{
//   visType = event.target.value
//   switchLayout();
// })

function switchLayout(){
  if (visType === "map"){
    	// stop the simulation
		// set the positions of links and nodes based on geo-coordinates
		// set the map opacity to 1
  } else { // force layout
		// restart the simulation
		// set the map opacity to 0
	}
}