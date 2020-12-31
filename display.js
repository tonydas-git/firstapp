getData();
async function getData() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('/api', options);
    const json = await response.json();
    json.forEach(element => {
        const root = document.createElement('div');
        const paragraph = document.createElement('p');
        const position = document.createElement('div');
        const browser = document.createElement('div');
        const id = document.createElement('div');

        position.textContent = `Geo Location : ${element.lat}, ${element.long}`;
        browser.textContent = `Browser : ${element.browser}`;
        id.textContent = `Id : ${element._id}`;
        paragraph.append(id, position, browser);
        root.append(paragraph);
        document.body.append(root);
    });
    console.log(json);
}