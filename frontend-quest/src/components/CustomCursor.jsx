import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'A' || 
          target.tagName.toLowerCase() === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Главная точка - следует ТОЧЬ-В-ТОЧЬ за мышью без задержек */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-blood rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0 }} // Нулевая задержка
      />
      {/* Внешний круг - легкая аура, которая реагирует на наведение */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-blood rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(138, 3, 3, 0.1)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ type: 'tween', duration: 0.1 }} // Очень быстрый отклик
      />
    </>
  );
};

export default CustomCursor;