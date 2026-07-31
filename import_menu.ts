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
