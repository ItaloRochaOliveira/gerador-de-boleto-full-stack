import { Response } from 'express';
import BoletoData from '../interfaces/IBoletoData';
import jsPDF from 'jspdf';

export class PdfGenerator {
  static async generateMultipleBoletosPdf(boletos: any[], res: Response): Promise<void> {
    try {
      if (!boletos || boletos.length === 0) {
        res.status(404).json({ error: 'Nenhum boleto encontrado para gerar PDF' });
        return;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 297] // A4
      });
      
      // Cores
      const primaryColor: [number, number, number] = [0, 102, 204]; // Azul médico
      const lightGray: [number, number, number] = [245, 245, 245];
      const darkGray: [number, number, number] = [100, 100, 100];
      const black: [number, number, number] = [0, 0, 0];
      
      // Adiciona cada boleto em uma nova página
      boletos.forEach((boleto, index) => {
        if (index > 0) {
          doc.addPage();
        }
        
        // Validação dos dados
        const valor = typeof boleto.valor === 'string' ? parseFloat(boleto.valor) : (boleto.valor || 0);
        
        // Cabeçalho
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFillColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('BOLETO BANCÁRIO', 105, 25, { align: 'center' });
        
        // Linha separadora
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.5);
        doc.line(10, 45, 200, 45);
        
        // Beneficiário (Empresa)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('Beneficiário:', 10, 55);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(black[0], black[1], black[2]);
        doc.text(`Nome: ${boleto.nomeEmpresa || ''}`, 10, 65);
        doc.text(`CNPJ/CPF: ${boleto.cpfCnpj || ''}`, 10, 75);
        doc.text(`Endereço: ${boleto.endereco || ''}`, 10, 85);
        
        // Linha separadora
        doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.line(10, 95, 200, 95);
        
        // Dados do Boleto
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(10, 100, 190, 60, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('Dados da Cobrança', 105, 115, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(black[0], black[1], black[2]);
        doc.text(`Descrição: ${boleto.descricaoReferencia || ''}`, 15, 130);
        doc.text(`Valor: R$ ${valor.toFixed(2).replace('.', ',')}`, 15, 145);
        doc.text(`Vencimento: ${boleto.vencimento ? new Date(boleto.vencimento).toLocaleDateString('pt-BR') : ''}`, 15, 155);
        
        // Código de Barras (simulado)
        doc.setFillColor(black[0], black[1], black[2]);
        doc.rect(15, 170, 40, 15, 'F');
        doc.setFillColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('12345', 25, 178, { align: 'center' });
        doc.text('67890', 25, 183, { align: 'center' });
        
        // Linha digitável (simulado)
        doc.setFont('courier', 'normal');
        doc.setFontSize(10);
        doc.text('Banco: 001 - Agência: 1234 - Conta: 56789-0', 15, 195);
        doc.text('Nosso Número: 12345678901234', 15, 205);
        doc.text('Código de Barras: 123456789012345678901234567890', 15, 215);
        
        // Rodapé
        doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.line(10, 240, 200, 240);
        
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('Este boleto é um documento válido apenas para pagamento até a data de vencimento.', 10, 250);
        doc.text('Após esta data, favor procurar os estabelecimentos conveniados.', 10, 257);
        doc.text('Em caso de dúvidas, contate o beneficiário.', 10, 264);
      });
      
      // Gerar PDF como buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      // Set headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=boletos-${Date.now()}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Enviar PDF
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Error generating multiple boletos PDF:', error);
      res.status(500).json({ error: 'Erro ao gerar PDF dos boletos', details: error?.message || 'Unknown error' });
    }
  }

  static async generateBoletoPdf(boletoData: BoletoData, res: Response): Promise<void> {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 297] // A4
      });
      
      // Cores
      const primaryColor: [number, number, number] = [0, 102, 204]; // Azul médico
      const lightGray: [number, number, number] = [245, 245, 245];
      const darkGray: [number, number, number] = [100, 100, 100];
      const black: [number, number, number] = [0, 0, 0];
      
      // Cabeçalho
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFillColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('BOLETO BANCÁRIO', 105, 25, { align: 'center' });
      
      // Linha separadora
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(10, 45, 200, 45);
      
      // Beneficiário (Empresa)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Beneficiário:', 10, 55);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(`Nome: ${boletoData.nomePagador}`, 10, 65);
      doc.text(`CNPJ/CPF: ${boletoData.cpfCnpj}`, 10, 75);
      doc.text(`Endereço: ${boletoData.endereco}`, 10, 85);
      
      // Linha separadora
      doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.line(10, 95, 200, 95);
      
      // Dados do Boleto
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(10, 100, 190, 60, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Dados da Cobrança', 105, 115, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(`Descrição: ${boletoData.descricao}`, 15, 130);
      doc.text(`Valor: R$ ${boletoData.valor.toFixed(2).replace('.', ',')}`, 15, 145);
      doc.text(`Vencimento: ${boletoData.dataVencimento}`, 15, 155);
      
      // Código de Barras (simulado)
      doc.setFillColor(black[0], black[1], black[2]);
      doc.rect(15, 170, 40, 15, 'F');
      doc.setFillColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('12345', 25, 178, { align: 'center' });
      doc.text('67890', 25, 183, { align: 'center' });
      
      // Linha digitável (simulado)
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);
      doc.text('Banco: 001 - Agência: 1234 - Conta: 56789-0', 15, 195);
      doc.text('Nosso Número: 12345678901234', 15, 205);
      doc.text('Código de Barras: 123456789012345678901234567890', 15, 215);
      
      // Rodapé
      doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.line(10, 240, 200, 240);
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text('Este boleto é um documento válido apenas para pagamento até a data de vencimento.', 10, 250);
      doc.text('Após esta data, favor procurar os estabelecimentos conveniados.', 10, 257);
      doc.text('Em caso de dúvidas, contate o beneficiário.', 10, 264);
      
      // Gerar PDF como buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      // Set headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=boleto-${Date.now()}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Enviar PDF
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Erro ao gerar PDF do boleto', details: error?.message || 'Unknown error' });
    }
  }

  static convertToPdfFormat(boleto: any): BoletoData {
    const valor = typeof boleto.valor === 'string' ? parseFloat(boleto.valor) : (boleto.valor || 0);
    
    return {
      nomePagador: boleto.nomeEmpresa || '',
      cpfCnpj: boleto.cpfCnpj || '',
      endereco: boleto.endereco || '',
      descricao: boleto.descricaoReferencia || '',
      valor: valor,
      dataVencimento: boleto.vencimento ? new Date(boleto.vencimento).toLocaleDateString('pt-BR') : ''
    };
  }
}
