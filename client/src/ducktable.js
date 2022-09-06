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

    getColumnTag(duckData) {
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
            tag += `src="${this.columnSrc ? this.columnSrc : duckData[this.columnKey]}">`
        }
        if (this.columnHref) {
            tag += `</a>`
        }
        tag += `</td>`
        return tag;

    }
}

// <th scope="col"><img class="duckIcon" src="/client/public/img/duckIcon.svg"></th>
console.log(columnConfig().setHeaderStatic("Rank").setColumnKey("rank").getHeaderTag());

function columnConfig() {
    return new ColumnConfig()
}

const homeConfig = [
    columnConfig().setHeaderStatic("Rank").setColumnKey("rank").sortable(),
    columnConfig().setHeaderType('img').setHeaderClass("duckIcon").setHeaderSrc("/client/public/img/duckIcon.svg").setColumnKey("img").setColumnType('img').setColumnClass("duckImage"),
    columnConfig().setHeaderStatic("Number").setColumnKey("id").sortable(),
    columnConfig().setHeaderStatic("Version").setColumnKey("version").sortable(),
    columnConfig().setHeaderStatic("Parties").setColumnKey("parties").sortable(),
    columnConfig().setHeaderStatic("Rank Change").setColumnKey("rarityChange").sortable(),
    columnConfig().setHeaderStatic("Owner").setColumnStatic("bludmoneyy"),
    columnConfig().setHeaderStatic("Days Owned").setColumnStatic("184"),
    columnConfig().setHeaderStatic("Opensea").setColumnType('img').setColumnSrc("/client/public/img/opensea.svg").setColumnHref("https://opensea.io/collection/rubber-duck-bath-party"),
    columnConfig().setHeaderStatic("Looksrare").setColumnType('img').setColumnSrc("/client/public/img/looksrare.svg").setColumnHref("https://looksrare.org/collections/0x7A4D1b54dD21ddE804c18B7a830B5Bc6e586a7F6")
]

const traitConfig = [
    columnConfig().setHeaderStatic("Heads").setColumnType("heads").setColumnSrc("/client/public/img/heads/").setColumnKey("heads").appendKeyToSrc(),
    columnConfig().setHeaderStatic("Eyes").setColumnType("eyes").setColumnSrc("/client/public/img/eyes/").setColumnKey("eyes").appendKeyToSrc(),
    columnConfig().setHeaderStatic("Necks").setColumnType("beaks").setColumnSrc("/client/public/img/beaks/").setColumnKey("beaks").appendKeyToSrc(),
    columnConfig().setHeaderStatic("Heads").setColumnType("necks").setColumnSrc("/client/public/img/necks/").setColumnKey("necks").appendKeyToSrc(),
    columnConfig().setHeaderStatic("Shirts").setColumnType("shirts").setColumnSrc("/client/public/img/shirts/").setColumnKey("necks").appendKeyToSrc(),
    columnConfig().setHeaderStatic("Tattoos").setColumnType("tattoos").setColumnSrc("/client/public/img/tattoos/").setColumnKey("tattoos").appendKeyToSrc(),
    columnConfig().setHeaderStatic("Covers").setColumnType("covers").setColumnSrc("/client/public/img/covers/").setColumnKey("covers").appendKeyToSrc(),
    columnConfig().setHeaderStatic("Backgrounds").setColumnType("backgrounds").setColumnSrc("/client/public/img/backgrounds/").setColumnKey("backgrounds").appendKeyToSrc()
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
    // console.log(headers.length, config.length);
    for (let i in config) {
        if (config[i].isSortable) {
            headers[i].addEventListener('click', () => {
                config[i].sortClicked = !config[i].sortClicked;
                fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
                    loadTableData(data, 0, initialLoad, homeConfig, config[i].columnKey, config[i].sortClicked);
                });
            })
        }
    }
}


function loadTableData(duckData, start, stop, config, sortBy="rank", ascending=true) {
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
            duckRow += column.getColumnTag(duck);
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

function generateTraitTable(){
    loadTableHeader(traitConfig);
    fetch('http://localhost:3005/api').then(res => res.json()).then(data => {
        loadTableData(data, 0, initialLoad, traitConfig);
    });
}
