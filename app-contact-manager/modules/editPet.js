import { getContact } from './query.js';
import { getPet } from './query.js';

export const render = (contactId) => {
  const container = document.createElement('form');
  container.classList.add('edit-pet');
  const { name, surname } = getContact(contactId);
  const { namePet, species, age, id } = getPet(petID);

  container.innerHTML = `
    <h4>Editing pet for ${name} ${surname}.</h4>
    <label class="form-label mt-2">Name</label>
    <input type="text"
      name="name"
      class="form-control form-control-sm"
      value="${namePet}"
    >

    <label class="form-label mt-2">Species</label>
    <input type="text"
      name="species"
      class="form-control form-control-sm"
      value="${species}"
    >

    <label class="form-label mt-2">Age</label>
    <input type="text"
      name="age"
      class="form-control form-control-sm"
      value="${age}"
    >

    <input type="hidden" name="id" value="${id}">

    <div class="mt-2">
      <button type="submit"
        title="Save"
        class="btn btn-secondary me-1"
      >Save</button>
      <button type="button"
        title="Cancel"
        class="btn btn-secondary cancel-button"
      >Cancel</button>
    </div>
  `;

  return container;
};
