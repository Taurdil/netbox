import { getElements, scrollTo } from '../util';

function handleFormSubmit(event: Event, form: HTMLFormElement): void {
  // Automatically select all options in any <select> with the "select-all" class. This is useful for
  // multi-select fields that are used to add/remove choices.
  for (const element of getElements<HTMLOptionElement>('select.select-all option')) {
    element.selected = true;
  }

  // Track the names of each invalid field.
  const invalids = new Set<string>();

  for (const element of form.querySelectorAll<FormControls>('*[name]')) {
    if (!element.validity.valid) {
      invalids.add(element.name);
      // If the field is invalid, but doesn't contain the .is-invalid class, add it.
      if (!element.classList.contains('is-invalid')) {
        element.classList.add('is-invalid');
      }
    } else {
      // If the field is valid, but contains the .is-invalid class, remove it.
      if (element.classList.contains('is-invalid')) {
        element.classList.remove('is-invalid');
      }
    }
  }

  if (invalids.size !== 0) {
    // If there are invalid fields, pick the first field and scroll to it.
    const firstInvalid = form.elements.namedItem(Array.from(invalids)[0]) as Element;
    scrollTo(firstInvalid);

    // If the form has invalid fields, don't submit it.
    event.preventDefault();
  }
}

/**
 * Attach an event listener to each form's submitter (button[type=submit]). When called, the
 * callback checks the validity of each form field and adds the appropriate Bootstrap CSS class
 * based on the field's validity.
 */
export function initFormElements(): void {
  for (const form of getElements('form')) {
    // Find each of the form's submitters. Most object edit forms have a "Create" and
    // a "Create & Add", so we need to add a listener to both.
    const submitters = form.querySelectorAll<HTMLButtonElement>('button[type=submit]');
    for (const submitter of submitters) {
      // Add the event listener to each submitter.
      submitter.addEventListener('click', (event: Event) => handleFormSubmit(event, form));
    }

    // Initialize any reset buttons so that when clicked, the page is reloaded without query parameters.
    const resetButton = document.querySelector<HTMLButtonElement>('button[data-reset-select]');
    if (resetButton !== null) {
      resetButton.addEventListener('click', () => {
        window.location.assign(window.location.origin + window.location.pathname);
      });
    }
  }
}
