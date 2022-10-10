 export default function renderLoading(buttonSelector, isLoading) {
    const buttonSubmit = document.querySelector(buttonSelector);
    if (isLoading) {
      buttonSubmit.textContent = "Сохранение...";
    } else {
      buttonSubmit.textContent = "Сохранить";
    }
  }