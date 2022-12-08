import './index.css';
console.log('hello from renderer')

const parseButton = document.getElementById('parse-button');
const linkInput = document.getElementById('link-input');
const div = document.getElementById('parsed-result');

parseButton.addEventListener('click', () => {
    const loadingElement = document.createElement('div');
    loadingElement.setAttribute("id", "loading");
    loadingElement.innerText = 'загружается...';
    parseButton.append(loadingElement);
    const inputValue = linkInput.value;
    window.electronAPI.parsePage('https://www.2dehands.be/l/kinderen-en-baby-s/autostoeltjes/#q:stokke|Language:fr-BE|searchInTitleAndDescription:true');
});

window.electronAPI.onScrapResult((event, value) => {
    // div.innerHTML = null;
    const loading = document.getElementById('loading')
    loading.remove();
    
    value.map(item => {
        const node = document.createElement("div");
        node.innerText = item.title + ' ' + item.price;
        div.appendChild(node);
    });
})
