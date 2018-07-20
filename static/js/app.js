const LOADER = document.getElementById("loader");
const MODAL = document.getElementById("modal");
const SEARCH = document.getElementById("search");



function searchPlanet() {
    window.location.href =  `http://localhost:3000/search/planets/${SEARCH.value}`;
}


async function fillModal(button) {
    LOADER.innerHTML="<img src=\"/img/loader.gif\"/>";
    const planetName = button.name;
    const modal = document.getElementById("modal");
    //reset modal content
    modal.innerHTML = "";

    // get info about planet
    const planetInfo = await fetch(`/search/residents/${planetName}`);
    const residents = await planetInfo.json();

    generateResidentsTable(planetName, residents, modal)
}


function generateResidentsTable(planetName, residents) {

    const header = document.createElement("h2");
    header.className = "text-center m-5";
    header.innerText = planetName;
    MODAL.append(header);

    const table = document.createElement("table");
    table.className = "table table-hover text-center";
    table.id = "table";
    MODAL.append(table);


    const tableHeader = document.createElement("thead");
    tableHeader.innerHTML =
            `<tr>
            <th scope="col">Name</th>
            <th scope="col">Height [cm]</th>
            <th scope="col">Mass [kg]</th>
            <th scope="col">Skin Color</th>
            <th scope="col">Birth Year</th>
            <th scope="col">Gender</th>
            </tr>`;
    table.append(tableHeader);

    residents.forEach( resident => {
        let row = document.createElement("tr");
        row.innerHTML =
            `<td>${resident.name}</td>
            <td>${resident.height}</td>
            <td>${resident.mass}</td>
            <td>${resident.skin_color}</td>
            <td>${resident.birth_year}</td>
            <td>${resident.gender}</td>`;
        table.append(row);
    });

    LOADER.innerHTML = "";
}