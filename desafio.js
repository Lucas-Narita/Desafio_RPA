const { Builder, By, until } = require('selenium-webdriver');
const xlsx = require('node-xlsx');
const fs = require('fs');

async function scrapeData() {
    let driver = await new Builder().forBrowser('chrome').build();
    let allData = [
        ['Rendering engine', 'Browser', 'Platform(s)', 'Engine version', 'CSS grade']
    ];

    try {
        // Navegue até a página especificada
        await driver.get('http://webapplayers.com/inspinia_admin-v2.9.4/table_data_tables.html');

        // Função para extrair dados de todas as linhas de uma página
        async function extractDataFromPage() {
            let rows = await driver.findElements(By.css('tr.gradeA.odd, tr.gradeA.even, tr.gradeC.odd, tr.gradeC.even, tr.gradeX.odd, tr.gradeX.even, tr.gradeU.odd, tr.gradeU.even'));
            for (let row of rows) {
                let cells = await row.findElements(By.css('td'));
                let rowData = [];
                for (let cell of cells) {
                    let text = await cell.getText();
                    rowData.push(text);
                }
                allData.push(rowData);
            }
        }

        // Aguarde até que o elemento tbody esteja presente
        await driver.wait(until.elementLocated(By.css('tbody')), 10000);

        // Extrair dados da primeira página
        await extractDataFromPage();

        // Navegar para a segunda página e extrair dados
        let secondPageButton = await driver.findElement(By.css('a.page-link[aria-controls="DataTables_Table_0"][data-dt-idx="2"]'));
        await secondPageButton.click();
        await driver.wait(until.elementLocated(By.css('tr.gradeA.odd, tr.gradeA.even, tr.gradeC.odd, tr.gradeC.even, tr.gradeX.odd, tr.gradeX.even, tr.gradeU.odd, tr.gradeU.even')), 10000);
        await extractDataFromPage();

        // Navegar para a terceira página e extrair dados
        let thirdPageButton = await driver.findElement(By.css('a.page-link[aria-controls="DataTables_Table_0"][data-dt-idx="3"]'));
        await thirdPageButton.click();
        await driver.wait(until.elementLocated(By.css('tr.gradeA.odd, tr.gradeA.even, tr.gradeC.odd, tr.gradeC.even, tr.gradeX.odd, tr.gradeX.even, tr.gradeU.odd, tr.gradeU.even')), 10000);
        await extractDataFromPage();

        // Criar um buffer com os dados e escrever no arquivo Excel
        const worksheet = xlsx.build([{ name: 'Data', data: allData }]);
        fs.writeFileSync('scraped_data.xlsx', worksheet);

        console.log('Data has been written to scraped_data.xlsx');
    } finally {
        await driver.quit();
    }
}

async function fillFormWithText(driver, rowData) {
    let formattedText = rowData.join(' ') + ';\n'; // Formatar os dados conforme solicitado
    let contentEditableDiv = await driver.findElement(By.css('div.note-editable.card-block[contenteditable="true"]'));
    await driver.executeScript("arguments[0].innerHTML += arguments[1];", contentEditableDiv, formattedText);
}

async function readExcelAndFillForm() {
    const data = xlsx.parse(fs.readFileSync('scraped_data.xlsx'));
    const sheetData = data[0].data; // Assuming there's only one sheet and it's the first one

    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navegue até a página do formulário
        await driver.get('http://webapplayers.com/inspinia_admin-v2.9.4/form_editors.html');

        // Ignorar a primeira linha que é o cabeçalho
        for (let i = 1; i < sheetData.length; i++) {
            let row = sheetData[i];
            await fillFormWithText(driver, row);

            // Aqui você pode adicionar uma espera se necessário para observar o preenchimento do formulário
            await driver.sleep(1000);
        }

        console.log('Form has been filled with data from Excel.');
    } finally {
        await driver.quit();
    }
}

// Primeiro, scrapear os dados e gerar o Excel
scrapeData().then(() => {
    // Depois, ler o Excel gerado e preencher o formulário
    readExcelAndFillForm();
});
