import { render } from './addContact.js';
import { clearMessages } from './notificationBar.js';
// default exports can be renamed as we please
import tazz from './stage.js';

const addContactButton = document.querySelector('.add-contact-button');
const clearStage = (element) => {
  element.innerHTML = '';
};

addContactButton.addEventListener('click', (event) => {
  clearMessages();
  clearStage(tazz);

  tazz.append(render());
});

export default addContactButton;
