/**
 * Export functionality for VanillaTable
 */

class VanillaTableExporter {
  constructor(core, renderer) {
    this.core = core;
    this.renderer = renderer;
  }

  /**
   * Get visible data (respecting current filters/search)
   * Returns all data that matches filters, even if on other pages
   */
  getVisibleData() {
    // We want rows that pass the search/filter criteria.
    // These rows are marked by NOT having the 'data-hidden-search' attribute.
    // We ignore display:none because pagination hides rows that are valid but on other pages.
    const visibleRows = this.core.rows.filter(row =>
      !row.classList.contains('vanilla-table-no-results') &&
      !row.hasAttribute('data-hidden-search')
    );

    return visibleRows.map(row => {
      const index = parseInt(row.getAttribute('data-index'), 10);
      return this.core.data[index];
    });
  }

  /**
   * Get all data
   */
  getAllData() {
    return this.core.data;
  }

  /**
   * Export to CSV
   */
  toCSV(includeFiltered = false) {
    const data = includeFiltered ? this.getAllData() : this.getVisibleData();
    const columns = this.renderer.getColumns();
    
    // Header row
    const headers = columns.map(col => this.escapeCSV(col.title));
    const rows = [headers.join(',')];
    
    // Data rows
    data.forEach(item => {
      const values = columns.map(col => {
        const value = this.renderer.getCellValue(item, col.data);
        return this.escapeCSV(String(value !== null && value !== undefined ? value : ''));
      });
      rows.push(values.join(','));
    });
    
    return rows.join('\n');
  }

  /**
   * Export to JSON
   */
  toJSON(includeFiltered = false) {
    const data = includeFiltered ? this.getAllData() : this.getVisibleData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Download as CSV file
   */
  downloadCSV(filename = 'table.csv', includeFiltered = false) {
    const csv = this.toCSV(includeFiltered);
    this.downloadFile(csv, filename, 'text/csv');
  }

  /**
   * Download as JSON file
   */
  downloadJSON(filename = 'table.json', includeFiltered = false) {
    const json = this.toJSON(includeFiltered);
    this.downloadFile(json, filename, 'application/json');
  }

  /**
   * Escape CSV value
   */
  escapeCSV(value) {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Trigger file download
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
