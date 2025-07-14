// utils/exportCSV.js

export const exportToCSV = (data, fileName = 'data.csv') => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('No data available to export.');
    return;
  }

  const csvRows = [];

  // Extract headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  // Format each row
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];

      // Escape double quotes and wrap all values in quotes
      if (typeof val === 'string') {
        return `"${val.replace(/"/g, '""')}"`;
      }

      return `"${val}"`;
    });

    csvRows.push(values.join(','));
  }

  // Add BOM for Excel Unicode compatibility (important for ₹ or foreign characters)
  const csvString = "\uFEFF" + csvRows.join('\n');

  // Create and download Blob
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create download link and trigger click
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up memory
  URL.revokeObjectURL(url);
};
