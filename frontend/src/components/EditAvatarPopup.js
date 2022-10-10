import React from "react";
import PopupWithForm from "./PopupWithForm.js";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const avatarRef = React.useRef();

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    >
      <input
        type="url"
        id="avatar-link-input"
        className="popup__input popup__input_type_link"
        name="link"
        ref={avatarRef}
        placeholder="Ссылка на картинку"
        required
      />
      <span className="avatar-link-input-error popup__input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
