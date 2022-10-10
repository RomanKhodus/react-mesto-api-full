function SigningForm({ title, children, buttonText, onSubmit }) {
  return (
    <div className="signing__container">
      <form onSubmit={onSubmit} className="signing__form">
        <h2 className="signing__header">{title}</h2>
        {children}
        <button type="submit" className="signing__button-submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
}

export default SigningForm;
