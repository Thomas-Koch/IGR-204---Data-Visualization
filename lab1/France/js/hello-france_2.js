//alert("Hello, France!");
const w = 600;
const h = 600;
const radius = 20
var dataset = [];

// import data

d3.tsv("data/france.tsv").row((d, i) => {
    return {
      postalCode: +d["Postal Code"],
      inseeCode: +d.inseecode,
      place: d.place,
      longitude: +d.x,
      latitude: +d.y,
      population: +d.population,
      density: +d.density
    }
  })
  .get((error, rows) => {
    // Handle errors or set up visualisation hello-franceconsole.log
    console.log("Loaded " + rows.length + " rows");
    if (rows.length > 0) {
      console.log("First row: ", rows[0])
      console.log("Last row: ", rows[rows.length - 1])
    }
    dataset = rows;

    draw();

  })

function draw() {
  var max_longitude = d3.max(dataset, function(d) {
    return d.longitude
  });
  var min_longitude = d3.min(dataset, function(d) {
    return d.longitude
  });
  var max_latitude = d3.max(dataset, function(d) {
    return d.latitude
  });
  var min_latitude = d3.min(dataset, function(d) {
    return d.latitude
  });

  var max_population = d3.max(dataset, function(d) {
    return d.population
  });
  var max_density = d3.max(dataset, function(d) {
    return d.density
  });

  var scaleLong = d3.scaleLinear()
    .domain([min_longitude, max_longitude])
    .range([0, w]);

  var scaleLat = d3.scaleLinear()
    .domain([min_latitude, max_latitude])
    .range([h, 0]);

  var scaleRadius = d3.scaleSqrt()
    .domain([0, max_population])
    .range([0.1, radius]);

  var scaleOpacity = d3.scaleLinear()
    .domain([0, max_density])
    .range([0.4, 0.8]);

  // Create svg document
  var svgContainer = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var groupCircles = svgContainer.append("g")
    .attr("class", "everything");

  var groupText = svgContainer.append("g")
    .attr("class", "everything");


  var circles = groupCircles.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle");


  var circleAttributes = circles
    .attr("cx", function(d) {
      return scaleLong(d.longitude)
    })
    .attr("cy", function(d) {
      return scaleLat(d.latitude)
    })
    .attr("r", function(d) {
      return scaleRadius(d.population)
    })
    .style("fill", "blue")
    .style("opacity", function(d) {
      return scaleOpacity(d.density)
    })
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);


  var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

  zoom_handler(svgContainer);

  function zoom_actions() {
    groupCircles.attr("transform", d3.event.transform)
  }

  function handleMouseOver(d, i) {
    // Use D3 to select element, change color and size
    d3.select(this)
      .style("fill", "orange")
      .attr("r", 2 * scaleRadius(d.population))

    // Specify where to put label of text
    groupText.append("text")
      .attr("id", "t" + d.postalCode)
      .attr("y", scaleLat(d.latitude))
      .append("tspan")
      .attr('x', scaleLong(d.longitude))
      .attr('dy', 5)
      .text(d.place)
      .append("tspan")
      .attr('x', scaleLong(d.longitude))
      .attr('dy', 15)
      .text("pop.: " + d.population)
      .append("tspan")
      .attr('x', scaleLong(d.longitude))
      .attr('dy', 15)
      .text("dens.:" + d.density)

  }

  function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this)
      .style("fill", "blue")
      .attr("r", scaleRadius(d.population))

    // Select text by id and then remove
    d3.select("#t" + d.postalCode).remove(); // Remove text location
  }
}
