// function to get the input search field text area
const getInputValue = (id) => {
    const searchField = document.getElementById(id).value;
    document.getElementById(id).value = ""; // Clear input field
    return searchField;
};
// function to make url from the search text
const searchInfo = (searchText) => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
    return url;
};
// function to set the display property of an element
const setDisplay = (id, dis) => {
    document.getElementById(id).style.display = dis;
};
// function to show message below the search box
const showTextMessage = (text) => {
    setDisplay("spinner", "none");
    setDisplay("text-message", "block");
    document.getElementById("text-message").innerHTML = text;
};

// function to display data found from api
const displayData = (data) => {
    let text;
    const searchResult = document.getElementById("search-result");
    const phoneData = data.data.slice(0, 20); //get first 20 phones
    const phoneNumber = phoneData.length;
    if (phoneNumber >= 20) {
        text = `Showing results 20 out of ${data.data.length}`; // If more than 20 phones then showing first 20
    } else if (phoneNumber < 20) {
        text = `Showing results ${phoneNumber} out of ${data.data.length}`; // If not more than 20, then showing available phones
    } else {
        text = "No Result Found"; // No phones were found
    }
    showTextMessage(text);

    phoneData.forEach((phone) => {
        let { brand, phone_name, image } = phone; // Destructuring
        let phoneBrand, phoneName, phoneImage;
        const phoneId = phone.slug;

        // Ternary operators to check if all data are present or not. If not, then set the value as Unknown
        image === undefined ?
            (phoneImage = "/images/not-found.jpg") :
            (phoneImage = image);
        phone_name === undefined ?
            (phoneName = "Unknown") :
            (phoneName = phone_name);
        brand === undefined ? (phoneBrand = "Unknown") : (phoneBrand = brand);

        const phoneDiv = document.createElement("div");
        phoneDiv.innerHTML = `
    <div class="col cursor" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick="loadDetail('${phoneId}')">
        <div class="card h-100 p-3 rounded shadow-lg">
            <img src=${phoneImage} class="card-img-top img-fluid" alt="${phoneName}">
            <div class="card-body">
                <h5 class="card-title text-center mb-3 fw-bolder">${phoneName}</h5>
                <p class="card-text"><span class="fw-bolder details">Brand:</span> ${phoneBrand} </p>
                <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick="loadDetail('${phoneId}')">Details</button>
            </div>
        </div>
    </div>
    `;
        searchResult.appendChild(phoneDiv);
    });
};

// function to fetch api data
const fetchData = (url) => {
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayData(data))
        .catch(() =>
            showTextMessage("Something went wrong. Please try again later!")
        );
};

// Search button event listener
document.getElementById("button-search").addEventListener("click", function() {
    const inputText = getInputValue("input-field");
    const url = searchInfo(inputText);
    setDisplay("text-message", "none");
    setDisplay("spinner", "block");
    const row = document.getElementById("search-result");
    //clear previous search data
    row.textContent = "";
    fetchData(url);
});

const loadDetail = async(phoneId) => {
    const url = `https://openapi.programming-hero.com/api/phone/${phoneId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.data);
};

const displayDetails = (data) => {
        const phoneTitle = document.getElementById("exampleModalLabel");
        phoneTitle.innerText = `${data.name}`;
        const phoneDetails = document.getElementById("phone-details");
        phoneDetails.innerHTML = "";
        const div = document.createElement("div");
        div.classList.add("container");

        div.innerHTML = `
  <div class="row">
            <div class="col-md-6 mx-auto">
                <img src="${
                  data.image ? data.image : "images/not-found.jpg"
                } " class="card-img-top img-fluid" alt="${data.name}">
            </div>
        </div>
        <div class="row my-3">
            <div class="col">
                <h6 class="card-text fw-bold">ReleaseDate : ${
                  data.releaseDate ? data.releaseDate : "Not Found"
                }</h6>
            </div>
        </div>
    <div class="row">
            <div class="col-md-6">
                <h6 class="card-title fw-bold my-3">Main Features: </h6>
                <ul>
                    <li class="card-text">Display Size : ${
                      data.mainFeatures.displaySize
                        ? data.mainFeatures.displaySize
                        : ""
                    }</li>
                    <li class="card-text">ChipSet : ${
                      data.mainFeatures.chipSet ? data.mainFeatures.chipSet : ""
                    }</li>
                    <li class="card-text">Storage : ${
                      data.mainFeatures.storage ? data.mainFeatures.storage : ""
                    }</li>
                    <li class="card-text">Memory : ${
                      data.mainFeatures.memory ? data.mainFeatures.memory : ""
                    }</li>
                    <li class="card-text">Sensors :
                        <ul>
                          ${data.mainFeatures.sensors[0] ? `
                            <li class="card-text">${data.mainFeatures.sensors[0]}</li>
                          ` : ''}
                          ${data.mainFeatures.sensors[1] ? `
                            <li class="card-text">${data.mainFeatures.sensors[1]}</li>
                          ` : ''}
                          ${data.mainFeatures.sensors[2] ? `
                            <li class="card-text">${data.mainFeatures.sensors[2]}</li>
                          ` : ''}
                          ${data.mainFeatures.sensors[3] ? `
                            <li class="card-text">${data.mainFeatures.sensors[3]}</li>
                          ` : ''}
                          ${data.mainFeatures.sensors[4] ? `
                            <li class="card-text">${data.mainFeatures.sensors[4]}</li>
                          ` : ''}
                          ${data.mainFeatures.sensors[5] ? `
                            <li class="card-text">${data.mainFeatures.sensors[5]}</li>
                          ` : ''}
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="col-md-6"> ${
              data.others
                ? `
                <h6 class="card-title fw-bold my-3">Others: </h6>
                <ul>
                    <li><span>WLAN:</span> ${data.others.WLAN}</li>
                    <li><span>Bluetooth:</span> ${data.others.Bluetooth}</li>
                    <li><span>GPS:</span> ${data.others.GPS}</li>
                    <li><span>NFC:</span> ${data.others.NFC}</li>
                    <li><span>Radio:</span> ${data.others.Radio}</li>
                    <li><span>USB:</span> ${data.others.USB}</li>
                </ul>
            `
                : ""
            }
            </div>
        </div>
    `;
  phoneDetails.appendChild(div);
};