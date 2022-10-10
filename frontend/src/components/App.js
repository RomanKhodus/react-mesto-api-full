import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Footer from "./Footer.js";
import Header from "./Header.js";
import Main from "./Main.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import api from "../Utils/api.js";
import { CurrentUserContext } from "../context/CurrentUserContext.js";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoTooltip from "./InfoTooltip.js";
import * as Auth from "../Utils/Auth.js";
import ProtectedRoute from "./ProtectedRoute.js";

function App() {
  const history = useHistory();

  const [email, setEmail] = React.useState("");
  function handleEmailchange(email) {
    setEmail(email);
  }
  const [isLoading, setIsLoading] = React.useState(false); //Универсальная реализация состояния загрузки вместо buttonText, можно передавать в любой компонент для настройки

  const [password, setPassword] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(true);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
  }
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  function handleEditProfilePopupOpen() {
    setIsEditProfilePopupOpen(true);
  }
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  function handleAddPlacePopupOpen() {
    setIsAddPlacePopupOpen(true);
  }
  const [selectedCard, setSelectedCard] = React.useState({ name: "", link: "" });
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  React.useEffect(() => {
    // проверка токена

    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        Auth.getContent(jwt).then((res) => {
          if (res) {
            setEmail(res.data.email);
            setLoggedIn(true);
            history.push("/");
          }
        });
      }
    }

    // Получение начальных данных

    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(`Ошибка: ${err.status}`));

    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(`Ошибка: ${err.status}`));
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);

    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, []);

  function escFunction(event) {
    if (event.keyCode === 27) {
      closeAllPopups();
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(`Ошибка: ${err.status}`));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => {
          return state.filter((item) => item._id !== card._id);
        });
      })
      .catch((err) => console.log(`Ошибка: ${err.status}`));
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({ name: "", link: "" });
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    api
      .setUserInfo(user)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err.status}`))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .setAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err.status}`))
      .finally(() => {
        // setButtonText("Сохранить");
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(cardData) {
    // setButtonText("Думаю...");
    setIsLoading(true);
    api
      .setNewCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err.status}`))
      .finally(() => {
        // setButtonText("Сохранить");
        setIsLoading(false);
      });
  }

  function handleAuthorize(email, password) {
    setIsLoading(true);
    Auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          setPassword("");
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleRegister(email, password) {
    setIsLoading(true);
    Auth.register(email, password)
      .then((res) => {
        if (res) {
          setIsSuccess(true);
          history.push("/sign-in");
        }
      })
      .catch((err) => {
        setIsSuccess(false);
        console.log(`Ошибка: ${err.status}`);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} handleEmailchange={handleEmailchange} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={loggedIn}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfilePopupOpen}
            onAddPlace={handleAddPlacePopupOpen}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Route exact path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>

          <Route exact path="/sign-up">
            <Register
              onRegistration={handleInfoTooltipOpen}
              register={handleRegister}
              isLoading={isLoading}
            />
          </Route>

          <Route exact path="/sign-in">
            <Login
              handleEmailchange={handleEmailchange}
              authorize={handleAuthorize}
              isLoading={isLoading}
            />
          </Route>
        </Switch>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isSuccess={isSuccess} />
        {/* Еще не реализован */}
        <PopupWithForm title="Вы уверены?" name="remove" buttonText="Да"></PopupWithForm> <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
