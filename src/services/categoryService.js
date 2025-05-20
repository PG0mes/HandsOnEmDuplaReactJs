import supabase from './supabase';

const categoryService = {
  // Obter todas as categorias
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
    
    return data;
  },
  
  // Obter uma categoria pelo ID
  async getCategoryById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar categoria:', error);
      throw error;
    }
    
    return data;
  },
  
  // Criar uma nova categoria
  async createCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select();
    
    if (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // Atualizar uma categoria existente
  async updateCategory(id, category) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
    
    return data ? data[0] : null;
  },
  
  // Deletar uma categoria
  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
    
    return true;
  }
};

export default categoryService; 