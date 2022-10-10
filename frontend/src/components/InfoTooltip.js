function InfoTooltip({ isOpen, onClose, isSuccess }) {
  return (
    <div className={isOpen ? `popup infoTooltip-popup popup_opened` : `popup infoTooltip-popup`}>
      <div className="popup__container">
        <button type="button" className="popup__button-close" onClick={onClose}></button>
        <div
          className={
            isSuccess ? "popup__icon popup__icon_is_success" : "popup__icon popup__icon_is_fail"
          }
        ></div>
        {isSuccess ? (
          <h2 className="popup__header">Вы успешно зарегистрировались!</h2>
        ) : (
          <h2 className="popup__header">Что-то пошло не так! Попробуйте ещё раз.</h2>
        )}
      </div>
    </div>
  );
}

export default InfoTooltip;
