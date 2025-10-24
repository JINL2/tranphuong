// Paste this in browser console at http://localhost:3001
// This will measure actual rendered heights of each column

const columns = {};
const items = document.querySelectorAll('.masonry-item');

items.forEach((item, index) => {
  const rect = item.getBoundingClientRect();
  const column = Math.floor(rect.left / 300); // Approximate column detection

  if (!columns[column]) {
    columns[column] = {
      items: [],
      totalHeight: 0
    };
  }

  columns[column].items.push({
    index,
    height: rect.height,
    type: item.querySelector('[class*="text"]') ? 'text' :
          item.querySelector('[class*="aspect"]') ? 'image/story' : 'button'
  });

  columns[column].totalHeight += rect.height + 16; // Include margin
});

console.table(columns);
console.log('Column Heights:', Object.values(columns).map(c => c.totalHeight + 'px'));
