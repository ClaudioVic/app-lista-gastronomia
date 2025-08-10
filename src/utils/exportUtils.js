import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToXLSX = (data, fileName, sheetName = 'Sheet1') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
};

export const exportToPDF = (professorName, disciplineName, lessonName, lessonDate, ingredients) => {
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text(`Professor: ${professorName}`, 10, 10);
  doc.text(`Disciplina: ${disciplineName}`, 10, 20);
  doc.text(`Aula: ${lessonName}`, 10, 30);
  doc.text(`Data da Aula: ${lessonDate}`, 10, 40);

  const tableColumn = ["Nome do Ingrediente", "Quantidade", "Unid.", "Observações"];
  const tableRows = ingredients.map(ing => [
    ing.name,
    ing.quantity,
    ing.unit,
    ing.observations
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 80 }
    }
  });

  doc.save(`Ingredientes_${disciplineName}_${lessonName}.pdf`);
};