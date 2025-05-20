import supabase from './supabase';

const productService = {
  async getProductsByPage(page = 1, limit = 12) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name)
      `)
      .range(from, to)
      .order('title', { ascending: true });
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
    return { 
      products: data, 
      total: count,
      totalPages: Math.ceil(count / limit)
    };
  },
  
  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name)
      `)
      .eq('id', id)
      .single();
    if (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
    return data;
  },
  
  async createProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select(`
        *,
        category:categories(id, name)
      `);
    if (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
    return data[0];
  },
  
  async updateProduct(id, product) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select(`
        *,
        category:categories(id, name)
      `);
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
    return data[0];
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);    
    if (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
    return true;
  },

  async uploadImage(file) {
    let image_url;
    if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: upErr } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);
        if (upErr) throw upErr;
        image_url = fileName;
    }
    return image_url;
  }
};

export default productService;