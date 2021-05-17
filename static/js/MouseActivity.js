//define the heading for each row of the data  
let csv = 'Date,Coordinates\n';  

document.onmousemove = function(event) {
  console.log(`(${new Date().toString()}: ${event.pageX}, ${event.pageY})`);
  //merge the data with CSV  
  csv += `${new Date().toString()}, PageX: ${event.pageX} PageY: ${event.pageY}\n`;  
};

function download_csv_file() {  
  //display the created CSV data on the web browser   
  document.write(csv);  
   
  const hiddenElement = document.createElement('a');  
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
  hiddenElement.target = '_blank';  
    
  //provide the name for the CSV file to be downloaded  
  hiddenElement.download = 'mouse_recording_data.csv';  
  hiddenElement.click();  
}
