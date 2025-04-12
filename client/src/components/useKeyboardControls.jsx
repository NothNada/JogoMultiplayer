// useKeyboardControls.js
import { useState, useEffect } from 'react';

export const useKeyboardControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const handleKeyDown = (event) => {
    if (event.key === 'w') setMovement((prev) => ({ ...prev, forward: true }));
    if (event.key === 's') setMovement((prev) => ({ ...prev, backward: true }));
    if (event.key === 'a') setMovement((prev) => ({ ...prev, left: true }));
    if (event.key === 'd') setMovement((prev) => ({ ...prev, right: true }));
    if (event.key === ' ') setMovement((prev) => ({ ...prev, jump: true }));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'w') setMovement((prev) => ({ ...prev, forward: false }));
    if (event.key === 's') setMovement((prev) => ({ ...prev, backward: false }));
    if (event.key === 'a') setMovement((prev) => ({ ...prev, left: false }));
    if (event.key === 'd') setMovement((prev) => ({ ...prev, right: false }));
    if (event.key === ' ') setMovement((prev) => ({ ...prev, jump: false }));
  };

  // Adicionando os event listeners diretamente no useEffect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};
