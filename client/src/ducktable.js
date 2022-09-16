const initialLoad = 200;
const amountToLoad = 100;
let counter = 0;
let sortBy_ = "rank";
let sortAscending = true;
let duckDatabasePromise;

window.onload = () => {
    duckDatabasePromise = fetch('http://localhost:3005/api').then(res => res.json());
    duckDatabasePromise.then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, duckConfig)
    });
    loadTableHeader(duckConfig).then();
};

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight * 0.95) {
        console.log("loading more ducks");
        duckDatabasePromise.then(data => {
            loadTableData(data[0], data[1],
                initialLoad + counter * amountToLoad,
                initialLoad + (counter + 1) * amountToLoad,
                configToUse);
            counter++;
        });
    }
};

async function pullTraitsFront(trait, key, duckDatabase) {
    let withTrait = [];
    let withoutTrait = [];
    for (let duck of duckDatabase[0]) {
        if (duck[trait.toLowerCase()] === key) {
            withTrait.push(duck);
        } else {
            withoutTrait.push(duck);
        }
    }
    duckDatabase = [withTrait.concat(withoutTrait), duckDatabase[1]];
    return duckDatabase;
}

function traitSort(value) {
    value = value.split(/ (.*)/s).slice(0, -1);
    const traitName = value[0];
    const traitValue = value[1];
    duckDatabasePromise = duckDatabasePromise.then(data => pullTraitsFront(traitName, traitValue, data));
    duckDatabasePromise.then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, configToUse);
    });
}

