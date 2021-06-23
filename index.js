let vaccineName = "COVAXIN";
let ageCategory = 18;
let vaccineCost = "Free";// Can be "Free" or "Paid";
let minSlots = 1;
var audio = new Audio('audio.mp3');



// audio.play()
var setInt1, setInt2, setInt3;
let stateId, districtId, dateVal, distUrl, finalQueryUrl, dateUrl;
      let baseUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict`
      document.querySelector('form#form1 select#states').addEventListener('change', (event) => {
        stateId = event.target.value
        // console.log(`stateId: ${stateId}`);
        // AJAX Request for List of Districts
        if(stateId > 0) {
          let xhr = new XMLHttpRequest;
          xhr.open('GET',`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`, true);
          xhr.onload = function() {
            let html = `<option selected="selected">Select Your District</option>`;
            if( this.status === 200) {
              var districtsObj = JSON.parse(this.responseText);
              var districtsArr = districtsObj.districts
              // console.log(districtsArr)
              for(let i = 0; i< districtsArr.length; i++ ){
                html += `<option value="${districtsArr[i].district_id}">${districtsArr[i].district_name}</option>`
              }
            }
            document.getElementById('districts1').innerHTML = html;

          }
          xhr.send();
        }
      })

      document.querySelector('form#form1 select#districts1').addEventListener('change', (event) => {
        districtId = event.target.value
        // console.log(`districtId: ${districtId}`);
        distUrl = "?district_id=" + districtId;
      })

      document.querySelector('form#form1 input[type="date"]').addEventListener('input', event => {
        let dateVal_rev =  event.target.value.split('-');
        // Correct format of Date for the Query String.
        dateVal = dateVal_rev[2] + "-" + dateVal_rev[1] + "-" + dateVal_rev[0];
        // console.log(`date: ${dateVal}`)
        dateUrl = `&date=` + dateVal
      });

      

      /** ********************** AJAX REQUESTS FOR GETTING DATA OF FORM 1 -- START ******************** */
      document.querySelector('#form1').addEventListener('submit', (ev) => {
          ev.preventDefault();
        finalQueryUrl= baseUrl + distUrl + dateUrl
        // console.log(finalQueryUrl)
      
      // Select the HTML element where I want to place all centers Information. 
          let centersDiv1 = document.getElementById('centers-1');
          centersDiv1.classList.remove("hidden")
            
            let form_1_interval = document.getElementById("minutes-time1").value;
          if (form_1_interval >= 1) {
                
              // Search Every first Immediately 
              fetchData(); // Fetch Data once.
              
              setInt1 = setInterval(fetchData, form_1_interval*60*1000); // Fetch Data Every 60 Seconds after first data fetch.. 
              document.querySelector("#btn_stop_search1").addEventListener('click', (ev) => {
                  stopSearch1();
                  ev.preventDefault()
                  audio.pause()
                function stopSearch1() {
                    clearInterval(setInt1);
                    document.querySelector("#centers-1 #search_status").innerText = "Search Aborted by You."
                    document.querySelector("#centers-1 #search_status").style.color = "red"
                    document.querySelector("#centers-1 #search_status").style.fontWeight = "bold"
                }
            })
            }
     
       
        function fetchData() {

          fetch(finalQueryUrl)
          .then( res => res.json())
          .then( data => {
            let centers = data.sessions;
            console.log("Searching...");
            let searchedTime = new Date();
            let form1_vac_choice = document.querySelector("form#form1 select#vactype").value
            let form1_dose = parseInt(document.querySelector("form#form1 select#dosenum").value)
            let centersHTML = `<div style="text-align: center"><span id="search_status">Searching every ${form_1_interval * 60} Seconds...</span> <br> Last Searched Time: ${searchedTime} </div>`;
            let numberOfDoses
            centers.forEach((center) => {
                if (form1_dose === 0) {
                  numberOfDoses = center.available_capacity
                  console.log("ceter.available_capacity is chosen");
                } else if (form1_dose === 1) {
                  numberOfDoses = center.available_capacity_dose1
                  console.log("ceter.available_capacity_dose1 is chosen");

                } else if (form1_dose === 2) {
                  numberOfDoses = center.available_capacity_dose2
                  console.log("ceter.available_capacity_dose2 is chosen");

                }
                console.log(numberOfDoses );
              if (numberOfDoses > minSlots && (center.min_age_limit === ageCategory || center.min_age_limit === 30) && (center.vaccine === form1_vac_choice ) && center.fee_type === vaccineCost) {
                    // console.log(center)
                    centersHTML += `
                    <div class="center">
                      <h4 style="text-align: center">${center.name}</h4>
                      <div>Address: ${center.address}</div>
                      <div>Age Limit: ${center.min_age_limit}+</div>
                      <div>Vaccine : ${center.vaccine}</div>
                      <div>Fee Type: ${center.fee_type}</div>
                      <div>Price : ${center.fee}</div>
                      <div>All Available Slots: ${center.available_capacity} <br>
                        Dose 1: ${center.available_capacity_dose1}<br>
                        Dose 2: ${center.available_capacity_dose2}
                      </div>
                      <div>Date :${center.date}</div>
                      <div><a href="https://selfregistration.cowin.gov.in/" target="_blank" >Book on Cowin!</a></div>
                     </div>
                      <hr>
                    `
                  }
                
            });
            centersDiv1.innerHTML = centersHTML + `<br> <hr><div id="last">Search Completed! If there are no results, choose a different district or wait for results to show up.</div>`;
            // console.log(centersHTML)
             if (document.querySelector("div#centers-1 div:nth-child(2)") != null) {
                  audio.play()
            }

            console.log('Completed Search!')
          })
        }
      })
/** ********************** AJAX REQUESTS FOR GETTING DATA OF FORM 1 -- END ******************** */

/** ********************** AJAX REQUESTS FOR GETTING DATA OF FORM 2-- START ******************** */
let stateId2, districtId2, dateVal2, distUrl2, finalQueryUrl2, dateUrl2;
        
document.querySelector('form#form2 select#states').addEventListener('change', (event) => {
    stateId2 = event.target.value
    // console.log(`stateId2: ${stateId2}`);
    // AJAX Request for List of Districts
    if(stateId2 > 0) {
      let xhr = new XMLHttpRequest;
      xhr.open('GET',`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId2}`, true);
      xhr.onload = function() {
        let html = `<option selected="selected">Select Your District</option>`;
        if( this.status === 200) {
          var districtsObj = JSON.parse(this.responseText);
          var districtsArr = districtsObj.districts
        //   console.log(districtsArr)
          for(let i = 0; i< districtsArr.length; i++ ){
            html += `<option value="${districtsArr[i].district_id}">${districtsArr[i].district_name}</option>`
          }
        }
        document.querySelector("#districts2").innerHTML = html;

      }
      xhr.send();
    }
  })

  document.querySelector('select#districts2').addEventListener('change', (event) => {
    districtId2 = event.target.value
    // console.log(`districtId2: ${districtId2}`);
    distUrl2= "?district_id=" + districtId2;
  })

  document.querySelector('form#form2 input[type="date"]').addEventListener('input', event => {
    let dateVal2_rev =  event.target.value.split('-');
    // Correct format of Date for the Query String.
    dateVal2 = dateVal2_rev[2] + "-" + dateVal2_rev[1] + "-" + dateVal2_rev[0];
    // console.log(`date: ${dateVal2}`)
    dateUrl2 = `&date=` + dateVal2
  });

      document.querySelector('#form2').addEventListener('submit', (ev) => {
        ev.preventDefault();
        finalQueryUrl2= baseUrl + distUrl2 + dateUrl2
        // console.log(finalQueryUrl2)
      
      // Select the HTML element where I want to place all centers Information. 
          let centersDiv2 = document.getElementById('centers-2');
          centersDiv2.classList.remove("hidden")
          


            let form_2_interval = document.getElementById("minutes-time2").value;

     
          if (form_2_interval >= 1) {
              
            // Search Every first Immediately 
            fetchData(); // Fetch Data once.
            setInt2 = setInterval(fetchData, form_2_interval*60*1000); // Fetch Data Every 60 Seconds after first data fetch.. 
            document.querySelector("#btn_stop_search2").addEventListener('click', (ev) => {
                stopSearch2();
              ev.preventDefault()
              audio.pause()
              
              function stopSearch2() {
                  clearInterval(setInt2);
                  document.querySelector("#centers-2 #search_status").innerText = "Search Aborted by You."
                  document.querySelector("#centers-2 #search_status").style.color = "red"
                  document.querySelector("#centers-2 #search_status").style.fontWeight = "bold"
              }
          })
            }

        function fetchData() {

          fetch(finalQueryUrl2)
          .then( res => res.json())
          .then( data => {
            let centers = data.sessions;
            console.log("Searching...");
            let searchedTime = new Date();
            let form2_vac_choice = document.querySelector("form#form2 select#vactype").value
            let form2_dose = parseInt(document.querySelector("form#form2 select#dosenum").value)
            let centersHTML = `<div style="text-align: center"><span id="search_status">Searching every ${form_2_interval * 60} Seconds</span> <br> Last Searched Time: ${searchedTime} </div>`;
            let numberOfDoses
            centers.forEach((center) => {
              if (form2_dose === 0) {
                numberOfDoses = center.available_capacity
                console.log("ceter.available_capacity is chosen");
              } else if (form2_dose === 1) {
                numberOfDoses = center.available_capacity_dose1
                console.log("ceter.available_capacity_dose1 is chosen");

              } else if (form2_dose === 2) {
                numberOfDoses = center.available_capacity_dose2
                console.log("ceter.available_capacity_dose2 is chosen");

              }
              console.log(numberOfDoses );
            if (numberOfDoses > minSlots && (center.min_age_limit === ageCategory || center.min_age_limit === 30) && (center.vaccine === form2_vac_choice ) && center.fee_type === vaccineCost) {
                
                    // console.log(center)
                    centersHTML += `
                    <div class="center">
                      <h4 style="text-align: center">${center.name}</h4>
                      <div>Address: ${center.address}</div>
                      <div>Age Limit: ${center.min_age_limit}+</div>
                      <div>Vaccine : ${center.vaccine}</div>
                      <div>Fee Type: ${center.fee_type}</div>
                      <div>Price : ${center.fee}</div>
                      <div>All Available Slots: ${center.available_capacity} <br>
                        Dose 1: ${center.available_capacity_dose1}<br>
                        Dose 2: ${center.available_capacity_dose2}
                      </div>
                      <div>Date :${center.date}</div>
                      <div><a href="https://selfregistration.cowin.gov.in/" target="_blank" >Book on Cowin!</a></div>
                     </div>
                      <hr>
                    `
                  }
                
            });
            centersDiv2.innerHTML = centersHTML + `<br> <hr><div id="last">Search Completed! If there are no results, choose a different district or wait for results to show up.</div>`;
            // console.log(centersHTML)
            if (document.querySelector("div#centers-2 div:nth-child(2)") != null) {
                audio.play()
          }
            console.log('Completed Search!')
          })
        }
      })
/** ********************** AJAX REQUESTS FOR GETTING DATA OF FORM 2 -- END ******************** */
        
/** ********************** AJAX REQUESTS FOR GETTING DATA OF FORM 3-- START ******************** */
let stateId3, districtId3, dateVal3, distUrl3, finalQueryUrl3, dateUrl3;
        
document.querySelector('form#form3 select#states').addEventListener('change', (event) => {
    stateId3 = event.target.value
    // console.log(`stateId3: ${stateId3}`);
    // AJAX Request for List of Districts
    if(stateId3 > 0) {
      let xhr = new XMLHttpRequest;
      xhr.open('GET',`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId3}`, true);
      xhr.onload = function() {
          let html = `<option selected="selected">Select Your District</option>`;
        if( this.status === 200) {
          var districtsObj = JSON.parse(this.responseText);
          var districtsArr = districtsObj.districts
        //   console.log(districtsArr)
          for(let i = 0; i< districtsArr.length; i++ ){
            html += `<option value="${districtsArr[i].district_id}">${districtsArr[i].district_name}</option>`
          }
        }
        document.querySelector("#districts3").innerHTML = html;

      }
      xhr.send();
    }
  })

  document.querySelector('select#districts3').addEventListener('change', (event) => {
    districtId3 = event.target.value
    // console.log(`districtId3: ${districtId3}`);
    distUrl3= "?district_id=" + districtId3;
  })

  document.querySelector('form#form3 input[type="date"]').addEventListener('input', event => {
    let dateVal3_rev =  event.target.value.split('-');
    // Correct format of Date for the Query String.
    dateVal3 = dateVal3_rev[2] + "-" + dateVal3_rev[1] + "-" + dateVal3_rev[0];
    // console.log(`dateVal3: ${dateVal3}`)
    dateUrl3 = `&date=` + dateVal3
  });

      document.querySelector('#form3').addEventListener('submit', (ev) => {
        ev.preventDefault();
        finalQueryUrl3= baseUrl + distUrl3 + dateUrl3
        // console.log(finalQueryUrl3)
      
      // Select the HTML element where I want to place all centers Information. 
          let centersDiv3 = document.getElementById('centers-3');
          centersDiv3.classList.remove("hidden")
          

          let form_3_interval = document.getElementById("minutes-time3").value;
        //   console.log(`form_3_interval: ${form_3_interval}`);
     
          if (form_3_interval >= 1) { 
              // Search Every first Immediately 
              fetchData(); // Fetch Data once.
              setInt3 = setInterval(fetchData, form_3_interval*60*1000); // Fetch Data Every 60 Seconds after first data fetch.. 
              document.querySelector("#btn_stop_search3").addEventListener('click', (ev) => {
                stopSearch3();
                ev.preventDefault()
                audio.pause()

              function stopSearch3() {
                  clearInterval(setInt3);
                  document.querySelector("#centers-3 #search_status").innerText = "Search Aborted by You."
                  document.querySelector("#centers-3 #search_status").style.color = "red"
                  document.querySelector("#centers-3 #search_status").style.fontWeight = "bold"
              }
          })
          }

        function fetchData() {

          fetch(finalQueryUrl3)
          .then( res => res.json())
          .then( data => {
            let centers = data.sessions;
            // console.log(centers);
            console.log("Searching...");
            let searchedTime = new Date();
            let form3_vac_choice = document.querySelector("form#form3 select#vactype").value
            let form3_dose = parseInt(document.querySelector("form#form3 select#dosenum").value)
            let centersHTML = `<div style="text-align: center"><span id="search_status">Searching every ${form_3_interval * 60} Seconds</span> <br> Last Searched Time: ${searchedTime} </div>`;
            let numberOfDoses
            centers.forEach((center) => {
              if (form3_dose === 0) {
                numberOfDoses = center.available_capacity
                console.log("ceter.available_capacity is chosen");
              } else if (form3_dose === 1) {
                numberOfDoses = center.available_capacity_dose1
                console.log("ceter.available_capacity_dose1 is chosen");

              } else if (form3_dose === 2) {
                numberOfDoses = center.available_capacity_dose2
                console.log("ceter.available_capacity_dose2 is chosen");

              }
              console.log(numberOfDoses );
            if (numberOfDoses > minSlots && (center.min_age_limit === ageCategory || center.min_age_limit === 30) && (center.vaccine === form3_vac_choice ) && center.fee_type === vaccineCost) {
                
                    // console.log(center)
                    centersHTML += `
                    <div class="center">
                      <h4 style="text-align: center">${center.name}</h4>
                      <div>Address: ${center.address}</div>
                      <div>Age Limit: ${center.min_age_limit}+</div>
                      <div>Vaccine : ${center.vaccine}</div>
                      <div>Fee Type: ${center.fee_type}</div>
                      <div>Price : ${center.fee}</div>
                      <div>All Available Slots: ${center.available_capacity} <br>
                        Dose 1: ${center.available_capacity_dose1}<br>
                        Dose 2: ${center.available_capacity_dose2}
                      </div>
                      <div>Date :${center.date}</div>
                      <div><a href="https://selfregistration.cowin.gov.in/" target="_blank" >Book on Cowin!</a></div>
                     </div>
                      <hr>
                    `
                  }
                
            });
            centersDiv3.innerHTML = centersHTML + `<br> <hr><div id="last">Search Completed! If there are no results, choose a different district or wait for results to show up.</div>`;
            // console.log(centersHTML)
            if (document.querySelector("div#centers-3 div:nth-child(2)") != null) {
                audio.play()
          }
            console.log('Completed Search!')
          })
        }
      })
        /** ********************** AJAX REQUESTS FOR GETTING DATA OF FORM 3 -- END ******************** */

let foundCenter = (document.querySelector("div#centers-1 div:nth-child(2)") != null)
    || (document.querySelector("div#centers-2 div:nth-child(2)") != null)
    || (document.querySelector("div#centers-3 div:nth-child(2)") != null)

console.log(foundCenter)
        
       
