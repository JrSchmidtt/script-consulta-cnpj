const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const util = require('util');
const sleep = util.promisify(setTimeout);

async function fetchCNPJData() {
  const cnpjs = [
    "000000000000",
    // adicione os demais CNPJs aqui
  ];

  const csvWriter = createCsvWriter({
    path: 'dados_cnpj.csv',
    header: [
        { id: 'abertura', title: 'Abertura' },
        { id: 'situacao', title: 'Situação' },
        { id: 'tipo', title: 'Tipo' },
        { id: 'nome', title: 'Nome' },
        { id: 'fantasia', title: 'Fantasia' },
        { id: 'porte', title: 'Porte' },
        { id: 'natureza_juridica', title: 'Natureza Jurídica' },
        { id: 'atividade_principal', title: 'Atividade Principal' },
        { id: 'atividades_secundarias', title: 'Atividades Secundárias' },
        { id: 'qsa', title: 'QSA' },
        { id: 'logradouro', title: 'Logradouro' },
        { id: 'numero', title: 'Número' },
        { id: 'municipio', title: 'Município' },
        { id: 'bairro', title: 'Bairro' },
        { id: 'uf', title: 'UF' },
        { id: 'cep', title: 'CEP' },
        { id: 'email', title: 'E-mail' },
        { id: 'telefone', title: 'Telefone' },
        { id: 'data_situacao', title: 'Data Situação' },
        { id: 'cnpj', title: 'CNPJ' },
        { id: 'ultima_atualizacao', title: 'Última Atualização' },
        { id: 'status', title: 'Status' },
        { id: 'complemento', title: 'Complemento' },
        { id: 'efr', title: 'EFR' },
        { id: 'motivo_situacao', title: 'Motivo Situação' },
        { id: 'situacao_especial', title: 'Situação Especial' },
        { id: 'data_situacao_especial', title: 'Data Situação Especial' },
        { id: 'capital_social', title: 'Capital Social' },
        { id: 'extra', title: 'Extra' },
        { id: 'billing', title: 'Billing' }
        // ... adicione as demais colunas do CSV aqui
    ]
  });

  const results = [];

  for (const cnpj of cnpjs) {
    try {
      console.log(`Obtendo dados do CNPJ ${cnpj}...`);
      const token = ''; // adicione o token aqui 
      const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}/days/120`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = response.data;

      // Process the response data here
      data.atividade_principal = data.atividade_principal[0].text;
      data.atividades_secundarias = data.atividades_secundarias.map(atividade => atividade.text).join(';');
      data.qsa = data.qsa.map(qsa => qsa.nome).join(';');

      results.push(data);

      console.log(data);
    } catch (err) {
      console.error('Erro ao obter os dados do CNPJ:', err);
    }

    await sleep(10000); // 10 seconds delay
  }

  try {
    await csvWriter.writeRecords(results);
    console.log('Dados salvos em dados_cnpj.csv');
  } catch (err) {
    console.error('Erro ao salvar dados:', err);
  }
}

fetchCNPJData();
