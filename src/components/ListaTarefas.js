import React, { useEffect, useState } from "react";
import api from '../api/api';
import CadastroTarefa from "./CadastroTarefa";

const ListaTarefas = () => {
    const [tarefas, setTarefas] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

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
            setTarefas(prevTarefas => prevTarefas.filter(tarefa => tarefa.id !==id));
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    };

    return (
        <div className="container mt-4">
           <button
           className='btn btn-success mb-3'
           onClick={() => setMostrarFormulario(prev => !prev)}
           >
            {mostrarFormulario ? 'Fechar Formulario' : 'Nova Tarefa'}
           </button>

           {mostrarFormulario && (
            <CadastroTarefa onTarefaCadastrada={carregarTarefas}/>
           )}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Título</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {tarefas.map(tarefa => (
                        <tr key={tarefa.id}>
                        <th scope="row">{tarefa.id}</th>
                        <td>{tarefa.nome}</td>
                        <td>{tarefa.descricao}</td>
                        <td>{tarefa.status}</td>
                        <td>
                            <button type="button" className="btn">
                                <i className='bi bi-pencil-square text-primary'></i>
                            </button>
                            <button type='button'
                                className= 'btn'
                                onClick={() => handleDelete(tarefa.id)}>
                                <i className="bi bi-trash text-danger"></i>
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}

export default ListaTarefas;