function sortByObjectValue(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

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
        this.isTrait = false;
        this.isAppendIdToColumnHref = false;
        this.isOpenColumnHrefNT = false;
        this.headerDropdown = false;
        this.headerDropdownFunction = null;
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

    getHeaderTag(traitTable) {
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
        if (this.headerDropdown) {
            tag += `<select class="hideable" onchange="${this.headerDropdownFunction}(value)">`
            let sortedTraits = traitTable[this.headerDropdownKey].sort((a, b) => sortByObjectValue(a, b));
            for (const value of sortedTraits) {
                tag += `<option value="${this.headerName} ${value["name"]}">${value["name"]}</option>`
            }
            tag += `</select>`
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
            tag += `<a href="${this.columnHref}${this.isAppendIdToColumnHref ? duckData.id : ""}"${this.isOpenColumnHrefNT ? " target=\"_blank\" " : ""}>`
            // console.log(tag)
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
            } else if (this.columnSrc && this.columnKey) {
                tag += `src="${this.columnSrc}${duckData[this.columnKey]}${this.columnType === "img" ? ".png" : ""}">`
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

    appendIdToColumnHref() {
        this.isAppendIdToColumnHref = true;
        return this;
    }

    openColumnHrefNT() {
        this.isOpenColumnHrefNT = true;
        return this;
    }

    setHeaderDropdown(headerName, traitKey) {
        this.headerDropdown = true;
        this.headerName = headerName;
        this.headerDropdownKey = traitKey;
        this.headerDropdownFunction = "traitSort";
        return this;
    }
}

// <th scope="col"><img class="duckIcon" src="/client/public/img/duckIcon.svg"></th>

function columnConfig() {
    return new ColumnConfig()
}

const duckConfig = [
    columnConfig().setHeaderStatic("rank").setColumnKey("rank").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("duckIcon").setHeaderSrc("/client/public/img/duckIcon.svg")
        .setColumnKey("img").setColumnType('img').setColumnClass("duckImage").setColumnHref("https://duck.art/").appendIdToColumnHref().openColumnHrefNT(),
    columnConfig().setHeaderStatic("Number").setColumnKey("id").sortable(),
    columnConfig().setHeaderStatic("Version").setColumnKey("version").sortable(),
    columnConfig().setHeaderStatic("Parties").setColumnKey("parties").sortable(),
    columnConfig().setHeaderStatic("Rank Change").setColumnKey("rarityChange").sortable(),
    columnConfig().setHeaderStatic("Owner").setColumnStatic("bludmoneyy"),
    //columnConfig().setHeaderStatic("Days Owned").setColumnStatic("184"),
    columnConfig().setHeaderStatic("Sales").setColumnStatic("3"),
    columnConfig().setHeaderStatic("Last Sale").setColumnStatic(".33 ETH"),
    columnConfig().setHeaderStatic("Listed").setColumnStatic("No"),
    columnConfig()
        .setHeaderStatic("Opensea")
        .setColumnType('img').setColumnSrc("/client/public/img/opensea.svg").setColumnHref("https://opensea.io/assets/ethereum/0x7a4d1b54dd21dde804c18b7a830b5bc6e586a7f6/")
        .appendIdToColumnHref().openColumnHrefNT(),
]

const traitConfig = [
    columnConfig().setHeaderStatic("Rank").setColumnKey("rank").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("duckIcon").setHeaderSrc("/client/public/img/duckIcon.svg")
        .setColumnKey("img").setColumnType('img').setColumnClass("duckImage").setColumnHref("https://duck.art/").appendIdToColumnHref().openColumnHrefNT(),
    columnConfig().setHeaderStatic("Number").setColumnKey("id").sortable(),
    columnConfig().setHeaderDropdown("Head", "Head").setColumnSrc("/client/public/img/heads/").setColumnKey("head").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderDropdown("Eyes", "Eyes").setColumnSrc("/client/public/img/eyes/").setColumnKey("eyes").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderDropdown("Neck", "Neck").setColumnSrc("/client/public/img/necks/").setColumnKey("neck").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderDropdown("Beak", "Beak").setColumnSrc("/client/public/img/beaks/").setColumnKey("beak").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderDropdown("Shirt", "Shirt").setColumnSrc("/client/public/img/shirts/").setColumnKey("shirt").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderDropdown("Tattoo", "Tattoo").setColumnSrc("/client/public/img/tattoos/").setColumnKey("tattoo").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderDropdown("Cover", "Cover").setColumnSrc("/client/public/img/covers/").setColumnKey("cover").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderDropdown("Background", "Background").setColumnSrc("/client/public/img/backgrounds/").setColumnKey("background").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Listed").setColumnStatic("No"),
    columnConfig()
        .setHeaderStatic("Opensea")
        .setColumnType('img').setColumnSrc("/client/public/img/opensea.svg").setColumnHref("https://opensea.io/assets/ethereum/0x7a4d1b54dd21dde804c18b7a830b5bc6e586a7f6/")
        .appendIdToColumnHref().openColumnHrefNT(),
]

const backpackConfig = [
    columnConfig()
        .setHeaderStatic("Rank")
        .setColumnKey("rank").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("duckIcon").setHeaderSrc("/client/public/img/duckIcon.svg")
        .setColumnKey("img").setColumnType('img').setColumnClass("duckImage").setColumnHref("https://duck.art/").appendIdToColumnHref().openColumnHrefNT(),
    columnConfig()
        .setHeaderStatic("Number").setColumnKey("id").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/emptyPaint.png")
        .setColumnSrc("/client/public/img/paintBuckets/").setColumnKey("Paint Bucket").setColumnType('img').setColumnClass("duckImage"),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/emptyWater.png")
        .setColumnSrc("/client/public/img/water/").setColumnKey("Water").setColumnType('img').setColumnClass("duckImage"),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/sandBag.png")
        .setColumnType('img').setColumnSrc("/client/public/img/bagOfSand/Unrevealed.png").setColumnClass("duckImage"),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/seed.png")
        .setColumnKey("Seed").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/egg.png")
        .setColumnKey("Egg").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/chest.png")
        .setColumnKey("Chest").sortable(),
    columnConfig()
        .setHeaderStatic("Listed")
        .setColumnStatic("No"),
    columnConfig()
        .setHeaderStatic("Opensea")
        .setColumnType('img').setColumnSrc("/client/public/img/opensea.svg").setColumnHref("https://opensea.io/assets/ethereum/0x7a4d1b54dd21dde804c18b7a830b5bc6e586a7f6/")
        .appendIdToColumnHref().openColumnHrefNT(),
]

function sortData(database, sortBy, ascending) {
    let duckData = database[0]
    if (ascending) {
        duckData.sort((a, b) => a[sortBy] - b[sortBy]);
    } else {
        duckData.sort((a, b) => b[sortBy] - a[sortBy]);
    }
    return [duckData, database[1]];
}

async function loadTableHeader(config) {
    const tableHeader = document.getElementById('tableHeader');
    let header = '<tr>';
    for (let column of config) {
        header += await duckDatabasePromise.then(data => column.getHeaderTag(data[1]));
    }
    header += '</tr>';
    tableHeader.innerHTML = header;

    const headers = tableHeader.querySelectorAll('th');
    for (let i in config) {
        if (config[i].isSortable) {
            headers[i].addEventListener('click', () => {
                if (sortBy_ !== config[i].columnKey) {
                    sortAscending = true;
                } else {
                    sortAscending = !sortAscending;
                }
                counter = 0;
                sortBy_ = config[i].columnKey;
                duckDatabasePromise = duckDatabasePromise.then((database) => sortData(database, sortBy_, sortAscending));
                duckDatabasePromise.then(data => {
                    loadTableData(data[0], data[1], 0, initialLoad, configToUse);
                });
            })
        }
    }
}


function loadTableData(duckData, traitData, start, stop, config) {


    const tableBody = document.getElementById('tableData');
    let ducks = duckData.slice(start, stop);
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

function generateTraitTable() {
    counter = 0;
    sortBy_ = "rank";
    sortAscending = true;
    configToUse = traitConfig;
    loadTableHeader(traitConfig).then();
    duckDatabasePromise.then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, traitConfig);
    });
}

function generateDuckTable() {
    counter = 0;
    sortBy_ = "rank";
    sortAscending = true;
    configToUse = duckConfig;
    loadTableHeader(duckConfig).then();
    duckDatabasePromise.then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, duckConfig);
    });
}

function generateBackpackTable() {
    counter = 0;
    sortBy_ = "rank";
    sortAscending = true;
    configToUse = backpackConfig;
    loadTableHeader(backpackConfig).then();
    duckDatabasePromise.then(data => {
        loadTableData(data[0], data[1], 0, initialLoad, backpackConfig);
    });
}