import jsPDF from 'jspdf';

// ========== EXPORT PDF ==========
export const exportPortfolioToPDF = (portfolio: any) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Header
  doc.setFontSize(16);
  doc.setTextColor(30, 90, 190);
  doc.text('FINDASH - RAPPORT DE PORTEFEUILLE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Infos
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Portefeuille: ${portfolio.name}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')} - ${new Date().toLocaleTimeString('fr-FR')}`, 15, yPosition);
  yPosition += 10;

  // Stats
  doc.setFontSize(11);
  doc.setTextColor(30, 90, 190);
  doc.text('STATISTIQUES', 15, yPosition);
  yPosition += 7;

  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Valeur Totale: ${portfolio.totalValue.toFixed(2)} EUR`, 20, yPosition);
  yPosition += 5;
  doc.setTextColor(34, 197, 94);
  doc.text(`P&L: ${portfolio.pnl.toFixed(2)} EUR (${portfolio.pnlPercent.toFixed(2)}%)`, 20, yPosition);
  yPosition += 10;

  // Tableau
  doc.setTextColor(30, 90, 190);
  doc.setFontSize(11);
  doc.text('ACTIFS', 15, yPosition);
  yPosition += 7;

  // Headers - PARFAITEMENT CALCULÉS
  const headers = ['Symbole', 'Qte', 'Prix Unit', 'Valeur', '%', 'Type'];
  const columnWidths = [35, 25, 40, 40, 25, 35];
  const startX = 15;
  let xPosition = startX;

  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(30, 90, 190);

  // Dessiner headers
  headers.forEach((header, index) => {
    doc.rect(xPosition, yPosition - 4, columnWidths[index], 5, 'F');
    doc.text(header, xPosition + 2, yPosition - 0.5);
    xPosition += columnWidths[index];
  });

  yPosition += 6;

  // Données
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  
  portfolio.holdings.forEach((h: any, idx: number) => {
    const valeur = h.quantity * h.averagePrice;
    const percent = portfolio.totalValue > 0 ? ((valeur / portfolio.totalValue) * 100).toFixed(1) : '0';

    // Alternance de couleur
    if (idx % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(startX, yPosition - 3.5, 200, 4.5, 'F');
    }

    xPosition = startX;
    const rowData = [
      h.symbol,
      h.quantity.toString(),
      `${h.averagePrice.toFixed(2)} EUR`,
      `${valeur.toFixed(2)} EUR`,
      `${percent}%`,
      h.assetType
    ];

    rowData.forEach((data, colIdx) => {
      doc.text(data, xPosition + 2, yPosition);
      xPosition += columnWidths[colIdx];
    });

    yPosition += 4.5;

    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = 15;
    }
  });

  // Footer
  yPosition += 3;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(`Nombre d'actifs: ${portfolio.holdings.length}`, 15, yPosition);

  doc.save(`portfolio_${portfolio.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportAllPortfoliosToPDF = (portfolios: any[]) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Header
  doc.setFontSize(16);
  doc.setTextColor(30, 90, 190);
  doc.text('FINDASH - RAPPORT GLOBAL', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Infos
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')} - ${new Date().toLocaleTimeString('fr-FR')}`, 15, yPosition);
  yPosition += 10;

  // Totaux
  const totalValue = portfolios.reduce((sum, p) => sum + (p.totalValue || 0), 0);
  const totalPnL = portfolios.reduce((sum, p) => sum + (p.pnl || 0), 0);

  doc.setFontSize(11);
  doc.setTextColor(30, 90, 190);
  doc.text('RESUME GLOBAL', 15, yPosition);
  yPosition += 7;

  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Valeur Totale: ${totalValue.toFixed(2)} EUR`, 20, yPosition);
  yPosition += 5;
  doc.setTextColor(34, 197, 94);
  doc.text(`P&L Total: ${totalPnL.toFixed(2)} EUR`, 20, yPosition);
  yPosition += 5;
  doc.setTextColor(60, 60, 60);
  doc.text(`Portefeuilles: ${portfolios.length}`, 20, yPosition);
  yPosition += 10;

  // Tableau
  doc.setTextColor(30, 90, 190);
  doc.setFontSize(11);
  doc.text('PORTEFEUILLES', 15, yPosition);
  yPosition += 7;

  // Headers
  const headers = ['Nom', 'Valeur', 'P&L', 'Perf %', 'Actifs'];
  const columnWidths = [90, 50, 50, 40, 30];
  const startX = 15;
  let xPosition = startX;

  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(30, 90, 190);

  headers.forEach((header, index) => {
    doc.rect(xPosition, yPosition - 4, columnWidths[index], 5, 'F');
    doc.text(header, xPosition + 2, yPosition - 0.5);
    xPosition += columnWidths[index];
  });

  yPosition += 6;

  // Données
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  
  portfolios.forEach((p, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(startX, yPosition - 3.5, 260, 4.5, 'F');
    }

    xPosition = startX;
    const rowData = [
      p.name,
      `${p.totalValue.toFixed(2)} EUR`,
      `${p.pnl.toFixed(2)} EUR`,
      `${p.pnlPercent.toFixed(2)}%`,
      (p.holdings?.length || 0).toString()
    ];

    rowData.forEach((data, colIdx) => {
      doc.text(data, xPosition + 2, yPosition);
      xPosition += columnWidths[colIdx];
    });

    yPosition += 4.5;
  });

  doc.save(`findash_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// ========== EXPORT CSV ==========
export const exportPortfolioToCSV = (portfolio: any) => {
  const rows: string[] = [];

  rows.push(`PORTEFEUILLE: ${portfolio.name}`);
  rows.push(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`);
  rows.push(`Heure: ${new Date().toLocaleTimeString('fr-FR')}`);
  rows.push('');

  rows.push('STATISTIQUES');
  rows.push(`Valeur Totale,"${portfolio.totalValue.toFixed(2)} EUR"`);
  rows.push(`P&L,"${portfolio.pnl.toFixed(2)} EUR"`);
  rows.push(`Performance,"${portfolio.pnlPercent.toFixed(2)} %"`);
  rows.push('');

  rows.push('ACTIFS');
  rows.push('"Symbole","Quantite","Prix Unitaire EUR","Valeur Totale EUR","Pourcentage %","Type"');

  portfolio.holdings.forEach((h: any) => {
    const valeur = h.quantity * h.averagePrice;
    const percent = portfolio.totalValue > 0 ? ((valeur / portfolio.totalValue) * 100).toFixed(2) : '0.00';
    rows.push(`"${h.symbol}","${h.quantity}","${h.averagePrice.toFixed(2)}","${valeur.toFixed(2)}","${percent}","${h.assetType}"`);
  });

  rows.push('');
  rows.push(`Nombre d'actifs,"${portfolio.holdings.length}"`);

  const csvContent = '\ufeff' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `portfolio_${portfolio.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAllPortfoliosToCSV = (portfolios: any[]) => {
  const rows: string[] = [];

  rows.push('RAPPORT FINDASH');
  rows.push(`Date: ${new Date().toLocaleDateString('fr-FR')}`);
  rows.push(`Heure: ${new Date().toLocaleTimeString('fr-FR')}`);
  rows.push('');

  const totalValue = portfolios.reduce((sum, p) => sum + (p.totalValue || 0), 0);
  const totalPnL = portfolios.reduce((sum, p) => sum + (p.pnl || 0), 0);
  
  rows.push('RESUME GLOBAL');
  rows.push(`Valeur Totale,"${totalValue.toFixed(2)} EUR"`);
  rows.push(`P&L Total,"${totalPnL.toFixed(2)} EUR"`);
  rows.push(`Nombre de Portefeuilles,"${portfolios.length}"`);
  rows.push('');

  rows.push('PORTEFEUILLES');
  rows.push('"Nom","Valeur EUR","P&L EUR","Performance %","Nombre Actifs"');

  portfolios.forEach(p => {
    rows.push(`"${p.name}","${p.totalValue.toFixed(2)}","${p.pnl.toFixed(2)}","${p.pnlPercent.toFixed(2)}","${p.holdings?.length || 0}"`);
  });

  const csvContent = '\ufeff' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `findash_report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
