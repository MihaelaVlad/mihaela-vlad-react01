import { addMessage, clearMessages } from './notificationBar.js';
import { findContact } from './query.js';
import render from './message.js';
import { pluralize } from './utils.js';
import stage from './stage.js';
import { render as renderContact } from './contact.js';

const searchForm = document.querySelector('.search-form');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const queryInput = form.q;

  clearMessages();

  const contacts = findContact(queryInput.value.toLowerCase());
  const contactCount = contacts.length;
  const fragment = new DocumentFragment();

  contacts.forEach((contact) => {
    fragment.append(renderContact(contact));
  });

  if (contacts.length <= 0) {
    addMessage(render('No contacts found', 'warning'));
  } else {
    const petsCount = contacts.reduce((petsCount, contact) => {
      const { pets = [] } = contact;
      petsCount += pets.length;

      return petsCount;
    }, 0);

    addMessage(
      render(
        `Found ${pluralize(contactCount, {
          one: 'contact',
          many: 'contacts',
        })} with ${
          petsCount <= 0
            ? 'no pets'
            : pluralize(petsCount, {
                one: 'pet',
                many: 'pets',
              })
        }.`,
        'success',
      ),
    );
  }

  queryInput.value = '';
  stage.innerHTML = '';
  stage.append(fragment);
});

export default searchForm;
