// alert("Hello, France!");

const w1 = 750;
const h1 = 750;
const w2 = 750;
const h2 = 750;
const radius = 40;
let dataset = [];


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
            dataset = rows;
            draw1();
            draw2();
        }
    });


//================ DRAW 1 ================

function draw1() {

	// Some variables
    var max_longitude = d3.max(dataset, (d) => d.longitude);
    var min_longitude = d3.min(dataset, (d) => d.longitude);

    var max_latitude = d3.max(dataset, (d) => d.latitude);
    var min_latitude = d3.min(dataset, (d) => d.latitude);

    // Data scales
    var x = d3.scaleLinear()
          .domain([min_longitude, max_longitude])
          .range([75, w1-75]);
            
    var y = d3.scaleLinear()
          .domain([min_latitude, max_latitude])
          .range([h1-50, 5]); // h first to rotate France
    
    
	// Create SVG containers
    var textWindow = d3.select("#area1")
                    .append("svg")
                    .attr("width", w1)
                    .attr("height", 100);
    
	var svg1 = d3.select("#area1")
         	    .append("svg")
                .attr("width", w1)
            	.attr("height", h1);
            	
    svg1.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")

        // having SVG and CSS attributes for the rect with 1 × 1 pixels. 
        .attr("width", 1)
        .attr("height", 1)
        .attr("x", (d) => x(d.longitude) )
        .attr("y", (d) => y(d.latitude) )

        .on("mouseover", handleMouseOver1)    
    
    // Axis creation
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0 " + (h1-10) + ")")
        .call(d3.axisTop(x))
    svg1.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25)") 
        .call(d3.axisRight(y))
    
    
// FUNCTIONS
    
function handleMouseOver1 (d, i) {
    console.log(d)
    
    d3.select("#code").remove(); // refresh display

    textWindow.append("text")
                .attr("id", "code")
                .attr("y", 20)
                .attr("font-size", "20px")
                .attr("font-weight", "bold")
                .append("tspan")
                
                .attr("class", "place-infos")
                .attr("x", 300)
                .attr("dy", "20")
                .text(d.place + " (" + d.codePostal + ")")
                .append("tspan")
                
                .attr("x", 300)
                .attr("dy", "20")
                .text("Population : " + d.population)
                .append("tspan")
                
                .attr("x", 300)
                .attr("dy", "20")
                .text("Densité : " + d.density);
}
    
}


//================ DRAW 2 ================

function draw2() {
	// SVG ELEMENT 2
	// Some variables

    var max_longitude = d3.max(dataset, (d) => d.longitude);
    var min_longitude = d3.min(dataset, (d) => d.longitude);

    var max_latitude = d3.max(dataset, (d) => d.latitude);
    var min_latitude = d3.min(dataset, (d) => d.latitude);

    var max_population = d3.max(dataset, (d) => d.population);

    var max_density = d3.max(dataset, (d) => d.density);

    // Some scale functions
    var scaleX = d3.scaleLinear()
        .domain([min_longitude, max_longitude])
        .range([0, w2]);

    var scaleY = d3.scaleLinear()
        .domain([min_latitude, max_latitude])
        .range([h2, 0]); // h first to rotate France
        
        // radius
    var scaleR = d3.scaleSqrt()
        .domain([0, max_population])
        .range([0.1, radius]);

        // opacity
    var scaleO = d3.scaleLinear()
        .domain([0, max_density])
        .range([0.4, 0.8]);


    // Create SVG containers
    
    var groupText = d3.select("#area2")
                        .append("svg")
                        .attr("width", w2)
                        .attr("height", 100)
                        .attr("class", "everything")
                        .attr("font-size", "20px")
                        .attr("font-weight", "bold");
    
    var svg2 = d3.select("#area2")
                .append("svg")
                .attr("width", w2)
                .attr("height", h2);
                    

    // Circle grouping
    var groupCircles = svg2.append("g")
                            .attr("class", "everything");
    

    // Circles creation
    var circles = groupCircles.selectAll("circle")
                                .data(dataset)
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
            .on("mouseover", handleMouseOver2)
            .on("mouseout", handleMouseOut2)

    // Zoom handler
    var handleZoom = d3.zoom()
                    .on("zoom", zoom_actions);
    handleZoom(svg2);


// FUNCTIONS

function handleMouseOver2 (d, i) {
    console.log(d)

    // D3 to select element, change size and color
    d3.select(this)
        .style("fill", "blue")
        .attr("r", 2 * scaleR(d.population));

    
    // Text label
    groupText.append("text")
            .attr("id", "t" + d.codePostal)
            .attr("y", 20)
            .append("tspan")

            .attr("x", 300) //scaleX(d.longitude)+
            .attr("dy", 0)
            .text(d.place + " (" + d.codePostal + ")")
            .append("tspan")

            .attr("x", 300)
            .attr("dy", 20)
            .text("Population : " + d.population)
            .append("tspan")

            .attr("x", 300)
            .attr("dy", 20)
            .text("Densité : " + d.density);
}


function handleMouseOut2 (d, i) {
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

