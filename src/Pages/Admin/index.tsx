import { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import { ArrowLeft, Trash2 } from "lucide-react";
import InputMask from "react-input-mask"; // Biblioteca para máscara nos campos
import styles from "./Admin.module.css";

import useInView from "../../Hook";
import "../../Hook/Hook.css"
import { useNavigate } from "react-router-dom";

import { URL } from "../../Config/config";

// 📌 Definição da interface do usuário
interface Usuario {
    idCliente: number;
    idUser: number;
    nome: string;
    cargo: string;
    idade: string;
    email: string;
    telefone: string;
    linkedin: string;
    estado: string;
}

function Admin() {

    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement>(null)
    const isVisible = useInView(ref)

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [nome, setNome] = useState("");
    const [cargo, setCargo] = useState("");
    const [idade, setIdade] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [estado, setEstado] = useState("");
    const [offset, setOffset] = useState(0);

    // 📌 Função para carregar os usuários do banco (5 em 5)
    const carregarUsuarios = async () => {
        try {
            const response = await axios.get(`${URL}dados-recentes?offset=${offset}`);
            setUsuarios((prev) => [...prev, ...response.data]);
            setOffset((prevOffset) => prevOffset + 2); // Atualiza corretamente o offset
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    // 📌 Chama a função carregarUsuarios ao montar o componente
    useEffect(() => {
        carregarUsuarios();
    }, []);

    // 📌 Função para cadastrar um novo usuário
    const cadastrarUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${URL}dados`, {
                nome,
                cargo,
                idade,
                email,
                telefone,
                linkedin,
                estado
            });

            alert("Usuário cadastrado com sucesso!");
            setUsuarios([]); // Limpa os usuários para recarregar
            setOffset(0);
            carregarUsuarios(); // Recarrega os dados mais recentes

            // Limpa os campos do formulário
            setNome("");
            setCargo("");
            setIdade("");
            setEmail("");
            setTelefone("");
            setLinkedin("");
            setEstado("");
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
        }
    };

    // 📌 Função para excluir um usuário
    const excluirUsuario = async (idCliente: number) => {
        const confirmacao = window.confirm("Você irá excluir esse registro permanentemente. Deseja continuar?");
        if (!confirmacao) return;

        try {
            await axios.delete(`${URL}dados/${idCliente}`);
            alert("Usuário excluído com sucesso!");
            window.location.reload();
            setUsuarios(usuarios.filter(usuario => usuario.idCliente !== idCliente));
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
        }
    };

    return (
        <>
            <section className={styles.container}>
                <div className={`About fade-in-section ${isVisible ? 'is-visible' : ''}`}
                ref={ref}>
                    
                    <h1><ArrowLeft className={styles.arrow} onClick={() => navigate(-1)}/>  Painel de Controle</h1>
                </div>

                {/* 📌 Formulário de Cadastro */}
                <div className={`About fade-in-section ${isVisible ? 'is-visible' : ''}`}
                ref={ref}>
                    <div className={styles.cadastro}>
                        <form onSubmit={cadastrarUsuario}>
                        
                            <input type="text" placeholder="Nome (Obrigatório)" value={nome} onChange={(e) => setNome(e.target.value)} required />
                            <input type="text" placeholder="Cargo (Obrigatório)" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
                            <InputMask
                                mask="99/99/9999"
                                placeholder="Data de Nascimento"
                                value={idade}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setIdade(e.target.value)}
                                required
                            />
                            <InputMask mask="(99) 99 9999-9999" placeholder="Telefone" value={telefone} onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)} />
                            <input type="email" placeholder="E-mail (Obrigatório)" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input type="text" placeholder="Linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                            <input type="text" placeholder="Estado (Obrigatório)" value={estado} onChange={(e) => setEstado(e.target.value)} required />
                            <button type="submit">Cadastrar</button>
                        </form>
                    </div>
                </div>

                {/* 📌 Tabela de Usuários */}
                <div className={styles.tabela2}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Idade</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Linkedin</th>
                                <th>Estado</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.idCliente}>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.cargo}</td>
                                    <td>{usuario.idade}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.telefone}</td>
                                    <td>
                                        {usuario.linkedin ? (
                                            <a href={usuario.linkedin} target="_blank" rel="noopener noreferrer">
                                                Linkedin
                                            </a>
                                        ) : "-"}
                                    </td>
                                    <td>{usuario.estado}</td>
                                    <td>
                                        <Trash2 onClick={() => excluirUsuario(usuario.idCliente)} style={{ cursor: "pointer", color: "red" }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 📌 Botão para carregar mais registros */}
                <button className={styles.botao} onClick={carregarUsuarios}>Carregar mais</button>
            </section>
        </>
    );
}

export default Admin;
