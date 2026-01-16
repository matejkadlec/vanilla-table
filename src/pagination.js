/**
 * Client-side pagination for VanillaTable
 */

class VanillaTablePaginator {
  constructor(core) {
    this.core = core;
  }

  /**
   * Update pagination display and controls
   */
  update() {
    const { options, state, rows } = this.core;

    if (!options.pagination) return;

    // Get rows that should be visible (not filtered/searched out)
    const visibleRows = this.getBaseVisibleRows();
    const total = visibleRows.length;
    const per = state.perPage;
    const totalPages = Math.max(1, Math.ceil(total / per));

    // Ensure current page is valid
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    if (state.currentPage < 1) state.currentPage = 1;

    const current = state.currentPage;

    // Calculate which rows should be shown on current page
    const startIdx = (current - 1) * per;
    const endIdx = startIdx + per;

    // Update visibility for all rows
    let visibleIndex = 0;
    rows.forEach((row) => {
      if (row.classList.contains("vanilla-table-no-results")) return;

      // Check if row is filtered out
      const isFiltered =
        row.style.display === "none" && row.hasAttribute("data-hidden-search");

      if (isFiltered) {
        // Keep it hidden
        return;
      }

      // This row passes filters, check if it's on current page
      if (visibleIndex >= startIdx && visibleIndex < endIdx) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
      visibleIndex++;
    });

    // Update no-results row
    this.core.updateNoResults();
    this.core.recomputeZebra();

    // Update info text if element exists
    this.updateInfo(total, current, per);

    // Build pagination controls if element exists
    this.buildControls(current, totalPages);
  }

  /**
   * Get rows that are visible (not filtered)
   */
  getBaseVisibleRows() {
    return this.core.rows.filter(
      (row) =>
        !row.classList.contains("vanilla-table-no-results") &&
        !row.hasAttribute("data-hidden-search")
    );
  }

  /**
   * Update pagination info text
   */
  updateInfo(total, current, per) {
    const { options } = this.core;
    if (!options.paginationInfo) return;

    const infoEl =
      typeof options.paginationInfo === "string"
        ? document.querySelector(options.paginationInfo)
        : options.paginationInfo;

    if (!infoEl) return;

    const start = total === 0 ? 0 : (current - 1) * per + 1;
    const end = Math.min(current * per, total);
    infoEl.textContent = `Showing ${start} to ${end} of ${total} entries`;
  }

  /**
   * Build pagination controls
   */
  buildControls(current, totalPages) {
    const { options } = this.core;
    if (!options.paginationControls) return;

    const controlEl =
      typeof options.paginationControls === "string"
        ? document.querySelector(options.paginationControls)
        : options.paginationControls;

    if (!controlEl) return;

    controlEl.innerHTML = "";

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "‹";
    prevBtn.className = "pagination-btn pagination-prev";
    prevBtn.disabled = current === 1;
    prevBtn.addEventListener("click", () => this.goToPage(current - 1));
    controlEl.appendChild(prevBtn);

    // Page buttons
    const pages = this.getPageNumbers(current, totalPages);
    pages.forEach((page) => {
      if (page === "...") {
        const ellipsis = document.createElement("span");
        ellipsis.className = "pagination-ellipsis";
        ellipsis.textContent = "...";
        controlEl.appendChild(ellipsis);
      } else {
        const btn = document.createElement("button");
        btn.textContent = page;
        btn.className = "pagination-btn pagination-page";
        if (page === current) btn.classList.add("active");
        btn.addEventListener("click", () => this.goToPage(page));
        controlEl.appendChild(btn);
      }
    });

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "›";
    nextBtn.className = "pagination-btn pagination-next";
    nextBtn.disabled = current === totalPages;
    nextBtn.addEventListener("click", () => this.goToPage(current + 1));
    controlEl.appendChild(nextBtn);
  }

  /**
   * Calculate which page numbers to show
   */
  getPageNumbers(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];

    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    // Show current page and neighbors
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("...");
    }

    // Always show last page
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  }

  /**
   * Navigate to a specific page
   */
  goToPage(page) {
    this.core.state.currentPage = page;
    this.update();
  }
}
