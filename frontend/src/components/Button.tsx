import React from 'react';
import '../styles.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = 'primary' }) => {
  return (
    <button className={`button ${type}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
