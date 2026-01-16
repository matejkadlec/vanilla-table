/**
 * Core utilities for VanillaTable
 */

class VanillaTableCore {
  constructor(table, options = {}) {
    this.table = table;
    this.tbody = table.querySelector("tbody");
    this.thead = table.querySelector("thead");
    this.options = options;
    this.data = [];
    this.rows = [];
    this.state = {
      currentPage: 1,
      perPage: options.perPage || 25,
      sortState: [],
      filters: {},
      searchQuery: "",
    };

    // Add zebra striping class if enabled
    if (options.zebra !== false) {
      this.table.classList.add("vanilla-table-zebra");
    }
  }

  /**
   * Recompute zebra striping for currently visible rows
   */
  recomputeZebra() {
    if (this.options.zebra === false) return;

    let visibleIndex = 0;
    this.rows.forEach((row) => {
      if (row.classList.contains("vanilla-table-no-results")) return;
      if (row.style.display === "none") return;

      row.classList.remove("odd", "even");
      row.classList.add(visibleIndex % 2 === 0 ? "odd" : "even");
      visibleIndex++;
    });
  }

  /**
   * Run a function with transitions temporarily disabled
   */
  withTransitionSuspended(fn) {
    this.table.classList.add("suspend-transitions");
    try {
      fn();
    } finally {
      requestAnimationFrame(() =>
        this.table.classList.remove("suspend-transitions")
      );
    }
  }

  /**
   * Get visible rows (not hidden by filters/search)
   */
  getVisibleRows() {
    return this.rows.filter(
      (row) =>
        !row.classList.contains("vanilla-table-no-results") &&
        row.style.display !== "none"
    );
  }

  /**
   * Update the no-results row visibility
   */
  updateNoResults() {
    const noResultsRow = this.tbody.querySelector(".vanilla-table-no-results");
    if (!noResultsRow) return;

    const hasVisibleRows = this.rows.some(
      (row) =>
        !row.classList.contains("vanilla-table-no-results") &&
        row.style.display !== "none"
    );

    noResultsRow.style.display = hasVisibleRows ? "none" : "";
  }
}
