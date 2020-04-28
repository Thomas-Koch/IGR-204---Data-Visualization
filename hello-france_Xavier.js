const w = 600;
const h = 600;
let dataset = [];


//Create SVG element
let svg = d3.select("body")
            .append("svg")
                .attr("width", w+100)
                .attr("height", h+120);

let groupText = d3.select("body")
                    .append("svg")
                    .attr("width", w+100)
                    .attr("height", 300)

d3.tsv("data/france.tsv")
    .row((d,i) => {
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
    .get((error, rows) => {
        console.log("Loaded" + rows.length + " rows.")
        if (rows.length > 0) {
            console.log("First row: ", rows[0]);
            console.log("Last row:", rows[rows.length-1]);

            x = d3.scaleLinear()
                .domain(d3.extent(rows, (row) =>  row.longitude))
                .range([50, w+50]);
                                
            y = d3.scaleLinear()
                .domain(d3.extent(rows, (row) => row.latitude))
                .range([h+50, 50]);

            dataset = rows;
            draw();

        }
        
    });



function draw() {
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("width", 1)
        .attr("height", 1)
        .attr("x", (d) => x(d.longitude))
        .attr("y", (d) => y(d.latitude))
        .on("mouseover", handleMouseOver)
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (h+100) + ")")
        .call(d3.axisTop(x))
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0)")
        .call(d3.axisRight(y))
}

function handleMouseOver(d, i) {
    console.log(d)

    //d3.select("#code" + d.codePostal).remove();
    d3.select("#code").remove();

    groupText.append("text")
        .attr("id", "code")// + d.codePostal)
        .attr("y", 20)
        .append("tspan")
        .attr("class", "place-infos")
        .attr("x", 0)
        .attr("dy", "20")
        .text(d.place + " (" + d.codePostal + ")")
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "20")
        .text("Population :" + d.population)
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "20")
        .text("Densité :" + d.density);
}
