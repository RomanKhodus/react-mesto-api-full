import React from "react";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from "../context/CurrentUserContext.js";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState({ name: "" });
  const [description, setDescription] = React.useState({ about: "" });

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profile"
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    >
      <input
        id="name-input"
        type="text"
        className="popup__input popup__input_type_name"
        name="name"
        value={name || ""}
        onChange={handleChangeName}
        placeholder="Имя"
        required
        minLength="2"
        maxLength="40"
      />
      <span className="name-input-error popup__input-error"></span>
      <input
        id="job-input"
        type="text"
        className="popup__input popup__input_type_job"
        name="about"
        onChange={handleChangeDescription}
        value={description || ""}
        placeholder="О себе"
        required
        minLength="2"
        maxLength="200"
      />
      <span className="job-input-error popup__input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
