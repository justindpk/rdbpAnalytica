const initialLoad = 50;
const amountToLoad = 20;
let counter = 0;
let sortBy_ = "rank";
let sortAscending = true;
let duckDatabasePromise;

window.onload = () => {
    duckDatabasePromise = fetch('http://localhost:3005/api').then(res => res.json());
    duckDatabasePromise = duckDatabasePromise.then((database) => sortData(database, sortBy_, sortAscending));
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

async function pullTraitFront(trait, key, duckDatabase) {
    let withTrait = [];
    let withoutTrait = [];
    for (let duck of duckDatabase[0]) {
        if (duck[trait.toLowerCase()] === key) {
            withTrait.push(duck);
        } else {
            withoutTrait.push(duck);
        }
    }
    return [withTrait.concat(withoutTrait)].concat(duckDatabase.slice(1));
}

function traitSort(value) {
    value = value.split(/,(.*)/s).slice(0, -1);
    const traitName = value[0];
    const traitValue = value[1];
    duckDatabasePromise = duckDatabasePromise.then(data => pullTraitFront(traitName, traitValue, data));
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
        this.dropdownType = null;
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

    getHeaderTag(traitTable, backpackRarity) {
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
            if (this.dropdownType === "trait") {
                let sortedTraits = traitTable[this.headerDropdownKey].sort((a, b) => sortByObjectValue(a, b));
                for (const value of sortedTraits) {
                    tag += `<option value="${this.headerDropdownKey},${value["name"]}">${value["name"]}</option>`
                }
            } else if (this.dropdownType === "backpack") {
                const uppercaseDropdownKey = this.headerDropdownKey.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                tag += `<option value=","></option>`
                for (const key of Object.keys(backpackRarity[uppercaseDropdownKey]).sort()) {
                    console.log(key);
                    tag += `<option value="${this.headerDropdownKey},${key}">${key}</option>`
                }
                console.log(backpackRarity[uppercaseDropdownKey]);
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

    addHeaderDropdown(headerName, type) {
        this.headerDropdown = true;
        this.headerDropdownKey = headerName;
        this.dropdownType = type;
        if (type === "trait") {
            this.headerDropdownFunction = "traitSort";
        } else if (type === "backpack") {
            this.headerDropdownFunction = "traitSort";
        } else {
            console.log("Error: Invalid type for setHeaderDropdown")
        }
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
    columnConfig().setHeaderStatic("Heads").addHeaderDropdown("Head", "trait").setColumnSrc("/client/public/img/heads/").setColumnKey("head").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Eyes").addHeaderDropdown("Eyes", "trait").setColumnSrc("/client/public/img/eyes/").setColumnKey("eyes").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Necks").addHeaderDropdown("Neck", "trait").setColumnSrc("/client/public/img/necks/").setColumnKey("neck").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Beaks").addHeaderDropdown("Beak", "trait").setColumnSrc("/client/public/img/beaks/").setColumnKey("beak").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Shirt").addHeaderDropdown("Shirt", "trait").setColumnSrc("/client/public/img/shirts/").setColumnKey("shirt").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Tattoo").addHeaderDropdown("Tattoo", "trait").setColumnSrc("/client/public/img/tattoos/").setColumnKey("tattoo").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Cover").addHeaderDropdown("Cover", "trait").setColumnSrc("/client/public/img/covers/").setColumnKey("cover").setColumnType('img').trait().setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Background").addHeaderDropdown("Background", "trait").setColumnSrc("/client/public/img/backgrounds/").setColumnKey("background").setColumnType('img').trait().setColumnClass("duckImage"),
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
        .addHeaderDropdown("paint bucket", "backpack")
        .setColumnSrc("/client/public/img/paintBuckets/").setColumnKey("paint bucket").setColumnType('img').setColumnClass("duckImage"),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/emptyWater.png")
        .addHeaderDropdown("water", "backpack")
        .setColumnSrc("/client/public/img/water/").setColumnKey("water").setColumnType('img').setColumnClass("duckImage"),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/sandBag.png")
        .setColumnType('img').setColumnSrc("/client/public/img/bagOfSand/Unrevealed.png").setColumnClass("duckImage"),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/seed.png")
        .setColumnKey("seed").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/egg.png")
        .setColumnKey("egg").sortable(),
    columnConfig()
        .setHeaderType('img').setHeaderClass("traitIcon").setHeaderSrc("/client/public/img/backpackItems/chest.png")
        .setColumnKey("chest").sortable(),
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
    return [duckData].concat(database.slice(1))
}

async function loadTableHeader(config) {
    const tableHeader = document.getElementById('tableHeader');
    let header = '<tr>';
    for (let column of config) {
        header += await duckDatabasePromise.then(data => column.getHeaderTag(data[1], data[2]));
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