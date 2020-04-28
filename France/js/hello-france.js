// alert("Hello, France!");

const w = 600;
const h = 600;

//Create SVG element
let svg = d3.select("body")
            .append("svg")
                .attr("width", w)
                .attr("height", h);

//Loading data
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
        }
    });