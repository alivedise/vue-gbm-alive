function findElementWithText(document, tag = 'th', text) {
  return Array.from(document.querySelectorAll(tag)).find((el) => {
    if (el.textContent.trim() === text) {
      return true;
    }
    const children = el.childNodes;
    return children.some(function (value) {
      if (value.nodeType === 3) {
        return value.rawText.trim() === text;
      }
      return false;
    });
  });
}

export default findElementWithText;
