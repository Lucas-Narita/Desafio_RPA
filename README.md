# Desafio_RPA

Este projeto consiste em automatiza o processo de raspagem de dados de uma página web específica, armazenando esses dados em um arquivo Excel gerado por ele, e depois utilizando os dados do arquivo Excel gerado para preencher um formulário em outra página web, demostrando a integração de raspagem de dados web, armazenamento de dados e a automação deste processo utilizando Node.js e Selenium.


## Pré-Requisitos

- Node.js instalado em sua máquina

- Navegador Chrome instalado

- ChromeDriver instalado e acessível no PATH do sistema

## Configuração

- Clone este repositório ou copie o código para um diretório em sua máquina.

- Navegue até o diretório no seu terminal.

- Execute o seguinte comando para instalar as dependências necessárias:
```bash
npm install selenium-webdriver node-xlsx fs
```
```bash
git clone https://github.com/Lucas-Narita/Desafio_RPA
```

## Executar o script
```bash
node desafio.js
```
## Ferramentas Utilizadas
- NodeJs
- selenium-webdriver
- Node-xlsx
- git
## Notas

- O script possui um atraso de 30 segundos para permitir que você veja o formulário sendo preenchido.


## License

[MIT](https://choosealicense.com/licenses/mit/)
