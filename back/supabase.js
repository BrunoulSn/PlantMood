import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para salvar planta
export async function addPlant(name, type, emoji) {
    const { data, error } = await supabase
        .from('plants')
        .insert([{ name, type, emoji }]);
    return { data, error };
}

// Função para buscar plantas
export async function getPlants() {
    const { data, error } = await supabase
        .from('plants')
        .select('*');
    return { data, error };
}