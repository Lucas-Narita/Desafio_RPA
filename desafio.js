const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');
const xlsx = require('node-xlsx');

async function scrapeTable() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await driver.get('http://webapplayers.com/inspinia_admin-v2.9.4/table_data_tables.html');
        let rows = await driver.findElements(By.css('table#DataTables_Table_0 tbody tr'));
        let data = [];
        
        for (let row of rows) {
            let cells = await row.findElements(By.css('td'));
            let rowData = [];
            for (let cell of cells) {
                rowData.push(await cell.getText());
            }
            data.push(rowData);
        }

        let buffer = xlsx.build([{ name: 'Table Data', data: data }]);
        fs.writeFileSync('data.xlsx', buffer);
    } finally {
        await driver.quit();
    }
}

scrapeTable();
