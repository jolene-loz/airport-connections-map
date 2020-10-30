Promise.all([d3.json("airports.json"),
d3.json("world-110m.json", d3.autoType)]).then(data=>{
    let airports = data[0]
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
    
    d3.selectAll("input[name=display]").on("change", event =>{
      // data1.csv
      visType = event.target.value
      console.log("vistype", visType)
      
      switchLayout();
    })

  drawMap();

  function drawMap(){
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
  }

  function switchLayout(){
    if (visType === "map"){
      
        // stop the simulation
      // set the positions of links and nodes based on geo-coordinates
      //=== Nodes === 
      let nodes = data[0].nodes
      let link = data[0].links

      node.attr("cx", function(d) {
        return projection([d.longitude, d.latitude])[0];
      })

      

      svg
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", "orange");

        //=== Links === 
        svg
          .selectAll(".link")
          .data(links)
          .enter()
          .append("line")
          .attr("stroke", "black")
          .attr("class", "link")

      svg.selectAll("path")
            .attr("opacity", 1);
      

      // set the map opacity to 1
    } else { // force layout
      console.log("Force")

       
    //=== Force Simulation ===
    let simulation = d3.forceSimulation(data[0].nodes)
    .force("charge", d3.forceManyBody().strength(-25))
    .force("link", d3.forceLink(data[0].links).distance(50))
    .force("center",d3.forceCenter()
        .x(width / 2)
        .y(height / 2)
    )


    simulation.alpha(0.5).restart();
      // set the map opacity to 0
      svg.selectAll("path")
            .attr("opacity", 0);
      
    }
  }

})

