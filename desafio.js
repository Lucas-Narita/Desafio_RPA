const { Builder, By, until } = require('selenium-webdriver');

async function scrapeData() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navegue até a página especificada
        await driver.get('http://webapplayers.com/inspinia_admin-v2.9.4/table_data_tables.html');

        // Função para extrair dados de todas as linhas de uma página
        async function extractDataFromPage() {
            let rows = await driver.findElements(By.css('tr.gradeA.odd, tr.gradeA.even'));
            for (let row of rows) {
                let cells = await row.findElements(By.css('td'));
                let rowData = [];
                for (let cell of cells) {
                    let text = await cell.getText();
                    rowData.push(text);
                }
                console.log(rowData);
            }
        }

        // Aguarde até que o elemento tbody esteja presente
        await driver.wait(until.elementLocated(By.css('tbody')), 10000);

        // Extrair dados da primeira página
        await extractDataFromPage();

        // Navegar para a segunda página e extrair dados
        let secondPageButton = await driver.findElement(By.css('a.page-link[aria-controls="DataTables_Table_0"][data-dt-idx="2"]'));
        await secondPageButton.click();
        await driver.wait(until.elementLocated(By.css('tr.gradeA.odd, tr.gradeA.even')), 10000);
        await extractDataFromPage();

        // Navegar para a terceira página e extrair dados
        let thirdPageButton = await driver.findElement(By.css('a.page-link[aria-controls="DataTables_Table_0"][data-dt-idx="3"]'));
        await thirdPageButton.click();
        await driver.wait(until.elementLocated(By.css('tr.gradeA.odd, tr.gradeA.even')), 10000);
        await extractDataFromPage();

    } finally {
        await driver.quit();
    }
}

scrapeData();
