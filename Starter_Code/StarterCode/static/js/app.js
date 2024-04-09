// Declaring sampleData 
let sampleData; 
let metaField;

// Creating the modifyDashboard function
function modifyDashboard(selectedValue) {
    // matching the chart based on the selectedSample (user input based)
    let selectedSample = sampleData.find(sample => sample.id === selectedValue);
    
    // Creating the bar chart
    let trace1 = {
        x: selectedSample.sample_values.slice(0, 10).reverse(),
        y: selectedSample.otu_id.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: selectedSample.otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#5E2D79', 
            opacity: 0.8
        }
    };
    let hBarChart = [trace1];
    
    let layout = {
        margin: {
            l: 80,
            r: 55,
            t: 35,
            pad: 5
        },
        title: {
            text: `<b>Top 10 OTUs - Sample ${selectedValue}</b>`,
            font: {
                size: 22,
                color: '#333' 
            }
        },
        xaxis: {
            tickfont: {
                color: '#555' 
            }
        },
        yaxis: {
            tickfont: {
                color: '#555' 
            }
        }
    };

    Plotly.newPlot('bar', hBarChart, layout);

    // Creating a bubble chart
    let trace2 = { 
        x: selectedSample.otu_id,
        y: selectedSample.sample_values,
        mode: 'markers',
        text: selectedSample.otu_labels,
        marker: {
            color: selectedSample.otu_id,
            colorscale: 'Viridis', 
            size: selectedSample.sample_values,
            opacity: 0.7
        }
    };
    let bubbleChart = [trace2];

    let bubbleLayout = {
        showlegend: false,
        height: 600,
        width: 1200,
        title: {
            text: `<b>Sample distribution of sample ${selectedValue}</b>`,
            font: {
                size: 22,
                color: '#333' 
            }
        },
        xaxis: {
            title: {
                text: "OTU IDs",
                font: {
                    color: '#555' 
                }
            },
            tickfont: {
                color: '#555' 
            }
        },
        yaxis: {
            title: {
                text: 'Sample Values',
                font: {
                    color: '#555' 
                }
            },
            tickfont: {
                color: '#555' 
            }
        }
    };
    
    Plotly.newPlot('bubble', bubbleChart, bubbleLayout);

 
    // * Append Demographic information
    let selectedMetadata = metaField.find(field => field.id === selectedValue);
    let panelBody = d3.select('#sample-metadata');
    console.log(selectedMetadata)
    panelBody.html(`
        <p><strong>Id:</strong> ${selectedMetadata.id}</p>
        <p><strong>Ethnicity</strong>: ${selectedMetadata.ethnicity}</p>
        <p><strong>Gender:</strong> ${selectedMetadata.gender}</p>
        <p><strong>Age:</strong> ${selectedMetadata.age}</p>
        <p><strong>Location:</strong> ${selectedMetadata.location}</p>
        <p><strong>BBType:</strong> ${selectedMetadata.bbtype}</p>
        <p><strong>WFreq:</strong> ${selectedMetadata.wfreq}</p>
    `)

    // Creating a gauge chart
    let wfreqValue = selectedMetadata.wfreq;
    let gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            title: {
                text: "<b>Belly Button Washing Frequency</b><br><span style='font-size: 20px;'>Scrubs per Week</span>",
                font: { size: 22, color: '#333' } 
            },
            type: "indicator",
            mode: "gauge+number",
            value: wfreqValue,
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: 'red' },
                bar: { color: '#930D0D' }, 
                bgcolor: "#E6E6E6", 
                borderwidth: 2,
                bordercolor: "#333", 
                steps: [
                    { range: [0, 1], color: "#f89091" }, 
                    { range: [1, 2], color: "#f66e6f" },  
                    { range: [2, 3], color: "#f44c4e" },  
                    { range: [3, 4], color: "#f22a2c" },  
                    { range: [4, 5], color: "#ec0d0f" },  
                    { range: [5, 6], color: "#ca0b0d" },  
                    { range: [6, 7], color: "#a8090b" },  
                    { range: [7, 8], color: "#860708" },  
                    { range: [8, 9], color: "#650506" }   
                ]
            }
        }
    ];

    let layout2 = {
        width: 520,
        height: 500,
        margin: { t: 0, b: 145, pad: 8 }
    };

    Plotly.newPlot('gauge', gaugeData, layout2);
};  

// Define optionChanged function
function optionChanged(selectedValue) {
    modifyDashboard(selectedValue);
}


// Using D3 to read JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {
    // Extracting each subset to a variable
    let samples = data.samples;
    let names = data.names;
    let metadata = data.metadata;

    // Treating the samples data subset
    sampleData = samples.map(sample => ({
        'id': sample.id,
        'otu_id': sample.otu_ids,
        'otu_labels': sample.otu_labels,
        'sample_values': sample.sample_values
      }));

      // Treating the names array
      const selectElement = document.getElementById("selDataset");
      names.forEach(name => {
          const option = document.createElement('option');
          option.text = name;
          option.value = name;
          selectElement.appendChild(option);
      });
  
      // Treating the metadata array
      metaField = metadata.map(field => ({
          'id': field.id.toString(),
          'ethnicity': field.ethnicity,
          'gender': field.gender,
          'age': field.age,
          'location': field.location,
          'bbtype': field.bbtype,
          'wfreq': field.wfreq
      })); 
  
      // Call modifyDashboard to initialize the chart
      modifyDashboard(names[0]);
  
  }).catch(function(error) {
      console.log('Error loading the JSON file: ' + error);
  });
