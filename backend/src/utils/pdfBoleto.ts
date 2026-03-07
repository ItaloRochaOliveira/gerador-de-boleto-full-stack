
import BoletoData from "@/interfaces/IBoletoData";

const pdfBoleto = {
  generate: (data: BoletoData) => {
    return {
      content: [
        {
          columns: [
            {
              width: '50%',
              text: 'BANCO EXEMPLO',
              style: 'header',
              alignment: 'left'
            },
            {
              width: '50%',
              text: 'Boleto Bancário',
              style: 'header',
              alignment: 'right'
            }
          ]
        },
        '\n',
        {
          text: 'Dados do Pagador',
          style: 'subheader'
        },
        {
          table: {
            body: [
              ['Nome:', data.nomePagador],
              ['CPF/CNPJ:', data.cpfCnpj],
              ['Endereço:', data.endereco]
            ]
          },
          layout: 'noBorders'
        },
        '\n',
        {
          text: 'Dados do Boleto',
          style: 'subheader'
        },
        {
          table: {
            body: [
              ['Descrição/Referência:', data.descricao],
              ['Valor:', `R$ ${data.valor.toFixed(2)}`],
              ['Data de Vencimento:', data.dataVencimento]
            ]
          },
          layout: 'noBorders'
        },
        '\n',
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1
            }
          ]
        },
        '\n',
        {
          text: 'Linha Digitável: 12345.67890 12345.67890 12345.67890 1 23456789012345',
          style: 'codigoBarras'
        },
        '\n',
        {
          qr: 'QR_CODE_EXAMPLE',
          alignment: 'center',
          fit: 100
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        codigoBarras: {
          fontSize: 12,
          alignment: 'center',
          margin: [0, 10, 0, 10]
        }
      },
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60]
    };
  }
};

export { pdfBoleto, BoletoData };
