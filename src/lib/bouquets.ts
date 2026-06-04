import fs from 'fs/promises';
import path from 'path';

export interface Bouquet {
  id: number;
  nameKey?: string;
  subNameKey?: string;
  tagKey?: string;
  name?: string;
  price: string;
  category: string;
  src: string;
  alt: string;
  description?: string;
  isCustom?: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'bouquets.json');

export async function getBouquets(): Promise<Bouquet[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bouquets file, returning empty array:', error);
    return [];
  }
}

export async function saveBouquet(newBouquet: Omit<Bouquet, 'id' | 'isCustom'>): Promise<Bouquet> {
  const bouquets = await getBouquets();
  const nextId = bouquets.length > 0 ? Math.max(...bouquets.map(b => b.id)) + 1 : 1;
  const createdBouquet: Bouquet = {
    ...newBouquet,
    id: nextId,
    isCustom: true
  };
  bouquets.push(createdBouquet);
  
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(bouquets, null, 2), 'utf-8');
  return createdBouquet;
}

export async function deleteBouquet(id: number): Promise<boolean> {
  const bouquets = await getBouquets();
  const filtered = bouquets.filter(b => b.id !== id);
  if (filtered.length === bouquets.length) return false;
  
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function updateBouquet(id: number, updatedData: Omit<Bouquet, 'id' | 'isCustom'>): Promise<Bouquet | null> {
  const bouquets = await getBouquets();
  const index = bouquets.findIndex(b => b.id === id);
  if (index === -1) return null;
  
  const updatedBouquet: Bouquet = {
    ...updatedData,
    id,
    isCustom: true
  };
  bouquets[index] = updatedBouquet;
  
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(bouquets, null, 2), 'utf-8');
  return updatedBouquet;
}
