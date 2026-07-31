import xlsx from 'xlsx';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { readMenuStore, writeMenuStore, slugify } from './lib/menu-store';



async function main() {
  
  console.log('Reading Excel file...');
  const workbook = xlsx.readFile('menu.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<any>(sheet);
  
  const existingStore = await readMenuStore();
  
  const categoriesMap = new Map();
  const newProducts = [];
  
  let catSortOrder = 0;
  
  for (const row of data) {
    if (!row.Category || !row.Item || !row.Price) continue;
    
    const catName = row.Category.trim().toUpperCase();
    if (!categoriesMap.has(catName)) {
      categoriesMap.set(catName, {
        id: crypto.randomUUID(),
        name: catName,
        sortOrder: ++catSortOrder
      });
    }
    const catId = categoriesMap.get(catName).id;
    
    const rawItem = String(row.Item).trim();
    const rawPrice = String(row.Price).trim();
    const description = row.Description ? String(row.Description).trim() : "";
    
    // Split prices and names
    // Examples: 
    // "Paneer or Vegetable Pakora" -> "$8.99 / $7.99"
    // "Steam Momos (Veg / Paneer) / Chicken" -> "$15.99 / $17.99"
    // "Tandoori Chicken" -> "$11.99 (Half) / $20.99 (Full)"
    
    const prices = rawPrice.split('/').map(p => p.trim());
    
    if (prices.length > 1) {
      // It's a split product
      if (rawItem.includes('(Half)')) {
          // Keep as one product but with size options
      }
      
      // We will try to parse "Tandoori Chicken $11.99 (Half) / $20.99 (Full)"
      const isSizeSplit = prices.some(p => p.includes('(Half)') || p.includes('(Full)'));
      if (isSizeSplit) {
        let basePrice = 0;
        const sizeOptions = [];
        for (const p of prices) {
          const match = p.match(/\$?([0-9.]+)\s*\((.+?)\)/);
          if (match) {
            const num = parseFloat(match[1]);
            const name = match[2];
            if (basePrice === 0) {
              basePrice = num;
              sizeOptions.push({ name, extra: 0 });
            } else {
              sizeOptions.push({ name, extra: num - basePrice });
            }
          }
        }
        
        newProducts.push({
          id: crypto.randomUUID(),
          categoryId: catId,
          name: rawItem,
          description: description,
          price: basePrice,
          image: "",
          sizeOptions: sizeOptions,
          spiceOptions: [],
          active: true
        });
        continue;
      }
      
      // Let's just create separate products for "Paneer or Vegetable"
      if (rawItem.includes(' or ')) {
         const parts = rawItem.split(' or ');
         const suffixMatch = parts[1].match(/^(.+?)\\s+(.+)$/); // e.g. "Vegetable Pakora"
         let name1, name2;
         if (suffixMatch && !parts[0].includes(' ')) {
             name1 = parts[0] + ' ' + suffixMatch[2]; // Paneer Pakora
             name2 = parts[1]; // Vegetable Pakora
         } else {
             name1 = parts[0];
             name2 = parts[1];
         }
         
         const p1 = parseFloat(prices[0].replace(/[^0-9.]/g, ''));
         const p2 = prices[1] ? parseFloat(prices[1].replace(/[^0-9.]/g, '')) : p1;
         
         newProducts.push({
            id: crypto.randomUUID(),
            categoryId: catId,
            name: name1.trim(),
            description: description,
            price: p1,
            image: "",
            sizeOptions: [], spiceOptions: [], active: true
         });
         newProducts.push({
            id: crypto.randomUUID(),
            categoryId: catId,
            name: name2.trim(),
            description: description,
            price: p2,
            image: "",
            sizeOptions: [], spiceOptions: [], active: true
         });
         continue;
      }
      
      // For momos: "Steam Momos (Veg / Paneer) / Chicken" => "$15.99 / $17.99"
      if (rawItem.includes(' (Veg / Paneer) / Chicken')) {
         const baseName = rawItem.replace(' (Veg / Paneer) / Chicken', '');
         const p1 = parseFloat(prices[0].replace(/[^0-9.]/g, ''));
         const p2 = parseFloat(prices[1].replace(/[^0-9.]/g, ''));
         
         newProducts.push({
            id: crypto.randomUUID(),
            categoryId: catId,
            name: baseName + ' (Veg / Paneer)',
            description: description,
            price: p1,
            image: "",
            sizeOptions: [], spiceOptions: [], active: true
         });
         newProducts.push({
            id: crypto.randomUUID(),
            categoryId: catId,
            name: baseName + ' (Chicken)',
            description: description,
            price: p2,
            image: "",
            sizeOptions: [], spiceOptions: [], active: true
         });
         continue;
      }
      
      // generic fallback for other slash items (e.g. Pasta Red Sauce / Chicken)
      if (rawItem.includes(' / ')) {
         const parts = rawItem.split(' / ');
         const p1 = parseFloat(prices[0].replace(/[^0-9.]/g, ''));
         const p2 = parseFloat(prices[1].replace(/[^0-9.]/g, ''));
         
         newProducts.push({
            id: crypto.randomUUID(),
            categoryId: catId,
            name: parts[0].trim(),
            description: description,
            price: p1,
            image: "",
            sizeOptions: [], spiceOptions: [], active: true
         });
         newProducts.push({
            id: crypto.randomUUID(),
            categoryId: catId,
            name: parts[0].trim() + ' (' + parts[1].trim() + ')',
            description: description,
            price: p2,
            image: "",
            sizeOptions: [], spiceOptions: [], active: true
         });
         continue;
      }
    }
    
    // Normal single product
    const p1 = parseFloat(prices[0].replace(/[^0-9.]/g, ''));
    newProducts.push({
      id: crypto.randomUUID(),
      categoryId: catId,
      name: rawItem,
      description: description,
      price: p1,
      image: "",
      sizeOptions: [],
      spiceOptions: [],
      active: true
    });
  }
  
  const newCategories = Array.from(categoriesMap.values());
  
  console.log(`Parsed ${newCategories.length} categories and ${newProducts.length} products.`);
  
  // Update DB
  console.log('Writing to database...');
  existingStore.categories = newCategories;
  existingStore.products = newProducts;
  
  await writeMenuStore(existingStore);
  console.log('Success! Menu has been updated in the database.');
}

main().catch(console.error);
