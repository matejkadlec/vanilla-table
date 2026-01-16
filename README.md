# 📊 vanilla-table

> Lightweight vanilla JavaScript table library with sorting, pagination, filtering, and export capabilities

[![npm version](https://badge.fury.io/js/vanilla-table.svg)](https://www.npmjs.com/package/vanilla-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **Zero Dependencies** - Pure vanilla JavaScript, no jQuery or other libraries required
- **Sorting** - Column sorting with customizable sort functions
- **Pagination** - Client-side pagination with configurable page sizes
- **Filtering** - Column-based filtering with multiple filter types
- **Search** - Global search across all columns
- **Export** - Export to CSV and JSON formats
- **Zebra Striping** - Alternating row colors for better readability
- **Responsive** - Mobile-friendly table design
- **Lightweight** - Minimal footprint (~15KB minified)
- **Customizable** - Extensive configuration options and custom render functions

## 📦 Installation

```bash
npm install vanilla-table
```

Or use directly in the browser:

```html
<!-- Include CSS -->
<link rel="stylesheet" href="path/to/vanilla-table/src/table.css" />

<!-- Include all JavaScript modules -->
<script src="path/to/vanilla-table/src/core.js"></script>
<script src="path/to/vanilla-table/src/render.js"></script>
<script src="path/to/vanilla-table/src/sort.js"></script>
<script src="path/to/vanilla-table/src/filters.js"></script>
<script src="path/to/vanilla-table/src/pagination.js"></script>
<script src="path/to/vanilla-table/src/exports.js"></script>
<script src="path/to/vanilla-table/index.js"></script>
```

## 🚀 Quick Start

### Basic Usage

```html
<table id="my-table">
  <thead>
    <tr>
      <th data-field="name">Name</th>
      <th data-field="email">Email</th>
      <th data-field="age">Age</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<script>
  const data = [
    { name: "John Doe", email: "john@example.com", age: 30 },
    { name: "Jane Smith", email: "jane@example.com", age: 25 },
    { name: "Bob Johnson", email: "bob@example.com", age: 35 },
  ];

  const table = new VanillaTable("#my-table", {
    data: data,
    sorting: true,
    pagination: true,
    perPage: 10,
  });
</script>
```

### With Pagination Controls

```html
<div id="table-info"></div>
<table id="my-table">
  ...
</table>
<div id="pagination"></div>

<script>
  const table = new VanillaTable("#my-table", {
    data: data,
    pagination: true,
    perPage: 10,
    paginationInfo: "#table-info",
    paginationControls: "#pagination",
  });
</script>
```

### With Search

```html
<input type="text" id="search" placeholder="Search..." />
<table id="my-table">
  ...
</table>

<script>
  const table = new VanillaTable("#my-table", {
    data: data,
    search: true,
    searchInput: "#search",
  });
</script>
```

## 📖 Configuration Options

| Option               | Type           | Default               | Description                                          |
| -------------------- | -------------- | --------------------- | ---------------------------------------------------- |
| `data`               | Array          | `[]`                  | Array of row objects                                 |
| `columns`            | Array          | `[]`                  | Column configuration (optional, can infer from HTML) |
| `pagination`         | Boolean        | `false`               | Enable pagination                                    |
| `perPage`            | Number         | `25`                  | Rows per page                                        |
| `paginationInfo`     | String/Element | `null`                | Element for pagination info text                     |
| `paginationControls` | String/Element | `null`                | Element for pagination buttons                       |
| `sorting`            | Boolean        | `true`                | Enable sorting                                       |
| `search`             | Boolean        | `false`               | Enable search                                        |
| `searchInput`        | String/Element | `null`                | Search input element                                 |
| `filters`            | Object         | `{}`                  | Initial filters                                      |
| `zebra`              | Boolean        | `true`                | Enable zebra striping                                |
| `noResultsText`      | String         | `'No results found.'` | Text when no results                                 |

## 🎨 Column Configuration

Columns can be configured for custom rendering and behavior:

```javascript
const table = new VanillaTable("#my-table", {
  data: data,
  columns: [
    {
      data: "name",
      title: "Full Name",
    },
    {
      data: "salary",
      title: "Salary",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      data: "status",
      title: "Status",
      sortable: false, // Disable sorting for this column
    },
    {
      data: "user.email", // Nested property access
      title: "Email",
    },
  ],
});
```

## 🔧 API Methods

### Data Management

```javascript
// Load new data
table.loadData(newData);

// Get all data
const allData = table.getAllData();

// Get visible data (after filters/search)
const visibleData = table.getVisibleData();
```

### Search & Filtering

```javascript
// Search
table.search("query");

// Apply filters
table.applyFilters({
  department: "Engineering",
  status: ["active", "pending"], // Array of allowed values
});

// Clear all filters and search
table.clearFilters();
```

### Pagination

```javascript
// Go to specific page
table.goToPage(3);

// Set page size
table.setPageSize(50);
```

### Export

```javascript
// Export to CSV
table.exportCSV("data.csv");

// Export to JSON
table.exportJSON("data.json");

// Get as string (without downloading)
const csvString = table.toCSV();
const jsonString = table.toJSON();

// Include filtered rows in export
table.exportCSV("all-data.csv", true);
```

### Cleanup

```javascript
// Destroy table instance
table.destroy();
```

## 🎯 Advanced Examples

### Custom Render Functions

```javascript
const table = new VanillaTable("#my-table", {
  data: data,
  columns: [
    {
      data: "avatar",
      title: "Avatar",
      render: (value, row) => {
        return `<img src="${value}" alt="${row.name}" style="width: 40px; border-radius: 50%;">`;
      },
    },
    {
      data: "status",
      title: "Status",
      render: (value) => {
        const color = value === "active" ? "green" : "red";
        return `<span style="color: ${color}">${value}</span>`;
      },
    },
  ],
});
```

### Custom Filtering

```javascript
// Filter with custom function
table.applyFilters({
  age: (value) => value >= 18 && value <= 65,
});
```

### Multi-Column Sorting

Users can:

- **Click** a column header to sort by that column
- **Shift+Click** to add additional sort columns (priority indicated by numbers)

## 📝 Example

See `example.html` for a complete working demo with all features.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © matejkadlec

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/vanilla-table)
- [GitHub Repository](https://github.com/matejkadlec/vanilla-table)
- [Report Issues](https://github.com/matejkadlec/vanilla-table/issues)

Contributions, issues, and feature requests are welcome once the initial implementation is complete.

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.
