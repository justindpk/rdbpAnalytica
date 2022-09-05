const initial_load = 100;
let counter = 0;

window.onload = () => {
    fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
        loadTableData(data, 0, initial_load);
    });
};
window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        console.log("loading more ducks");
        fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
            loadTableData(data, initial_load + counter * 30, initial_load + (counter + 1) * 30);
            counter++;
        });

    }
};


    function loadTableData(duckData, start, stop) {
        // Potential modular function
        // function generateTable(array) {
        //     duckRow = `<tr>`
        //     for (let i = 0; i < array.length; i++) {
        //         if (array[i].includes('.png')) {
        //             duckRow += `<td><img className="duckImage" src="${array[i]}"></td>    `;
        //         } else {
        //             duckRow += `<td><strong class="rowTitle">${array[i]}</strong></td>`;
        //         }
        //         duckRow += `<td>
        //             <a href="https://opensea.io/collection/rubber-duck-bath-party" class="rowTitle"><img src="/client/public/img/opensea.svg"></a>
        //             </td>`
        //         duckRow += `</tr>`;
        //         return duckRow;
        //     }
        //     generateTable(["rank", "img", "id", "version", "parties", "rarityChange"]);
        console.log(start, stop)
        // console.log(duckData);
        const tableBody = document.getElementById('tableData');
        let duckRow = '';
        let ducks = [];
        for (let i = start; i < stop; i++) {
            ducks.push(duckData[i]);
        }
        console.log(ducks.length);
        /*
            id rank version rarityChange img parties
        */
        for (let duck of ducks) {
            duckRow += `<tr>
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
            // console.log(tableBody.innerHTML, typeof tableBody.innerHTML);
        }
        if (start === 0) {
            tableBody.innerHTML = duckRow;
        } else {
            tableBody.innerHTML += duckRow;
            // tableBody.insertAdjacentHTML("afterend", duckRow);
        }
    }
