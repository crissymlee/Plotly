// Use the D3 library to read in samples.json.
function getPlot(id) {

    // Retrieve data from the json file
    d3.json("samples.json").then((data)=> {
      console.log(data)
  
      var wfreq = data.metadata.map(d => d.wfreq)
          
      // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
          
      console.log(samples);
    
      // Top 10 SAMPLES
      var samplevalues = samples.sample_values.slice(0, 10).reverse();
    
      // Only top 10 otu ids & reverse the order
      var top10OTU = (samples.OTUids.slice(0, 10)).reverse();
      var OTUid = top10OTU.map(d => "OTU " + d)
        
      // Top 10 LABELS
      var labels = samples.otu_labels.slice(0, 10);
  
      // Create trace variable for the Bar plot
      var trace = {
          x: samplevalues,
          y: OTUid,
          text: labels,
          marker: {
            color: 'Blues[4]'},
            type:"bar",
            orientation: "h"
      };
    
      // Create data variable
      var data = [trace];
    
      // Create layout variable to set plots layout
      var layout = {
        font:{family:"Helvetica Rounded MT Bold"},
        title: "Top 10 Bacteria",
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 50,
            t: 100,
            b: 30
        }
      };
      // Create a Bar plot
      Plotly.newPlot("bar", data, layout);
  
  
      // Create a Bubble chart
      var trace1 = {
          x: samples.OTUids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
            color: samples.OTUids,
            colorscale: "continent",
            size: samples.sample_values
          },
          text: samples.otu_labels
      };
    
      // Create a layout for Bubble plot
      var layout_b = {
        margin: { t: 0},
        hovermode: "closest",
        xaxis:{
          title: "<b>OTU (Bacteria ID)</b>",
        },
        showlegend: false
      };
    
      // Create Data Variable 
      var data1 = [trace1];
    
      // Create a Bubble Plot
      Plotly.newPlot("bubble", data1, layout_b); 
    
    })
  };
  
  // Create Gauge Chart
  function buildGauge(id) {
    d3.json("samples.json").then((data)=> {
      console.log(data)
  
      var dict = data.metadata.filter(d => d.id==id)[0]
      var wfreq = dict.wfreq
      console.log(`Washing Freq: ${wfreq}`)
      
    // Washing Frequency (wfreq) range
    var level = parseFloat(wfreq) * 20;
  
    // Trigonometry to calculate meter point
    var degrees = 180 - level;
    var radius = 0.5; 
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var mainPath = "M -.02 -0.05 L .02 0.05 L ";
    var pathX = String(x);
    var space = " ";
    var pathY = String(y);
    var pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
    console.log(path);
    var data_g = [
      {
        type: "scatter",
        x:[0],
        y:[0],
        marker: { size: 12, color: "250000" },
        showlegend: false,
        text: level,
        hoverinfo: "text+name"
      },
      {
        values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [ 
            "rgba(30,144,255,.5)",
            "rgba(176,196,222,.5)",
            "rgba(0,191,255,.5)",
            "rgba(135,206,235,.8)",
            "rgba(135,206,250,.5)",
            "rgba(173,216,230,.5)",
            "rgba(176,224,230,.5)",
            "rgba(230,230,250,.5)",
            "rgba(240,248,255,.5)",
            // edit out the rest of it
            "rgba(255,255,255,0)"
          ]
        },
        labels:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ]
   // Set the layout for Gauge Chart
    var layout_g = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000"
          }
        }
      ],
      title: "<b>Navel Wash Frequency</b> <br> (times per Week)",
      height: 500,
      width: 500,
      xaxis: {
        zeroline:false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    }
          
      // Plot Gauge Chart
      Plotly.newPlot("gauge", data_g, layout_g);
    })
  };
  
  
  // Get the data
  function getInfo(id) {
      // Retrieve data from the json file
      d3.json("samples.json").then((data)=> {

          var metadata = data.metadata;
  
          console.log(metadata)
          var result = metadata.filter(meta => meta.id.toString() === id)[0];
          var demographicInfo = d3.select("#sample-metadata");
          
          // Clear for each time
          demographicInfo.html("");
  
          // Demo data for the id & add  the info to the panel
          Object.entries(result).forEach((key) => {   
                  demographicInfo.append("h6").text(key[0].toLocaleLowerCase() + ": " + key[1] + " \n");    
          });
      });
  }
  

  function optionChanged(id) {
      getPlot(id);
      getInfo(id);
      buildGauge(id);
  }
  
  function init() {
      // Select a dropdown menu 
      var dropdown = d3.select("#selDataset");
  
      // Read the data 
      d3.json("samples.json").then((data)=> {
          console.log(data)
  
          // Put id data into dropdwown
          data.names.forEach(function(name) {
              dropdown.append("option").text(name).property("value");
          });
  
          // Get the Info
          getPlot(data.names[0]);
          getInfo(data.names[0]);
          buildGauge(data.names[0]);
      });
  }
  
  init();