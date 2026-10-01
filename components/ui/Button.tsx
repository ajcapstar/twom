import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  type = "button",
}) => {
  const classes = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        <span className={styles.btnText}>{children}</span>
        <span className={styles.btnBg} />
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      <span className={styles.btnText}>{children}</span>
      <span className={styles.btnBg} />
    </button>
  );
};

export default Button;
