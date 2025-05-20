import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import categoryService from '@services/categoryService';

const AdminCategoriesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Buscar categorias
    const {
        data: categories,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories
    });

    // Mutação para criar categoria
    const createMutation = useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: () => {
            toast.success('Categoria criada com sucesso!');
            queryClient.invalidateQueries(['categories']);
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(`Erro ao criar categoria: ${error.message}`);
        }
    });

    // Mutação para atualizar categoria
    const updateMutation = useMutation({
        mutationFn: ({ id, category }) => categoryService.updateCategory(id, category),
        onSuccess: () => {
            toast.success('Categoria atualizada com sucesso!');
            queryClient.invalidateQueries(['categories']);
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar categoria: ${error.message}`);
        }
    });

    // Mutação para deletar categoria
    const deleteMutation = useMutation({
        mutationFn: categoryService.deleteCategory,
        onSuccess: () => {
            toast.success('Categoria excluída com sucesso!');
            queryClient.invalidateQueries(['categories']);
        },
        onError: (error) => {
            toast.error(`Erro ao excluir categoria: ${error.message}`);
        }
    });

    // Manipuladores de eventos
    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({
            name: '',
            description: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            updateMutation.mutate({
                id: editingCategory.id,
                category: formData
            });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger" role="alert">
                Erro ao carregar categorias: {error.message}
            </div>
        );
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Gerenciar Categorias</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => handleOpenModal()}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nova Categoria
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((category) => (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleOpenModal(category)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Criação/Edição */}
            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="text-end">
                                        <button
                                            type="button"
                                            className="btn btn-secondary me-2"
                                            onClick={handleCloseModal}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={createMutation.isLoading || updateMutation.isLoading}
                                        >
                                            {createMutation.isLoading || updateMutation.isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Salvando...
                                                </>
                                            ) : (
                                                'Salvar'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoriesPage; 