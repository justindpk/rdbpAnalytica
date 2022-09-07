const initialLoad = 100;
const amountToLoad = 50;
let counter = 0;
let sortBy_ = "rank";
let sortAscending = false;

window.onload = () => {
    loadTableHeader(duckConfig);
    fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, duckConfig);
    });
};
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.95) {
        console.log("loading more ducks");
        fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
            loadTableData(data[0], data[1],
                initialLoad + counter * amountToLoad,
                initialLoad + (counter + 1) * amountToLoad,
                configToUse, sortBy_, sortAscending);
            counter++;
        });

    }
};


class ColumnConfig {
    constructor() {
        this.headerName = null;
        this.columnKey = null;
        this.headerType = null;
        this.headerSrc = null;
        this.headerClass = null;
        this.staticColumn = null;
        this.columnType = 'strong';
        this.columnSrc = null;
        this.columnHref = null;
        this.columnClass = null;
        this.isSortable = false;
        this.sortClicked = false;
        this.isTrait = false;
    }

    setHeaderType(headerType) {
        this.headerType = headerType;
        return this;
    }

    setHeaderStatic(headerName) {
        this.headerName = headerName;
        return this;
    }

    setHeaderSrc(src) {
        this.headerSrc = src;
        return this;
    }

    setHeaderClass(headerClass) {
        this.headerClass = headerClass;
        return this;
    }

    setColumnKey(key) {
        this.columnKey = key;
        return this;
    }

    setColumnStatic(value) {
        this.staticColumn = value;
        return this;
    }

    setColumnType(type) {
        this.columnType = type;
        return this;
    }

    setColumnSrc(src) {
        this.columnSrc = src;
        return this;
    }

    setColumnHref(href) {
        this.columnHref = href;
        return this;
    }

    setColumnClass(columnClass) {
        this.columnClass = columnClass;
        return this;
    }

    getHeaderTag() {
        let tag = `<th scope="col">`
        if (this.headerName) {
            tag += `${this.headerName}`
        } else {
            tag += `<${this.headerType} `
            if (this.headerClass) {
                tag += `class="${this.headerClass}" `
            }
            if (this.headerSrc) {
                tag += `src="${this.headerSrc}" `
            }
            tag += `>`
        }
        tag += `</th>`
        return tag;

    }

    sortable() {
        this.isSortable = true;
        return this;
    }

    getColumnTag(duckData, traitTable) {
        let filename;
        let tag = `<td>`

        if (this.columnHref) {
            tag += `<a href="${this.columnHref}">`
        }
        tag += `<${this.columnType} `
        if (this.columnClass) {
            tag += `class="${this.columnClass}"`
        }
        if (this.staticColumn || this.columnKey && this.columnType !== 'img') {
            tag += `>${this.staticColumn ? this.staticColumn : duckData[this.columnKey]}</${this.columnType}>`
        } else if (this.columnSrc || this.columnType === 'img') {
            if (this.isTrait) {
                if (duckData[this.columnKey]) {
                    filename = '';
                    const columnKey = String(this.columnKey)[0].toUpperCase() + String(this.columnKey).slice(1);
                    for (const traits of Object.values(traitTable[columnKey])) {
                        if (duckData[this.columnKey].toLowerCase() === traits.name.toLowerCase()) {
                            filename = traits.id < 10 ? `0${traits.id}` : traits.id;
                            filename += '.png';
                            break;
                        }
                    }
                } else {
                    filename = '0.png';
                }
                tag += `src="${this.columnSrc}${filename}">`
            } else {
                tag += `src="${this.columnSrc ? this.columnSrc : duckData[this.columnKey]}">`
            }
        }
        if (this.columnHref) {
            tag += `</a>`
        }
        tag += `</td>`
        return tag;
    }
    trait() {
        this.isTrait = true;
        return this;
    }
}

// <th scope="col"><img class="duckIcon" src="/client/public/img/duckIcon.svg"></th>

function columnConfig() {
    return new ColumnConfig()
}

