export default (message = '', type = 'default', elementType = 'div') => {
  const messageContainer = document.createElement(elementType);
  messageContainer.classList.add(
    'alert',
    `alert-${type}`,
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );

  messageContainer.textContent = message;

  const closeButton = document.createElement('div');
  closeButton.classList.add('btn');
  closeButton.textContent = 'x';
  messageContainer.append(closeButton);

  closeButton.addEventListener('click', () => {
    messageContainer.remove();
  });

  return messageContainer;
};
