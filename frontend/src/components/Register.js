import React from "react";
import SigningForm from "./SigningForm";

function Register({ onRegistration, register, isLoading }) {
  const [email, setEmail] = React.useState("");

  const handleSetEmail = (e) => {
    setEmail(e.target.value);
  };

  const [password, setPassword] = React.useState("");
  const handleSetPassword = (e) => {
    setPassword(e.target.value);
  };

  function onRegister(e) {
    e.preventDefault();
    onRegistration();
    register(email, password);
  }

  return (
    <SigningForm
      title="Регистрация"
      disabled={isLoading}
      buttonText={isLoading ? "..Регистрирую" : "Зарегистрироваться"}
      onSubmit={onRegister}
    >
      <input
        type="email"
        // id=""
        className="signing__input"
        name="email"
        onChange={handleSetEmail}
        value={email}
        placeholder="Email"
        required
      />
      <input
        type="password"
        // id=""
        className="signing__input"
        value={password}
        name="password"
        onChange={handleSetPassword}
        placeholder="Пароль"
        required
      />
    </SigningForm>
  );
}

export default Register;
