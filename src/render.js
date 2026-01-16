/**
 * Rendering functionality for VanillaTable
 */

class VanillaTableRenderer {
  constructor(core) {
    this.core = core;
  }

  /**
   * Render table with data
   * @param {Array} data - Array of objects representing table rows
   */
  renderTable(data) {
    const { tbody, options } = this.core;
    tbody.innerHTML = '';
    this.core.rows = [];
    this.core.data = data;

    // Get column configuration
    const columns = this.getColumns();

    // Create no-results placeholder
    const placeholder = document.createElement('tr');
    placeholder.classList.add('vanilla-table-no-results');
    placeholder.style.display = 'none';
    placeholder.innerHTML = `<td colspan="${columns.length}" class="no-results">${options.noResultsText || 'No results found.'}</td>`;

    // Render each row
    data.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-index', index);

      // Render each column
      columns.forEach(column => {
        const td = document.createElement('td');
        const value = this.getCellValue(item, column.data);
        
        if (column.render && typeof column.render === 'function') {
          // Use custom render function
          const rendered = column.render(value, item, index);
          if (typeof rendered === 'string') {
            td.innerHTML = rendered;
          } else {
            td.appendChild(rendered);
          }
        } else {
          // Default rendering
          td.textContent = value !== null && value !== undefined ? value : '';
        }

        if (column.className) {
          td.className = column.className;
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
      this.core.rows.push(tr);
    });

    tbody.appendChild(placeholder);
    this.core.recomputeZebra();
  }

  /**
   * Get column configuration from options or infer from table headers
   */
  getColumns() {
    if (this.core.options.columns && this.core.options.columns.length > 0) {
      return this.core.options.columns;
    }

    // Infer columns from table headers
    const headers = this.core.thead.querySelectorAll('th');
    return Array.from(headers).map((th, index) => ({
      title: th.textContent.trim(),
      data: th.getAttribute('data-field') || index.toString(),
      sortable: th.getAttribute('data-sortable') !== 'false'
    }));
  }

  /**
   * Get cell value from data object
   */
  getCellValue(item, field) {
    if (typeof field === 'function') {
      return field(item);
    }
    
    // Support nested properties like 'user.name'
    if (typeof field === 'string' && field.includes('.')) {
      return field.split('.').reduce((obj, key) => obj?.[key], item);
    }
    
    return item[field];
  }
}
