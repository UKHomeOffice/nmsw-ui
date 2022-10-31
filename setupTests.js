import '@testing-library/jest-dom';
window.scrollTo = jest.fn();
window.HTMLElement.prototype.scrollIntoView = function() {};
