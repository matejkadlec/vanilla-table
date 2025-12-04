# 📊 vanilla-table

> Lightweight vanilla JavaScript table library with sorting, pagination, filtering, and export capabilities

## 🚧 Under Active Development

This package is currently under active development. The full implementation is being refactored and will be available soon.

## ✨ Planned Features

- **Zero Dependencies** - Pure vanilla JavaScript, no jQuery or other libraries required
- **Sorting** - Multi-column sorting with customizable sort functions
- **Pagination** - Client-side pagination with configurable page sizes
- **Filtering** - Column-based filtering with multiple filter types
- **Search** - Global search across all columns
- **Export** - Export to CSV, JSON, and Excel formats
- **Zebra Striping** - Alternating row colors for better readability
- **Responsive** - Mobile-friendly table design
- **Lightweight** - Minimal footprint, inspired by DataTables but much lighter

## 📦 Installation

```bash
npm install vanilla-table
```

## 🚀 Usage

```javascript
const VanillaTable = require('vanilla-table');

// Full implementation coming soon
const table = new VanillaTable('#my-table', {
  pagination: true,
  pageSize: 10,
  sorting: true,
  filtering: true,
  search: true,
  export: ['csv', 'json', 'excel']
});

table.init();
```

## 📝 License

MIT © matejkadlec

## 🤝 Contributing

Contributions, issues, and feature requests are welcome once the initial implementation is complete.

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.
