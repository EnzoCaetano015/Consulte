import { useState, useEffect, RefObject } from 'react';

function useInView(ref: RefObject<Element>): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;

        // Verifica se o elemento está dentro da viewport
        if (rect.top <= windowHeight && rect.bottom >= 0) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      }
    };

    // Executa a verificação na montagem
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return isInView;
}

export default useInView