import { useNavigate } from "react-router-dom";
import style from "./Splash.module.css"
import { useEffect, useRef } from "react";
import useInView from "../../Hook";
import "../../Hook/Hook.css"

function Splash() {

  const logoref = useRef<HTMLDivElement>(null)
  const islogoVisible = useInView(logoref)

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      navigate("/Login");
    }, 3000);


    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <section className={style.container}>
        <div className={`About fade-in-section ${islogoVisible ? 'is-visible' : ''}`}
          ref={logoref} >
          <div className={style.logo}>
            <img src="/LOGO CONSULT.png" alt="" />
            <h2>Sistema de Consulta</h2>
          </div>
        </div>
      </section>
    </>
  )
}

export default Splash