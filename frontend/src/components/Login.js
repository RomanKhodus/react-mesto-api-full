import React from "react";
import SigningForm from "./SigningForm";

function Login({ handleEmailchange, authorize, isLoading }) {
  const [email, setEmail] = React.useState("");
  const handleSetEmail = (e) => {
    setEmail(e.target.value);
    handleEmailchange(email);
  };
  const [password, setPassword] = React.useState("");
  const handleSetPassword = (e) => {
    setPassword(e.target.value);
  };

  function onLogin(e) {
    e.preventDefault();
    authorize(email, password);
  }

  return (
    <SigningForm
      title="Вход"
      disabled={isLoading}
      buttonText={isLoading ? "...Загружаю" : "Войти"}
      onSubmit={onLogin}
    >
      <input
        type="email"
        // id=""
        className="signing__input"
        name="email"
        value={email}
        onChange={handleSetEmail}
        placeholder="Email"
        required
      />
      <input
        type="password"
        // id=""
        className="signing__input"
        name="password"
        value={password}
        onChange={handleSetPassword}
        placeholder="Пароль"
        required
      />
    </SigningForm>
  );
}

export default Login;
