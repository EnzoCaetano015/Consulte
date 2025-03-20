import { useRef, useState } from "react";
import styles from "./Home.module.css";
import { IdCard, User, Lock } from "lucide-react";
import axios from "axios";
import { URL } from "../../Config/config";

import useInView from "../../Hook";
import "../../Hook/Hook.css"

const USER = ["Visualizador", "Administrador"];

function Home() {
    const ref = useRef<HTMLDivElement>(null)
    const isVisible = useInView(ref)

    const [user, setUser] = useState(USER[0]);
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Determina o tipo de usuário (1 ou 2)
            const userType = user === "Visualizador" ? 1 : 2;

            // Exibe os dados que serão enviados
            console.log("Enviando para API:", { nome, senha, user: userType });

            // Envia a requisição POST
            const response = await axios.post(`${URL}login`, {
                nome,
                senha,
                user: userType,
            });

            // Se a API retornar sucesso
            if (response.data.success) {
                console.log("Login bem-sucedido:", response.data);
                window.location.href = response.data.redirectTo; // Redireciona para a rota correta
            }
        } catch (error: unknown) {
            // Tratamento de erro no frontend
            if (axios.isAxiosError(error)) {
                console.error("Erro na API:", error.response?.data);
                alert(error.response?.data?.error || "Erro no login");
            } else {
                console.error("Erro inesperado:", error);
                alert("Ocorreu um erro inesperado.");
            }
        }
    };


    return (
        <section className={styles.container}>
            <div className={`About fade-in-section ${isVisible ? 'is-visible' : ''}`}
                ref={ref}>
                <div className={styles.form}>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="user">
                            Usuário <User />
                        </label>
                        <select
                            id="user"
                            name="user"
                            required
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        >
                            {USER.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="nome">
                            Nome <IdCard />
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            placeholder="visu ou adm"
                        />{" "}
                        <br />
                        <label htmlFor="senha">
                            Senha <Lock />
                        </label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            placeholder="12345"
                        />{" "}
                        <br />
                        <button>Entrar</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Home;
