import type {
  MenuCategory,
  MenuProduct,
  RestaurantSettings,
} from "./menu-types";
import { excelMenuRows } from "./excel-menu-data";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categoryNames = [...new Set(excelMenuRows.map((row) => row.category))];

export const seedCategories: MenuCategory[] = categoryNames.map(
  (name, index) => ({
    id: slugify(name),
    name,
    sortOrder: index + 1,
  }),
);

export const seedProducts: MenuProduct[] = excelMenuRows.map((row, index) => {
  const categoryId = slugify(row.category);
  return {
    id: `${categoryId}-${slugify(row.name)}-${index + 1}`,
    categoryId,
    name: row.name,
    description: row.description,
    price: row.price,
    image: "",
    sizeOptions: [],
    spiceOptions: [],
    active: true,
  };
});

export const seedSettings: RestaurantSettings = {
  siteName: "Meharbaan Indian Cuisine",
  phone: "09 212 0007",
  mobile: "029 242 0007",
  email: "meharbaanindiancuisine@gmail.com",
  address: "154 Shirley Road, Papatoetoe, Auckland 2025",
  facebook: "https://www.facebook.com/profile.php?id=61585619636550",
  instagram: "https://www.instagram.com/meharbaanindiancuisine",
  delivery: true,
  pickup: true,
  suburbs: [
    "Papatoetoe",
    "Manukau",
    "Ōtāhuhu",
    "Māngere",
    "Flat Bush",
    "East Tāmaki",
  ],
  timeSlots: [
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ],
};
