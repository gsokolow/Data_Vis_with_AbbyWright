function drawScatter(g, data, xval, yval, title, size, speed){
    const margin = {left:40, right:15, top:15, bottom:50};
    const {width, height} = size;
    const t = g.transition()
        .duration(750);
  

     const x = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => +d[xval])])
      .range([margin.left, width-margin.right])
      .nice();
  
     const y = d3.scaleLinear()
      .domain(d3.extent(data, (d) => +d[yval]))
      .range([(height - margin.bottom), margin.top])
  
     const rad = d3.scaleSqrt()
      .domain([0, d3.max(data, (d) => +d["Population (millions)"])])
      .range([0, width/20]);
    
      const color = d3.scaleOrdinal()
      .domain(data.map(d => data.region))
      .range(d3.schemeCategory10);
  
  
    let dots = g.selectAll("#circle")
    if(dots.empty()) {
      g
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("id", "circle")
      .attr("stroke", (d) => (d.gdpNormalized>30) ? "grey" : "white")
      .attr("opacity", (d) => (d.gdpNormalized > 30) ? 1 : .15)
      .attr("cx", (d) => x(+d[xval]))
      .attr("cy", (d) => y(+d[yval]))
      .attr("r", (d) => rad(+d["Population (millions)"]))
      .attr("fill", (d) => color(d.region))
      .append("title") // append tooltip
      .text((d) => d.country);
    }
    dots
    .transition()
    .duration(speed)
    .attr("cx", (d) => x(+d[xval]))
    .attr("r", (d) => yval === "biocapacity" ? 5 : rad(d["Population (millions)"]))
    .attr("cy", (d) => y(+d[yval]))
  
    //x-axis label
    let xLabel = g.select("#x-lab")
    if(xLabel.empty()) {
      xLabel = g.append("text")
      .attr("text-anchor", "middle")
      .attr("id", "x-lab")
      .attr("transform", `translate(${(width-margin.right + margin.left)/2}, ${height-12})`)
      .style("font-weight", "regular")
      .style("font-size","14px")
      .text("Gross Domestic Product")
       }
    xLabel.text(function (d) {
      if(xval === "gdpNormalized") {return "Gross Domestic Product (2016 USD)"}
      else if (xval === "hdi") {return "Human Development Index"}
        else {return "Area per Person (km)"}
    })

    //y-axis label
    let yLabel = g.select("#y-lab")
    if(yLabel.empty()) {
      yLabel = g.append("text")
      .attr("text-anchor", "middle")
      .attr("id", "y-lab")
      .attr("transform", `translate(${margin.left - 30},${height/2}) rotate(-90)`)
      .style("font-weight", "regular")
      .style("font-size","14px")
      .text(yval)
       }
    yLabel.text(function (d) {
      if (yval === "biocapacity") {return "Biocapacity"}
      else {return yval}
    })
  
    let xAxis = g.select("#x-axis");
    if (xAxis.empty()){
      xAxis = g.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
    }
    if(xval === "gdpNormalized" || xval === "kmPerCap") {
      xAxis.call(d3.axisBottom(x)
      .tickFormat(function (d) {return d + "K"}))
      .attr("transform", `translate(0, ${height - margin.bottom})`)
    }
    else {xAxis.call(d3.axisBottom(x))
      .attr("transform", `translate(0, ${height - margin.bottom})`)}
    
  
    let yAxis = g.select("#y-axis");
    if (yAxis.empty()){
      yAxis = g.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
    }
    yAxis.call(d3.axisLeft(y))
    .attr("transform", `translate(${margin.left}, 0)`)
  
  
    g.transition()
    .duration(speed)
    .attr("opacity", 1);
  
    };


