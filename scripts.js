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
console.log(path[2]);
// console.log(JSON.parse(path[2]));
      const animal = JSON.parse(path[2].dataset.animal);
      for (const key in form.elements) {
        const inputElement = form.elements[key];
        inputElement.value = animal[inputElement.name];
        // inputElement.value = animal["name"];
        // inputElement.value = animal["specie"];
      }

      EDIT_ANIMAL = animal;
    })
  );


  ////Debug!

  deleteAnimals.forEach(button =>
    button.addEventListener('click', async ({ path }) => {
      const animal = path[2];
      console.log(animal);

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
const populateAnimals = animals => {
  const formatedAnimals = animals.map(formatAnimal);
  const displayAnimals = document.querySelector('.display-animals');

  displayAnimals.innerHTML += formatedAnimals.join('');
};

// get single animal data and format it
const formatAnimal = animal => {
  const { name, specie, clas, info } = animal;
  return `
  <div class='animal' data-animal=${JSON.stringify(animal)}>
      <div> ${name} </div>
      <div>${specie} </div>
      <div> ${clas} </div>
      <div> ${info} </div>
      <div class='edit-animal'>
            <button id = 'edit' >Edit</button>
            <button id = 'delete' >Delete</button>
      </div>
  </div>
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
