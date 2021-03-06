// alert("Hello, France!");
// cd Downloads/GitHub/IGR\ 204\ -\ Data\ Visualization/lab1/France/ && python -m http.server 8080

const w1 = 750;
const h1 = 750;
let dataset1 = [];

// Create SVG element
let svg1 = d3.select("#area1")
            .append("svg")
            .attr("width", w1)
            .attr("height", h1);

/*
// Create Text window element
let textWindow = d3.select("body")
                    .append("svg")
                    .attr("width", w1)
                    .attr("height", 100);
*/

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

            // Data scales
            x = d3.scaleLinear()
                .domain(d3.extent(rows, (row) => row.longitude))
                .range([75, w1-75]);
            
            y = d3.scaleLinear()
                .domain(d3.extent(rows, (row) => row.latitude))
                .range([h1-50, 50]); // h first to rotate France
            
            // Drawing
            dataset1 = rows;
            draw();
        }
    });

function draw() {
    svg1.selectAll("rect")
        .data(dataset1)
        .enter()
        .append("rect")

        // having SVG and CSS attributes for the rect with 1 × 1 pixels. 
        .attr("width", 1)
        .attr("height", 1)
        .attr("x", (d) => x(d.longitude) )
        .attr("y", (d) => y(d.latitude) )

        //.on("mouseover", handleMouseOver)
    
    
    // Axis creation
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0 " + (h1-10) + ")")
        .call(d3.axisTop(x))
    svg1.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25)") 
        .call(d3.axisRight(y))
}

/*
function handleMouseOver (d, i) {
    console.log(d)

    d3.select("#code").remove(); // refresh display

    textWindow.append("text")
                .attr("id", "code")
                .attr("y", 20)
                .attr("font-size", "20px")
                .attr("font-weight", "bold")
                .append("tspan")
                
                .attr("class", "place-infos")
                .attr("x", 250)
                .attr("dy", "20")
                .text(d.place + " (" + d.codePostal + ")")
                .append("tspan")
                
                .attr("x", 250)
                .attr("dy", "20")
                .text("Population : " + d.population)
                .append("tspan")
                
                .attr("x", 250)
                .attr("dy", "20")
                .text("Densité : " + d.density)
                .append("tspan");
}
*/