function circleLegend(selection, domain, range) {

      let instance = {}
  
      // set some defaults 
      const api = {
          domain: domain, // the values min and max
          range: range,   // the circle area/size mapping
          values: [8, 34, 89], // values for circles
          x: 500,
          y: 500,
          suffix:'',      // ability to pass in a suffix
          circleColor: '#888',
          textPadding: 20,
          textColor: "black",
          fontSize: 14,
          format: d3.format("~g"),
          title: 'Default title'
      }
      
      const sqrtScale = d3.scaleSqrt()
          .domain(api.domain)
          .range(api.range)
  
      instance.render = function () {
  
          const s = selection.append('g')
              .attr('class', 'legend-wrap')
              // push down to radius of largest circle
              .attr('transform', 'translate(0,' + sqrtScale(d3.max(api.values)) + ')')
  
          // append the values for circles
          s.append('g')
              .attr('class', 'values-wrap')
              .selectAll('circle')
              .data(api.values)
              .enter().append('circle')
              .attr('class', d => 'values values-' + d)
              .attr('r', d => Math.abs(sqrtScale(d)))
              .attr('cx', api.x)
              .attr('cy', d => api.y - Math.abs(sqrtScale(d)))
              .style('fill', 'none') 
              .style('stroke', api.circleColor) 
              .style('opacity', 0.9) 
  
          // append some lines based on values
          s.append('g')
              .attr('class', 'values-line-wrap')
              .selectAll('.values-labels')
              .data(api.values)
              .enter().append('line')
              .attr('x1', d => api.x + sqrtScale(d))
              .attr('x2', api.x + Math.abs(sqrtScale(Math.max(Math.abs(api.domain[0]),Math.abs(api.domain[1])))) + 14)
              .attr('y1', d => api.y - Math.abs(sqrtScale(d)))
              .attr('y2', d => api.y - Math.abs(sqrtScale(d)))
              .style('stroke', api.textColor)
              .style('stroke-dasharray', ('2,2'))
  
          // append some labels from values
          s.append('g')
              .attr('class', 'values-labels-wrap')
              .selectAll('.values-labels')
              .data(api.values)
              .enter().append('text')
              .attr('x', api.x + Math.abs(sqrtScale(Math.max(Math.abs(api.domain[0]),Math.abs(api.domain[1])))) + api.textPadding - 30)
              .attr('y', d => (api.y - Math.abs(sqrtScale(d))) + 4)
              .attr('shape-rendering', 'crispEdges')
              .style('text-anchor', 'left')
              .style('fill', api.textColor)
              .attr('font-size', api.fontSize)
              .text(d => api.format(d) + api.suffix)
        
          s.append('g')
            .append('text')
            //.attr('text', api.title) 
            .attr('x', api.x -30 )
            .attr('y', api.y + 20)
            .attr('font-size', api.fontSize + 4)
            .style('text-anchor', 'left')
            .text(api.title)
          return instance
      }
  
      // convert api fields to setter functions
      for (let key in api) {
          instance[key] = getSet(key, instance).bind(api)
      }
      return instance
  
      // https://gist.github.com/gneatgeek/5892586
      function getSet(option, component) {
          return function (_) {
              if (! arguments.length) {
                  return this[option];
              }
          this[option] = _;
          return component;
        }
      }
      
  };

  function colorLegend (data, SVG, keys, color, title) {

    // Usually you have a color scale in your chart already


    // Add one dot in the legend for each name.
    var size = 10
    SVG.selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", 5)
        .attr("y", function(d,i){ return i*(size+5)-40}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    SVG.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 5 + size*1.2)
        .style("font-size","12px")
        .attr("y", function(d,i){ return i*(size+5) + (size/2)-40}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "black")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    SVG.append("text")
    .text(title)
    .attr("y", -50)

  }

  function country(){ d => ["United States"][d];}
  // Adapted from ben welsh https://observablehq.com/@palewire/radar-chart
  function Radarchart(svg){
    //const svg = d3.select(DOM.svg(width, height+(margin*2)));

    const data = [
      [
        //US
        {axis:"GDP",value:0.189},
        {axis:"HDI",value:0.6},
        {axis:"Km per Capita",value: 0.0823},
        {axis:"Biocapacity",value: 0.277},
      ],
      //canada
        [{axis:"GDP",value:0.285816},
        {axis:"HDI",value:0.6},
        {axis:"Km per Capita",value: 0.73524},
        {axis:"Biocapacity",value:0.8915}], 
        //Sweden
        [
        {axis:"GDP",value:0.5752},
        {axis:"HDI",value:0.5},
        {axis:"Km per Capita",value:0.12223},
        {axis:"Biocapacity",value:0.669}],
        //australia
      [
        {axis:"GDP",value:0.285816},
        {axis:"HDI",value:0.8},
        {axis:"Km per Capita",value:0.9534},
        {axis:"Biocapacity",value:0.863}
      ]
    ]

    
    // const flat = data.merge(data.map(d => d.value));
    //const maxValue =  d3.max(flat);
    const maxValue = 1;
    const axesDomain = data[0].map(d => d.axis);
    const axesLength =  data[0].length;
    const formatPercent = d3.format(',.0%');
    const wrapWidth = 60;
    const axisLabelFactor = 1.2;
    const axisCircles = 1;
    const dotRadius = 4;
    const margin = 30;
    const height = 380;
    const radius = (height-(margin*2)) / 2;
    const width = 500;
    // plotting
    const angleSlice = Math.PI * 2 / axesLength;
    const radarLine = d3.lineRadial()
    .curve(d3.curveCardinalClosed)
    .radius(d => rScale(d))
    .angle((d, i) => i * angleSlice);
    const rScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, radius]);
    const color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0", "#7a5195"]);
    // const hdiScale = d3.scaleLinear()
    // .domain([0.5, 1])
    // .range([0, radius]);

    const hdiMax = 0.95
    
    const containerWidth = width-(margin*2);
    const containerHeight = height-(margin*2);
    const container = svg.append('g')
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);
    
    var axisGrid = container.append("g")
      .attr("class", "axisWrapper");
    
    axisGrid.selectAll(".levels")
       .data(d3.range(1,(axisCircles+1)).reverse())
       .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", (d, i) => radius/axisCircles*d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.1);

   
    
    const axis = axisGrid.selectAll(".axis")
      .data(axesDomain)
      .enter()
        .append("g")
        .attr("class", "axis");
  
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => (d.axis === "HDI") ? hdiScale(hdiMax*1.1) * Math.cos(angleSlice*i - Math.PI/2) : rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("y2", (d, i) => (d.axis === "HDI") ? hdiScale(hdiMax*1.1) * Math.sin(angleSlice*i - Math.PI/2) : rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");


      axisGrid.append("line")
      .attr("x1", -radius*0.5)
      .attr("y1", 25)
      .attr("x2", -radius*0.5)
      .attr("y2", -25)
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "2px");

    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "15px")
      .attr("text-anchor", "middle")
      .attr("font-family", "monospace")
      .attr("dy", "0.35em")
      .attr("fill", "grey")
      .attr("x", -radius*.5-10)
      .attr("y", -15)
      .text("+");

      axis.append("text")
      .attr("class", "legend")
      .style("font-size", "15px")
      .attr("text-anchor", "middle")
      .attr("font-family", "monospace")
      .attr("dy", "0.35em")
      .attr("fill", "grey")
      .attr("x", -radius*.5+10)
      .attr("y", -16)
      .text("-");
  
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("font-family", "monospace")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
      .text(d => d);
    
    const plots = container.append('g')
      .selectAll('g')
      .data(data)
      .join('g')
        .attr("data-name", (d, i) => country(i))
        .attr("fill", "none")
        .attr("stroke", "steelblue");
  
    plots.append('path')
      .attr("d", d => radarLine(d.map(v => v.value)))
      .attr("fill", (d, i) => color(i))
      .attr("fill-opacity", 0.1)
      .attr("stroke", (d, i) => color(i))
      .attr("stroke-width", 2);
  
    plots.selectAll("circle")
      .data(d => d)
      .join("circle")
        .attr("r", dotRadius)
        .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
        .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
        .style("fill-opacity", 0.8);
  
    return svg.node();
  }

  

  async function manageVisualizations(){

    const size = {
      width: 600,
      height:500
    }

    const leg = {
      width: 200,
      height: size.height
    }
  
    const speed = 1500;
  
    const data = await d3.csv("data/countries.csv");
    const gdpData3 = data.filter((i) => i["GDP per Capita"] != null && i["HDI"] != null)
    const gdpData4 = gdpData3.map((d) =>  {return {...d, "GDPnormalized": d["GDP per Capita"].slice(1).replace(",", "")}})

        //land area data

    const density2 = await d3.csv("data/density2.csv")
  

    const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, size.width, size.height])
    .style("height", `${size.height}px`)
    .style("width", `${size.width}px`);
  
    const scatter = svg.append("g");

    const legend = d3.select("#legend")
      .append("svg")
      .attr("viewBox", [0, 0, leg.width, leg.height/2])
      .style("height", `${leg.height}px`)
      .style("width", `${leg.width}px`)

      const legend2 = d3.select("#legend")
      .append("svg")
      .attr("viewBox", [0, 0, leg.width, leg.height/2])
      .style("height", `${leg.height}px`)
      .style("width", `${leg.width}px`)
      

    const regionkeys = ["Middle East/Central Asia",  "Northern/Eastern Europe",  "Africa", "Latin America", "Asia-Pacific", "European Union","North America"]

    const regioncolor =  d3.scaleOrdinal()
    .domain(data.map(d => data.region))
    .range(d3.schemeCategory10);
    const countrykeys = ["United States", "Canada", "Sweden", "Australia"];


    const countrycolor = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0", "#7a5195"])
    const popext = [0, d3.max(data, (d) => +d["Population (millions)"])];
    // note we changed index

    const radar = svg.append("g");
    Radarchart(radar)

    

    circleLegend(legend, popext, [0, size.width/20])
    .x(leg.width/4)
    .y(leg.height/3)
    .values([ // min- fix to get real min value?
            10.5, // Bolivia
            317.5, // us
            1408.04 // china - max
            ])
    .circleColor("black")
    .textColor("black")
    .suffix(' people')
    .fontSize(12)
    .textPadding(47)
    .title("Population (millions)")
    .render();

    colorLegend(density2, legend, regionkeys, regioncolor, "Regions")
    colorLegend(density2, legend2, countrykeys, countrycolor, "Countries")
    legend2.attr("opacity", 0)

    const scroll = scroller();
    scroll(d3.selectAll("section"));
    scroll.on("section-change", (section)=>{
      console.log(section)
      switch(section) {
        case 0: console.log("step 1")
        drawScatter(scatter, density2, "gdpNormalized", "Total Ecological Footprint", "GDP and TEF", size, speed)
        radar.attr("opacity", 0)
        legend.attr("opacity", 1)
        legend2.attr("opacity", 0)
        break
        case 1: console.log("step 2")
        drawScatter(scatter, density2, "hdi", "Total Ecological Footprint", "HDI and Total Ecological Footprint", size, speed)
        radar.attr("opacity", 0)
        legend.attr("opacity", 1)
        legend2.attr("opacity", 0)
        break
        case 2: console.log("step 3")
        drawScatter(scatter, density2, "kmPerCap", "biocapacity", "Population Density and Biocapacity", size, speed)
        radar.transition()
          .duration(750)
          .attr("opacity", 0)
        legend.attr("opacity", 1)
        legend2.attr("opacity", 0)
        break
        case 3: console.log("step 4")
        scatter.transition()
          .duration(750)
          .attr("opacity", 0)
        legend.transition()
          .duration(750)
          .attr("opacity", 0)
        radar.transition()
          .duration(750)
          .attr("opacity", 1)
        legend2.transition()
          .duration(800)
          .attr("opacity", 1)
        break;
        case 4: console.log("step 4")
        radar.transition()
          .duration(750)
          .attr("opacity", 0)
        legend2.transition()
          .duration(800)
          .attr("opacity", 0)
      }
    })
    
  }
  
  manageVisualizations();
