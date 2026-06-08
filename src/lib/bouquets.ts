import { supabase } from './supabase';

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

export async function getBouquets(): Promise<Bouquet[]> {
  try {
    const { data, error } = await supabase
      .from('bouquets')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error reading bouquets:', error);
      return [];
    }
    return data as Bouquet[];
  } catch (error) {
    console.error('Error reading bouquets from Supabase:', error);
    return [];
  }
}

export async function saveBouquet(newBouquet: Omit<Bouquet, 'id' | 'isCustom'>): Promise<Bouquet> {
  const { data, error } = await supabase
    .from('bouquets')
    .insert([{ ...newBouquet, isCustom: true }])
    .select()
    .single();

  if (error) {
    throw new Error(`Error saving bouquet to Supabase: ${error.message}`);
  }

  return data as Bouquet;
}

export async function deleteBouquet(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('bouquets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bouquet from Supabase:', error);
    return false;
  }
  
  return true;
}

export async function updateBouquet(id: number, updatedData: Omit<Bouquet, 'id' | 'isCustom'>): Promise<Bouquet | null> {
  const { data, error } = await supabase
    .from('bouquets')
    .update({ ...updatedData, isCustom: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating bouquet in Supabase:', error);
    return null;
  }

  return data as Bouquet;
}
