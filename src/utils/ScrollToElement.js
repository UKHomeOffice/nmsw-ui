export const scrollToElementId = (id) => {
    document.getElementById(id).scrollIntoView();
    document.activeElement.blur();
};

export const scrollToH1 = () => {
  document.getElementsByTagName('html')[0].scrollIntoView();
};
