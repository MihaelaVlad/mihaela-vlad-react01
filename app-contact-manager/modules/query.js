import contacts from './data.js';

export const findContact = (needle = 'query') => {
  return contacts.filter((contact) => {
    const values = Object.values(contact);
    // [1, 'Carol', 'Carolson', '0741..', 'carol@...']

    const haystsck = values.reduce((haystsck, value) => {
      if (typeof value === 'string') {
        haystsck += value.toLowerCase();
      }

      return haystsck;
    }, '');

    if (haystsck.includes(needle)) {
      return true;
    }

    return false;
  });
};
