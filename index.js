/**
 * VanillaTable - Lightweight vanilla JavaScript table library
 * Features: sorting, pagination, filtering, search, and export capabilities
 */

// Load all modules (in browser, these will be included via script tags)
// In Node.js/bundler environments, you would use actual imports

/**
 * Main VanillaTable class
 */
class VanillaTable {
  /**
   * Create a new VanillaTable instance
   * @param {string|HTMLElement} selector - CSS selector or DOM element for the table
   * @param {Object} options - Configuration options
   */
  constructor(selector, options = {}) {
    // Find the table element
    this.tableElement = typeof selector === 'string' 
      ? document.querySelector(selector)
      : selector;

    if (!this.tableElement) {
      throw new Error('Table element not found');
    }

    // Default options
    this.options = {
      data: [],                    // Array of row objects
      columns: [],                 // Column configuration
      pagination: false,           // Enable pagination
      perPage: 25,                 // Rows per page
      paginationInfo: null,        // Element or selector for pagination info
      paginationControls: null,    // Element or selector for pagination controls
      sorting: true,               // Enable sorting
      search: false,               // Enable search
      searchInput: null,           // Element or selector for search input
      filters: {},                 // Initial filters
      zebra: true,                 // Enable zebra striping
      noResultsText: 'No results found.',
      ...options
    };

    // Add vanilla-table class to the table
    this.tableElement.classList.add('vanilla-table');

    // Initialize core
    this.core = new VanillaTableCore(this.tableElement, this.options);
    
    // Initialize modules
    this.renderer = new VanillaTableRenderer(this.core);
    this.sorter = this.options.sorting ? new VanillaTableSorter(this.core, this.renderer) : null;
    this.paginator = this.options.pagination ? new VanillaTablePaginator(this.core) : null;
    this.filter = new VanillaTableFilter(this.core, this.renderer);
    this.exporter = new VanillaTableExporter(this.core, this.renderer);

    // Setup callbacks
    if (this.sorter) {
      this.core.onSort = () => {
        if (this.paginator) this.paginator.update();
      };
    }

    // Initialize search if enabled
    if (this.options.search && this.options.searchInput) {
      this.initSearch();
    }

    // Load initial data if provided
    if (this.options.data && this.options.data.length > 0) {
      this.loadData(this.options.data);
    }
  }

  /**
   * Load data into the table
   * @param {Array} data - Array of row objects
   */
  loadData(data) {
    this.renderer.renderTable(data);
    
    if (this.sorter) {
      this.sorter.init();
    }
    
    if (this.paginator) {
      this.paginator.update();
    }

    return this;
  }

  /**
   * Initialize search functionality
   */
  initSearch() {
    const searchInput = typeof this.options.searchInput === 'string'
      ? document.querySelector(this.options.searchInput)
      : this.options.searchInput;

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      this.search(e.target.value);
    });
  }

  /**
   * Search the table
   * @param {string} query - Search query
   */
  search(query) {
    this.filter.applySearch(query);
    if (this.paginator) {
      this.core.state.currentPage = 1; // Reset to first page
      this.paginator.update();
    }
    return this;
  }

  /**
   * Apply filters to the table
   * @param {Object} filters - Filter configuration
   */
  applyFilters(filters) {
    this.filter.applyFilters(filters);
    if (this.paginator) {
      this.core.state.currentPage = 1; // Reset to first page
      this.paginator.update();
    }
    return this;
  }

  /**
   * Clear all filters and search
   */
  clearFilters() {
    this.filter.clearAll();
    if (this.paginator) {
      this.paginator.update();
    }
    return this;
  }

  /**
   * Go to a specific page
   * @param {number} page - Page number
   */
  goToPage(page) {
    if (this.paginator) {
      this.paginator.goToPage(page);
    }
    return this;
  }

  /**
   * Set page size
   * @param {number} size - Number of rows per page
   */
  setPageSize(size) {
    this.core.state.perPage = size;
    if (this.paginator) {
      this.paginator.update();
    }
    return this;
  }

  /**
   * Export table data to CSV
   * @param {string} filename - Output filename
   * @param {boolean} includeFiltered - Include filtered rows
   */
  exportCSV(filename = 'table.csv', includeFiltered = false) {
    this.exporter.downloadCSV(filename, includeFiltered);
    return this;
  }

  /**
   * Export table data to JSON
   * @param {string} filename - Output filename
   * @param {boolean} includeFiltered - Include filtered rows
   */
  exportJSON(filename = 'table.json', includeFiltered = false) {
    this.exporter.downloadJSON(filename, includeFiltered);
    return this;
  }

  /**
   * Get current table data as CSV string
   * @param {boolean} includeFiltered - Include filtered rows
   */
  toCSV(includeFiltered = false) {
    return this.exporter.toCSV(includeFiltered);
  }

  /**
   * Get current table data as JSON string
   * @param {boolean} includeFiltered - Include filtered rows
   */
  toJSON(includeFiltered = false) {
    return this.exporter.toJSON(includeFiltered);
  }

  /**
   * Get visible data
   */
  getVisibleData() {
    return this.exporter.getVisibleData();
  }

  /**
   * Get all data
   */
  getAllData() {
    return this.exporter.getAllData();
  }

  /**
   * Destroy the table instance
   */
  destroy() {
    // Remove event listeners and clean up
    this.tableElement.classList.remove('vanilla-table', 'vanilla-table-zebra', 'sorting-enabled');
    // Note: In a full implementation, you'd want to track and remove all event listeners
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VanillaTable;
}

if (typeof window !== 'undefined') {
  window.VanillaTable = VanillaTable;
}
