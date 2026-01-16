/**
 * Search and filtering functionality for VanillaTable
 */

class VanillaTableFilter {
  constructor(core, renderer) {
    this.core = core;
    this.renderer = renderer;
  }

  /**
   * Apply search filter to rows
   */
  applySearch(query) {
    this.core.state.searchQuery = query.toLowerCase();
    this.applyAllFilters();
  }

  /**
   * Apply custom column filters
   */
  applyFilters(filters) {
    this.core.state.filters = filters || {};
    this.applyAllFilters();
  }

  /**
   * Apply all filters and search together
   */
  applyAllFilters() {
    const columns = this.renderer.getColumns();
    const query = this.core.state.searchQuery;
    const filters = this.core.state.filters;

    this.core.withTransitionSuspended(() => {
      this.core.rows.forEach((row) => {
        if (row.classList.contains("vanilla-table-no-results")) return;

        const index = parseInt(row.getAttribute("data-index"), 10);
        const item = this.core.data[index];

        let visible = true;

        // Apply column filters first
        for (const [columnKey, filterValue] of Object.entries(filters)) {
          const column = columns.find((col) => col.data === columnKey);
          if (!column) continue;

          const value = this.renderer.getCellValue(item, column.data);

          // Handle different filter types
          if (typeof filterValue === "function") {
            if (!filterValue(value, item)) {
              visible = false;
              break;
            }
          } else if (Array.isArray(filterValue)) {
            if (!filterValue.includes(value)) {
              visible = false;
              break;
            }
          } else {
            if (value !== filterValue) {
              visible = false;
              break;
            }
          }
        }

        // Apply search filter if visible so far
        if (visible && query) {
          let found = false;
          for (const column of columns) {
            const value = this.renderer.getCellValue(item, column.data);
            if (value && String(value).toLowerCase().includes(query)) {
              found = true;
              break;
            }
          }
          if (!found) {
            visible = false;
          }
        }

        // Set row visibility
        row.style.display = visible ? "" : "none";
        if (visible) {
          row.removeAttribute("data-hidden-search");
        } else {
          row.setAttribute("data-hidden-search", "1");
        }
      });

      this.core.updateNoResults();
      this.core.recomputeZebra();
    });
  }

  /**
   * Clear all filters and search
   */
  clearAll() {
    this.core.state.searchQuery = "";
    this.core.state.filters = {};

    this.core.rows.forEach((row) => {
      if (row.classList.contains("vanilla-table-no-results")) return;
      row.style.display = "";
      row.removeAttribute("data-hidden-search");
    });

    this.core.updateNoResults();
    this.core.recomputeZebra();
  }
}