const duckConfig = [
    columnConfig().setHeaderStatic("Rank").setColumnKey("rank").sortable(),
    columnConfig().setHeaderType('img').setHeaderClass("duckIcon").setHeaderSrc("/client/public/img/duckIcon.svg").setColumnKey("img").setColumnType('img').setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Number").setColumnKey("id").sortable(),
    columnConfig().setHeaderStatic("Version").setColumnKey("version").sortable(),
    columnConfig().setHeaderStatic("Parties").setColumnKey("parties").sortable(),
    columnConfig().setHeaderStatic("Rank Change").setColumnKey("rarityChange").sortable(),
    columnConfig().setHeaderStatic("Owner").setColumnStatic("bludmoneyy"),
    //columnConfig().setHeaderStatic("Days Owned").setColumnStatic("184"),
    columnConfig().setHeaderStatic("Sales").setColumnStatic("3"),
    columnConfig().setHeaderStatic("Last Sale").setColumnStatic(".33 ETH"),
    columnConfig().setHeaderStatic("Listed").setColumnStatic("No"),
    columnConfig().setHeaderStatic("Opensea").setColumnType('img').setColumnSrc("/client/public/img/opensea.svg").setColumnHref("https://opensea.io/collection/rubber-duck-bath-party")
]

const traitConfig = [
    columnConfig().setHeaderStatic("Rank").setColumnKey("rank").sortable(),
    columnConfig().setHeaderType('img').setHeaderClass("duckIcon").setHeaderSrc("/client/public/img/duckIcon.svg").setColumnKey("img").setColumnType('img').setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Number").setColumnKey("id").sortable(),
    columnConfig().setHeaderStatic("Heads").setColumnSrc("/client/public/img/heads/").setColumnKey("head").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Eyes").setColumnSrc("/client/public/img/eyes/").setColumnKey("eyes").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Necks").setColumnSrc("/client/public/img/necks/").setColumnKey("neck").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Beaks").setColumnSrc("/client/public/img/beaks/").setColumnKey("beak").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Shirts").setColumnSrc("/client/public/img/shirts/").setColumnKey("shirt").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Tattoos").setColumnSrc("/client/public/img/tattoos/").setColumnKey("tattoo").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Covers").setColumnSrc("/client/public/img/covers/").setColumnKey("cover").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Backgrounds").setColumnSrc("/client/public/img/backgrounds/").setColumnKey("background").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Listed").setColumnStatic("No"),
    columnConfig().setHeaderStatic("Opensea").setColumnType('img').setColumnSrc("/client/public/img/opensea.svg").setColumnHref("https://opensea.io/collection/rubber-duck-bath-party")
]

function loadTableHeader(config) {
    const tableHeader = document.getElementById('tableHeader');
    let header = '<tr>';
    for (let column of config) {
        header += column.getHeaderTag();
    }
    header += '</tr>';
    tableHeader.innerHTML = header;

    const headers = tableHeader.querySelectorAll('th');
    for (let i in config) {
        if (config[i].isSortable) {
            headers[i].addEventListener('click', () => {
                sortBy_ = config[i].columnKey;
                config[i].sortClicked = !config[i].sortClicked;
                sortAscending = !sortAscending;
                fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
                    loadTableData(data[0], data[1], 0, initialLoad, configToUse, config[i].columnKey, config[i].sortClicked);
                });
            })
        }
    }
}


function loadTableData(duckData, traitData, start, stop, config, sortBy = "rank", ascending = true) {
    if (ascending) {
        duckData.sort((a, b) => a[sortBy] - b[sortBy]);
    } else {
        duckData.sort((a, b) => b[sortBy] - a[sortBy]);
    }
    const tableBody = document.getElementById('tableData');
    let ducks = [];
    for (let i = start; i < stop; i++) {
        ducks.push(duckData[i]);
    }
    let duckTable = "";
    for (let duck of ducks) {
        let duckRow = '<tr>';
        for (let column of config) {
            duckRow += column.getColumnTag(duck, traitData);
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

let configToUse = duckConfig;
function generateTraitTable(){
    configToUse = traitConfig;
    loadTableHeader(traitConfig);
    fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, traitConfig);
    });
}

function generateDuckTable(){
    loadTableHeader(duckConfig);
    fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, duckConfig);
    });
}