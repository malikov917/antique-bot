import './index.css';

const parseButton = document.getElementById('parse-button');
const linkInput = document.getElementById('link-input');
const div = document.getElementById('parsed-result');
const table = document.getElementById('table');

parseButton.addEventListener('click', () => {
    const loadingElement = document.createElement('div');
    loadingElement.setAttribute("id", "loading");
    loadingElement.innerText = 'загружается...';
    parseButton.append(loadingElement);
    const inputValue = linkInput.value.length ? linkInput.value : null;
    window.electronAPI.parsePage(inputValue);
});

window.electronAPI.onScrapResult((event, value) => {
    // div.innerHTML = null;
    const loading = document.getElementById('loading')
    loading.remove();
    if (value && value.length) {
        generateTableHead(table, value[0]);
        generateTable(table, value);
    }
})

window.electronAPI.onInfoEvent((event, value) => {
    if (value.dbConnectedEvent) {
        const dbStatus = document.getElementById('db-status')
        dbStatus.innerText = 'База подключена ✅';
    }
})

function generateTableHead(table, data) {
    const thead = table.createTHead();
    const row = thead.insertRow();
    for (const key in data) {
        const th = document.createElement("th");
        const text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (const element of data) {
        const row = table.insertRow();
        for (const key in element) {
            const cell = row.insertCell();
            const text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}
