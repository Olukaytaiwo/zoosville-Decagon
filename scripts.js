const DATABASE_URI = 'http://localhost:3000/animals';
let EDIT_ANIMAL;

const form = document.querySelector('form');
const submitNewAnimal = document.querySelector('#submit-new-animal');
const submitEditedAnimal = document.querySelector('#submit-edited-animal');
submitEditedAnimal.style.display = 'hidden';

// get data from our backend
const getAnimal = async () => {
  const response = await fetch(DATABASE_URI);
  const animals = await response.json();
  populateAnimals(animals);

  // get button actions from page and register event listeners
  const editAnimals = document.querySelectorAll('#edit');

  const deleteAnimals = document.querySelectorAll('#delete');

  // register button actions
  editAnimals.forEach(button =>
    button.addEventListener('click', ({ path }) => {

      submitNewAnimal.style.display = 'none';
      submitEditedAnimal.style.display = 'unset';

      let {animal} = path[2].dataset;
      animal = JSON.parse(animal)
      console.log(animal);
      let input = ['classes', 'info', "specie", "name"]
      for (const key of input) {
        const inputElement = form.elements[key];
        console.log(animal[key], key)
        inputElement.value = animal[key];
      }
      EDIT_ANIMAL = animal;
    })
  );

  deleteAnimals.forEach(button =>
    button.addEventListener('click', async ({ path }) => {
      const animal = path[2];
      const { id } = JSON.parse(path[2].dataset.animal);
      animal.remove();

      await fetch(`${DATABASE_URI}/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
  );
};

// get data and populate our page with data
const populateAnimals =animals => {
  const formatedAnimals = animals.map(formatAnimal);
  const displayAnimals = document.querySelector('.display-animal');

  displayAnimals.innerHTML += formatedAnimals.join('');
};

// get single animal data and format it
const formatAnimal = animal => {
  const { name, specie, classes, info } = animal;
  return `
  <div class='animal' data-animal='${JSON.stringify(animal)}'>
      <div> <h3> ${name} </h3> </div>
      <div> <strong> ${specie} </strong></div>
      <div> ${classes}</div>
      <div> ${info}</div>
      <div class='edit-animal'>
            
            <button id='edit' type="button" class="btn btn-xs btn-info">Edit</button>
            
            <button id='delete' type="button" class="btn btn-xs btn-danger">Delete</button>
      </div>
  </div>
  <hr>
  `;
};

submitNewAnimal.addEventListener('click', async () => {
  event.preventDefault();
  const animal = {};

  for (const key in form.elements) {
    if (form.elements.hasOwnProperty(key)) {
      const inputElement = form.elements[key];
      if (inputElement['name'] && inputElement.value) {
        animal[inputElement['name']] = inputElement.value;
      }
    }
  }

  if (!Object.values(animal).length) return;

  const response = await fetch(DATABASE_URI, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...animal })
  });

  await response.json();
});

submitEditedAnimal.addEventListener('click', async () => {
  event.preventDefault();
  submitNewAnimal.style.display = 'unset';

  const animal = {};

  for (const key in form.elements) {
    if (form.elements.hasOwnProperty(key)) {
      const inputElement = form.elements[key];
      if (inputElement['name'] && inputElement.value) {
        animal[inputElement['name']] = inputElement.value;
      }
    }
  }

  if (!Object.values(animal).length) return;
  const response = await fetch(`${DATABASE_URI}/${EDIT_ANIMAL.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...animal })
  });

  await response.json();
});

$(document).ready(getAnimal);
