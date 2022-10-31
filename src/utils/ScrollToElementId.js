export const scrollToElementId = (id) => {
    document.getElementById(id).scrollIntoView();
    document.activeElement.blur();
};
