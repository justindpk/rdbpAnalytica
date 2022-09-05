const initialLoad = 100;
const amountToLoad = 50;
let counter = 0;

window.onload = () => {
    loadTableHeader(homeConfig);
    fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
        loadTableData(data, 0, initialLoad, homeConfig);
    });
};
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.95) {
        console.log("loading more ducks");
        fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
            loadTableData(data,
                initialLoad + counter * amountToLoad,
                initialLoad + (counter + 1) * amountToLoad,
                homeConfig);
            counter++;
        });

    }
};

function columnConfig(columnName=null, duckKey=null, rowOverride=false) {
    return {
        headerName: columnName,
        key: duckKey,
        override: rowOverride
    }
}

const homeConfig = [
    columnConfig("Rank", "rank"),
    columnConfig(`<img class="duckIcon" src="/client/public/img/duckIcon.svg">`, "img"),
    columnConfig("Number", "id"),
    columnConfig("Version", "version"),
    columnConfig("Parties", "parties"),
    columnConfig("Rank Change", "rarityChange"),
    columnConfig("Owner", "bludmoneyy", true),
    columnConfig("Days Owned", "184", true),
    columnConfig("Opensea", `<img src="/client/public/img/opensea.svg">`, true),
    columnConfig("Looksrare", `<img src="/client/public/img/looksrare.svg">`, true),
]

const imageSuffixes = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];

function loadTableHeader(config) {
    const tableHeader = document.getElementById('tableHeader');
    let header = '<tr>';
    for (let column of config) {
        header += `<th scope="col">${column.headerName}</th>`;
    }
    header += '</tr>';
    tableHeader.innerHTML = header;
}

function loadTableData(duckData, start, stop, config) {
    const tableBody = document.getElementById('tableData');
    let ducks = [];
    for (let i = start; i < stop; i++) {
        ducks.push(duckData[i]);
    }
    let duckTable = "";
    for (let duck of ducks) {
        let duckRow = '<tr>';
        for (let column of config) {
            if (column.override) {
                if (column.key.includes(".img") || column.key.includes(".svg")) {
                    duckRow += `<td><a href="https://opensea.io/collection/rubber-duck-bath-party" class="rowTitle">
                                ${column.key}
                                </a></td>`;
                } else {
                    console.log("rowOverride", column.override);
                    duckRow += `<td><strong class="rowTitle">${column.key}</strong></td>`;
                }

            } else if (duck.hasOwnProperty(column.key) && imageSuffixes.some(suffix => String(duck[column.key]).endsWith(suffix))) {
                duckRow += `<td><img class="duckIcon" src="${duck[column.key]}"></td>`;
            } else {
                duckRow += `<td><strong class="rowTitle">${duck[column.key]}</strong></td>`;
            }
        }
        duckRow += '</tr>';
        duckTable += duckRow;
    }
    if (start === 0) {
        tableBody.innerHTML = duckTable;
    } else {
        tableBody.innerHTML += duckTable;
    }
}
