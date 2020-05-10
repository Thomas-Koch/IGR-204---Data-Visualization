// alert("Hello, France!");
// cd Downloads/GitHub/IGR\ 204\ -\ Data\ Visualization/lab1/France/ && python -m http.server 8080

const w2 = 800;
const h2 = 800;
const radius = 40;
let dataset2 = [];

// Loading data
d3.tsv("data/france.tsv")
    .row( (d, i) => {
        return {
            codePostal: +d["Postal Code"],
            inseeCode: +d.inseecode,
            place: d.place,
            longitude: +d.x,
            latitude: +d.y,
            population: +d.population,
            density: +d.density
        };
    }) 
    .get( (error, rows) => {
        // Handle error or set up visualization here
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[0]);
            console.log("Row 20", rows[20]);
            console.log("Last row: ", rows[rows.length-1]);

            // Drawing
            dataset2 = rows;
            draw();
        }
    });


function draw() {
    // Some variables

    var max_longitude = d3.max(dataset2, (d) => d.longitude);
    var min_longitude = d3.min(dataset2, (d) => d.longitude);

    var max_latitude = d3.max(dataset2, (d) => d.latitude);
    var min_latitude = d3.min(dataset2, (d) => d.latitude);

    var max_population = d3.max(dataset2, (d) => d.population);

    var max_density = d3.max(dataset2, (d) => d.density);

    // Some scale functions
    var scaleX = d3.scaleLinear()
        .domain([min_longitude, max_longitude])
        .range([100, w2-100]);

    var scaleY = d3.scaleLinear()
        .domain([min_latitude, max_latitude])
        .range([h2-50, 50]); // h first to rotate France
        
        // radius
    var scaleR = d3.scaleSqrt()
        .domain([0, max_population])
        .range([0.1, radius]);

        // opacity
    var scaleO = d3.scaleLinear()
        .domain([0, max_density])
        .range([0.4, 0.8]);


    // Create SVG container
    var svg2 = d3.select("#area2")
                .append("svg")
                .attr("width", w2)
                .attr("height", h2);
    

    // Circle grouping
    var groupCircles = svg2.append("g")
                            .attr("class", "everything");
    
    // Text grouping
    var groupText = svg2.append("g")
                        .attr("class", "everything")
                        .attr("font-size", "20px")
                        .attr("font-weight", "bold")
                        .style("fill", "red");

    // Circles creation
    var circles = groupCircles.selectAll("circle")
                                .data(dataset2)
                                .enter()
                                .append("circle");

    // Circles attributes
    var circlesAttributes = circles
            .attr("cx", (d) => scaleX(d.longitude))
            .attr("cy", (d) => scaleY(d.latitude))
            .attr("r", (d) => scaleR(d.population))
            .style("fill", "black")
            .style("opacity", (d) => scaleO(d.density))
            
            // Mouse over and out
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)

    // Zoom handler
    var handleZoom = d3.zoom()
                    .on("zoom", zoom_actions);
    handleZoom(svg2);


// FUNCTIONS

function handleMouseOver (d, i) {
    console.log(d)

    // D3 to select element, change size and color
    d3.select(this)
        .style("fill", "blue")
        .attr("r", 2 * scaleR(d.population));

    
    // Text label
    groupText.append("text")
            .attr("id", "t" + d.codePostal)
            .attr("y", 50)
            .append("tspan")

            .attr("x", 500) //scaleX(d.longitude)+
            .attr("dy", 0)
            .text(d.place + " (" + d.codePostal + ")")
            .append("tspan")

            .attr("x", 500)
            .attr("dy", 20)
            .text("Population : " + d.population)
            .append("tspan")

            .attr("x", 500)
            .attr("dy", 20)
            .text("Densité : " + d.density)
            .append("tspan");
}


function handleMouseOut (d, i) {
    // D3 to select elements ans change color to initial state
    d3.select(this)
        .style("fill", "black")
        .attr("r", scaleR(d.population));

    // Select text by id and remove text location
    d3.select("#t" + d.codePostal).remove();
}

function zoom_actions() {
    groupCircles.attr("transform", d3.event.transform)
}

}
