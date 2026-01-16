/**
 * Table sorting functionality for VanillaTable
 */

class VanillaTableSorter {
  constructor(core, renderer) {
    this.core = core;
    this.renderer = renderer;
    this.initialized = false;
  }

  /**
   * Initialize sorting - add click handlers to table headers
   */
  init() {
    if (this.initialized) return;

    const headers = this.core.thead.querySelectorAll("th");
    const columns = this.renderer.getColumns();

    headers.forEach((header, index) => {
      const column = columns[index];

      // Skip if column is not sortable
      if (column && column.sortable === false) return;

      // Make header clickable
      header.style.cursor = "pointer";
      header.style.userSelect = "none";
      header.classList.add("sortable");

      // Add click handler
      header.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleClick(index);
      });
    });

    this.core.table.classList.add("sorting-enabled");
    
    // Set initial sort (ID asc) if no sort state exists
    if (this.core.state.sortState.length === 0) {
      // Find ID column index
      const idIndex = columns.findIndex(col => col.data === 'id' || col.title === 'ID');
      if (idIndex >= 0) {
        this.core.state.sortState = [[idIndex, 'asc']];
      }
    }

    this.updateSortArrows();
    this.initialized = true;
  }

  /**
   * Handle regular click - set this column as primary sort
   */
  handleClick(columnIndex) {
    const existingIndex = this.core.state.sortState.findIndex(
      ([col]) => col === columnIndex
    );
    let newDirection = "asc";

    if (existingIndex >= 0) {
      // Toggle direction
      newDirection = this.core.state.sortState[existingIndex][1] === "asc" ? "desc" : "asc";
    }

    // Set this column as the only sort criteria
    this.core.state.sortState = [[columnIndex, newDirection]];
    this.applySorting();
  }

  /**
   * Apply current sort state to the table
   */
  applySorting() {
    const columns = this.renderer.getColumns();

    // Create a combined array of data and rows to keep them in sync
    const combined = this.core.data.map((item, index) => ({
      item,
      row: this.core.rows[index]
    }));

    // Sort the combined array
    combined.sort((a, b) => {
      for (const [columnIndex, direction] of this.core.state.sortState) {
        const column = columns[columnIndex];
        const compareResult = this.compareValues(a.item, b.item, column);
        if (compareResult !== 0) {
          return direction === "asc" ? compareResult : -compareResult;
        }
      }
      return 0;
    });

    // Update the core data and rows arrays to match new order
    this.core.data = combined.map(c => c.item);
    this.core.rows = combined.map(c => c.row);

    // Reorder DOM rows
    const tbody = this.core.tbody;
    const noResultsRow = tbody.querySelector(".vanilla-table-no-results");

    combined.forEach((obj, index) => {
      const row = obj.row;
      if (row) {
        row.setAttribute("data-index", index);
        tbody.appendChild(row);
      }
    });

    // Keep no-results row at the end
    if (noResultsRow) {
      tbody.appendChild(noResultsRow);
    }

    this.updateSortArrows();

    // Trigger other updates if needed
    if (this.core.onSort) {
      this.core.onSort();
    }
  }

  /**
   * Compare two values for sorting
   */
  compareValues(a, b, column) {
    const aVal = this.renderer.getCellValue(a, column.data);
    const bVal = this.renderer.getCellValue(b, column.data);

    // Handle null/undefined
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    // Use custom compare function if provided
    if (column.compare && typeof column.compare === "function") {
      return column.compare(aVal, bVal, a, b);
    }

    // Numeric comparison
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    // String comparison
    return String(aVal).localeCompare(String(bVal), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  /**
   * Update sort direction arrows in headers
   */
  updateSortArrows() {
    const headers = this.core.thead.querySelectorAll("th");

    headers.forEach((header, index) => {
      // Remove existing arrows
      header.classList.remove(
        "sort-asc",
        "sort-desc"
      );

      // Find if this column is in sort state
      const sortIndex = this.core.state.sortState.findIndex(
        ([col]) => col === index
      );

      if (sortIndex >= 0) {
        const direction = this.core.state.sortState[sortIndex][1];
        header.classList.add(`sort-${direction}`);
      }
    });
  }
}
