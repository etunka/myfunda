/**
 *
 * @param string tagName
 * @returns
 */
export function c(tagName, params = {}) {
  const element = document.createElement(tagName);
  if (params.className) {
    if (typeof params.className === "string") {
      params.className = params.className.split(" ");
    }
    params.className.forEach(function(el) {
      element.classList.add(el);
    });
  }

  if (params.id) {
    element.id = params.id;
  }

  switch (typeof params.childContent) {
    case "undefined":
      break;
    case "string":
      element.innerHTML = params.childContent;
      break;

    case "object":
      if (params.childContent instanceof Element)
        element.appendChild(params.childContent);
      break;

    default:
      break;
  }

  return element;
}

/**
 * Appends child into element
 * @param {*} element, children
 */
export function append(element, children) {
  element.appendChild(children);
}

/**
 * Sets text content of the selected element
 * @param {*} id
 * @param {*} content
 */
export function setContentById(id, content = "") {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = content;
  } else {
    console.warn(`element with id:${id} does not exists`);
  }
}

export function getFirstInteger(str) {
  return str.replace(/(^\d+)(.+$)/i, "$1");
}

export function thousandSeparator(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
