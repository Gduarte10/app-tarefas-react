import React, { useEffect, useState } from "react";
import api from '../api/api';
import CadastroTarefa from "./CadastroTarefa";

const ListaTarefasAtual = () => {
    const [tarefas, setTarefas] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [tarefaEditando, setTarefaEditando] = useState(null);
    const [tarefaAtualizada, setTarefaAtualizada] = useState({ nome: '', descricao: '', status: '', dataInicio: '', dataFim: '' });

    const carregarTarefas = () => {
        api.get('/tarefas/').then(res => {
            console.log(res)
            setTarefas(res.data);
        });
    }

    useEffect(() => {
        api.get('/tarefas/').then(res => {
            setTarefas(res.data.results || res.data);
        });
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tarefas/${id}/`);
            setTarefas(prevTarefas => prevTarefas.filter(tarefa => tarefa.id !== id));
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    };

    const handleEditeClik = (tarefa) => {
        setTarefaEditando(tarefa.id);
        setTarefaAtualizada({
            nome: tarefa.nome,
            descricao: tarefa.descricao,
            status: tarefa.status,
            dataInicio: tarefa.dataInicio,
            dataFim: tarefa.dataFim,
        })
    }

    const handleSave = async (id) => {
        try {
            await api.put(`/tarefas/${id}/`, tarefaAtualizada);
            setTarefaEditando(null);
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao atualizar', error);
        }
    }

    return (
        <div className="container mt-4">
            <button
                className='btn btn-success mb-3'
                onClick={() => setMostrarFormulario(prev => !prev)}
            >
                {mostrarFormulario ? 'Fechar Formulario' : 'Nova Tarefa'}
            </button>

            {mostrarFormulario && (
                <CadastroTarefa onTarefaCadastrada={carregarTarefas} />
            )}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Título</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Status</th>
                        <th scope="col">Data Iniício</th>
                        <th scope="col">Data Fim</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {tarefas.map((tarefa, indice) => (
                        <tr key={tarefa.id}>
                            <th scope="row">{indice + 1}</th>
                            {tarefaEditando === tarefa.id ? (
                                <>
                                    <td>
                                        <textarea
                                            value={tarefaAtualizada.nome}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, nome: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            value={tarefaAtualizada.descricao}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, descricao: e.target.value })}
                                        />
                                    </td>
                                     <td>
                                        <select
                                            value={tarefaAtualizada.status}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, status: e.target.value })}
                                        >
                                        <option value="Pendente">pendente</option>
                                        <option value="Em andamento">Em andamento</option>
                                        <option value="Concluída">Concluida</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={tarefaAtualizada.dataInicio}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, dataInicio: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={tarefaAtualizada.dataFim}
                                            onChange={(e) => setTarefaAtualizada({ ...tarefaAtualizada, dataFim: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" className="btn" onClick={() => handleSave(tarefa.id)}>
                                            Salvar
                                        </button>
                                        <button type="button" className="btn" onClick={() => setTarefaEditando(null)}>
                                            Cancelar
                                        </button>

                                    </td>
                                   
                                </>
                            ) : (
                                <>

                                    <td>{tarefa.nome}</td>
                                    <td>{tarefa.descricao}</td>
                                    <td>{tarefa.status}</td>
                                    <td>{tarefa.dataInicio ? tarefa.dataInicio.split('T')[0].split('-').reverse().join('/') : ''}</td>
                                    <td>{tarefa.dataFim ? tarefa.dataFim.split('T')[0].split('-').reverse().join('/') : ''}</td>
                                    
                                    <td>
                                        <button type="button" className="btn" onClick={() => handleEditeClik(tarefa)}>
                                            <i className='bi bi-pencil-square text-primary'></i>
                                        </button>
                                        <button type='button'
                                            className='btn'
                                            onClick={() => handleDelete(tarefa.id)}>
                                            <i className="bi bi-trash text-danger"></i>
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr >
                    ))}
                </tbody>
            </table>
        </div >
    );
}

export default ListaTarefasAtual;