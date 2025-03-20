import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // 📌 Importação para exportação do Excel
import styles from "./Client.module.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../Config/config";

const CARGO = ["Todos os cargos", "Advogado", "Administrador", "Desenvolvedor", "Designer"];
const IDADE = ["Todos as idades", "18 a 25", "25 a 40", "40 a 60", "60+"];
const DADOS = ["Todos os dados", "Telefone", "E-mail", "Linkedin", "Estado"];

interface Usuario {
    idUser: number;
    nome: string;
    cargo: string;
    idade: string; // Agora armazena a data de nascimento
    telefone: string;
    email: string;
    linkedin: string;
    estado: string; // Novo campo
}

// 📌 Função para calcular idade a partir da data de nascimento
const calcularIdade = (dataNascimento: string): number => {
    const anoNascimento = new Date(dataNascimento).getFullYear();
    const anoAtual = new Date().getFullYear();
    return anoAtual - anoNascimento;
};

function Client() {
    const navigate = useNavigate();
    const [cargo, setCargo] = useState(CARGO[0]);
    const [idade, setIdade] = useState(IDADE[0]);
    const [dados, setDados] = useState(DADOS[0]);
    const [estado, setEstado] = useState("Todos os estados"); // Estado selecionado
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [estadosDisponiveis, setEstadosDisponiveis] = useState<string[]>([]); // Lista de estados únicos

    useEffect(() => {
        axios.get(`${URL}usuarios`)
            .then(response => {
                const usuarios: Usuario[] = response.data; // 🚀 Informando o tipo corretamente
                setUsuarios(usuarios);
    
                // 📌 Garantindo que 'estado' seja tratado como string
                const estadosUnicos = Array.from(new Set(usuarios.map(user => String(user.estado)))); 
                setEstadosDisponiveis(["Todos os estados", ...estadosUnicos]); // Adiciona "Todos os estados"
            })
            .catch(error => {
                console.error("Erro ao buscar usuários:", error);
            });
    }, []);

    const usuariosFiltrados = usuarios.filter(usuario => {
        if (cargo !== "Todos os cargos" && usuario.cargo !== cargo) return false;

        const idadeUsuario = calcularIdade(usuario.idade);
        if (idade !== "Todos as idades") {
            if (idade === "18 a 25" && !(idadeUsuario >= 18 && idadeUsuario <= 25)) return false;
            if (idade === "25 a 40" && !(idadeUsuario >= 25 && idadeUsuario <= 40)) return false;
            if (idade === "40 a 60" && !(idadeUsuario >= 40 && idadeUsuario <= 60)) return false;
            if (idade === "60+" && idadeUsuario < 60) return false;
        }

        if (estado !== "Todos os estados" && usuario.estado !== estado) return false;

        return true;
    });

    // 📌 Exportar tabela filtrada para Excel
    const exportToExcel = () => {
        const dataToExport = usuariosFiltrados.map(usuario => ({
            Nome: usuario.nome,
            Cargo: usuario.cargo,
            Idade: calcularIdade(usuario.idade) + " anos",
            ...(dados === "Todos os dados" || dados === "Telefone" ? { Telefone: usuario.telefone } : {}),
            ...(dados === "Todos os dados" || dados === "E-mail" ? { Email: usuario.email } : {}),
            ...(dados === "Todos os dados" || dados === "Linkedin" ? { Linkedin: usuario.linkedin } : {}),
            ...(dados === "Todos os dados" || dados === "Estado" ? { Estado: usuario.estado } : {}),
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuários");
        XLSX.writeFile(wb, "usuarios.xlsx");
    };

    return (
        <>
            <section className={styles.container}>
                <div className={styles.menu}>
                <ArrowLeft onClick={() => navigate(-1)}/>
                    <select id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                        {CARGO.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select id="idade" value={idade} onChange={(e) => setIdade(e.target.value)}>
                        {IDADE.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        {estadosDisponiveis.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <select id="dados" value={dados} onChange={(e) => setDados(e.target.value)}>
                        {DADOS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className={styles.tabela}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Idade</th>
                                {dados === "Todos os dados" || dados === "Telefone" ? <th>Telefone</th> : null}
                                {dados === "Todos os dados" || dados === "E-mail" ? <th>E-mail</th> : null}
                                {dados === "Todos os dados" || dados === "Linkedin" ? <th>Linkedin</th> : null}
                                {dados === "Todos os dados" || dados === "Estado" ? <th>Estado</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.idUser}>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.cargo}</td>
                                    <td>{calcularIdade(usuario.idade)} anos</td>
                                    {dados === "Todos os dados" || dados === "Telefone" ? <td>{usuario.telefone}</td> : null}
                                    {dados === "Todos os dados" || dados === "E-mail" ? <td>{usuario.email}</td> : null}
                                    {dados === "Todos os dados" || dados === "Linkedin" ? (
                                        <td><a href={usuario.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></td>
                                    ) : null}
                                     {dados === "Todos os dados" || dados === "Estado" ? <td>{usuario.estado}</td> : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.bottomMenu}>
                    <button onClick={exportToExcel}>Exportar</button>
                </div>
            </section>
        </>
    );
}

export default Client;
