window.onload = () => {
    fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
        loadTableData(data);
    });
};

function loadTableData(duckData) {
    const itemsToDisplay = 100;
    // console.log(duckData);
    const tableBody = document.getElementById('tableData');
    let duckRow = '';
    let ducks = [];
    for (let i = 0; i < itemsToDisplay; i++) {
        ducks.push(duckData[i]);
    }
    /*
        id rank version rarityChange img parties
    */

    for (let duck of ducks) {
        duckRow += ` <tr>
                    <td>
                        <strong class="rowTitle">${duck.rank}</strong>
                    </td>
                    <td>
                        <img class="duckImage" src="${duck.img}">
                    </td>
                    <td>
                    <strong class="rowTitle">${duck.id}</strong>
                    </td>
                    <td>
                    <strong class="rowTitle">${duck.version}</strong>
                    </td>
                    <td>
                    <strong class="rowTitle">${duck.parties}</strong>
                    </td>
                    <td>
                    <strong class="rowTitle">${duck.rarityChange}</strong>
                    </td>
                    <td>
                    <strong class="rowTitle">bludmoneyy</strong>
                    </td>
                    <td>
                    <strong class="rowTitle">184</strong>
                    </td>
                    <td>
                    <a href="https://opensea.io/collection/rubber-duck-bath-party" class="rowTitle"><img src="/client/public/img/opensea.svg"></a>
                    </td>
                    <td>
                    <a href="https://opensea.io/collection/rubber-duck-bath-party" class="rowTitle"><img src="/client/public/img/looksrare.svg"></a>
                    </td>
                    </tr>`;
        tableBody.innerHTML = duckRow;
    }
}
