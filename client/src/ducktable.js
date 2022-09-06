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
    columnConfig().setHeaderStatic("Rank").setColumnKey("rank"),
    columnConfig().setHeaderType('img').setHeaderClass("duckIcon").setHeaderSrc("/client/public/img/duckIcon.svg").setColumnKey("img").setColumnType('img').setColumnClass("duckIcon"),
    columnConfig().setHeaderStatic("Number").setColumnKey("id"),
    columnConfig().setHeaderStatic("Version").setColumnKey("version"),
    columnConfig().setHeaderStatic("Parties").setColumnKey("parties"),
    columnConfig().setHeaderStatic("Rank Change").setColumnKey("rarityChange"),
    columnConfig().setHeaderStatic("Owner").setColumnStatic("bludmoneyy"),
    columnConfig().setHeaderStatic("Days Owned").setColumnStatic("184"),
    columnConfig().setHeaderStatic("Opensea").setColumnType('img').setColumnSrc("/client/public/img/opensea.svg").setColumnHref("https://opensea.io/collection/rubber-duck-bath-party"),
    columnConfig().setHeaderStatic("Looksrare").setColumnType('img').setColumnSrc("/client/public/img/looksrare.svg").setColumnHref("https://looksrare.org/collections/0x7A4D1b54dD21ddE804c18B7a830B5Bc6e586a7F6")
]

function loadTableHeader(config) {
    const tableHeader = document.getElementById('tableHeader');
    let header = '<tr>';
    for (let column of config) {
        header += column.getHeaderTag();
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
