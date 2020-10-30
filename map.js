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
    
    const svg = d3.select(".chart-area").append("svg")
      .attr("viewBox", [0,0,width,height]);
    
    d3.selectAll("input[name=display]").on("change", event =>{
      visType = event.target.value
      console.log("vistype", visType)
      drawMap();
      switchLayout();
    })


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

    svg.selectAll(".node").each(function(d) {
      d3.select(this).attr("transform", function(d) {
        return "translate(" + projection([d.longitude, d.latitude]) + ")";
      });
    });
    //=== Force Simulation ===
    let force = d3.forceSimulation(data[0].nodes)
    .force("charge", d3.forceManyBody().strength(-25))
    .force("link", d3.forceLink(data[0].links).distance(50))
    .force("center",d3.forceCenter()
        .x(width / 2)
        .y(height / 2)
    )

    if (visType === "map"){
      
        // stop the simulation
      // set the positions of links and nodes based on geo-coordinates
      //=== Nodes === 

    var passengersList = []
      for (i = 0; i < data[0].nodes.length; i++) {
        passengersList.push(data[0].nodes[i].passengers);
      }

    console.log(passengersList)

    let circleScale = 
      d3
      .scaleLinear()
      .domain(d3.extent(passengersList))
      .range([3,7])

      let force = d3.forceSimulation(data[0].nodes)
      .force("charge", d3.forceManyBody().strength(-25))
      .force("link", d3.forceLink(data[0].links).distance(50))
      .force("center",d3.forceCenter()
          .x(width / 2)
          .y(height / 2)
      )

    drag = force => {
      drag.filter(event => visType === "force")
  }

    let links = svg.selectAll('.chart')
            .data(data[0].links)
            .enter()
            .append('line')
            .attr('stroke', 'grey')

    let nodes = svg.selectAll('.chart')
            .data(data[0].nodes)
            .enter()
            .append('circle')
            .attr('fill', 'orange') 
            .attr('r',d=>circleScale(d.passengers))
    
    force.on("tick", () => {
      links
        .attr("x1", function(d) {
          return projection([d.source.longitude, d.source.latitude])[0];
        })
        .attr("y1", function(d) {
          return projection([d.source.longitude, d.source.latitude])[1];
        })
        .attr("x2", function(d) {
          return projection([d.target.longitude, d.target.latitude])[0];
        })
        .attr("y2", function(d) {
          return projection([d.target.longitude, d.target.latitude])[1];
        });

      nodes.attr("transform", function(d){
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
          })

      drag.filter(event => visType === "force")

    });

    nodes.append("title")
    .text(d=>d.name);

    svg.selectAll("path")
          .attr("opacity", 1);

    } else { 
      console.log("Force")
      force.alpha(0.5).restart();
      svg.selectAll("path")
            .attr("opacity", 0);
      
    }
  }

})

