/* eslint-disable linebreak-style */
let urlInicial = 'https://pokeapi.co/api/v2/pokemon/';
const info = document.querySelector('#info');
let numPokemon = 1;
let limit = 20;
let offset = 0;

function obtenerPokemones() {
  return fetch(urlInicial)
    .then((r) => r.json())
    .then((r) => r.results);
}

function mostrarListadoPokemones(pokemones) {
  const lista = document.createElement('div');

  pokemones.forEach((pokemon) => {
    const { name, url } = pokemon;
    const item = document.createElement('a');
    const id = url.slice(35).replace('/', '');

    item.textContent = name[0].toUpperCase() + name.slice(1, name.length);
    item.href = '#';
    item.classList.add('list-group-item', 'list-group-item-action');
    item.addEventListener('click', () => {
      info.classList.remove('hidden');
      const itemActivo = document.querySelector('.active');
      if (itemActivo) {
        itemActivo.classList.remove('active');
      }
      item.classList.add('active');
      numPokemon = id;

      fetch(url)
        .then((r) => r.json())
        .then((pokemon) => {
          mostrarPokemon(pokemon)});      
    });

    lista.appendChild(item);

  });

  return lista;
}

function mostrarHabilidades(pokemon) {
  const habilidadesDOM = document.querySelector('#abilityList');
  habilidadesDOM.innerHTML = '';
  const habilidadesObj = pokemon.abilities;
  const spanHabilidades = document.querySelector('#habilidades');
  spanHabilidades.textContent = `${habilidadesObj.length}`;

  habilidadesObj.forEach((habilidad) => {
    const { url, name } = habilidad.ability;
    fetch(url)
      .then((info) => info.json())
      .then((infoJSON) => {
        const flavors = infoJSON.flavor_text_entries;
        

        // Aca hago un for loop porque el forEach me encontraba muchos resultados "es" y no lo podia parar.
        for (let i = 0; i < flavors.length; i++) {
          if (flavors[i].language.name === 'es') {
            const descripcion = flavors[i].flavor_text;

            const liHabilidad = document.createElement('li');
            liHabilidad.classList.add('list-group-item');
            const pNombreHabilidad = document.createElement('p');
            pNombreHabilidad.textContent = name[0].toUpperCase() + name.slice(1, name.length) + ':';
            liHabilidad.appendChild(pNombreHabilidad);

            const pDescripcionHabilidad = document.createElement('p');
            pDescripcionHabilidad.textContent = descripcion;
            pNombreHabilidad.appendChild(pDescripcionHabilidad);

            habilidadesDOM.appendChild(liHabilidad);

            break;
          }
        }
      });
  });
}

function mostrarPokemon(pokemon) {
  const imageDOM = document.querySelector('#image');
  const imageDOM1 = document.querySelector('#image1');
  const nameDOM = document.querySelector('#name');
  const heightDOM = document.querySelector('#height');
  const weightDOM = document.querySelector('#weight');
  const { name, height, weight } = pokemon;
  const image = pokemon.sprites.front_default;
  const image1 = pokemon.sprites.back_default;


  imageDOM.setAttribute('src', image);
  // Si tiene solo 1 imagen, elimina el segundo <img> del DOM
  if (image1) {
    imageDOM1.setAttribute('src', image1);
  } else {
    imageDOM1.parentNode.removeChild(imageDOM1);
  }

  nameDOM.textContent = name[0].toUpperCase() + name.slice(1, name.length);
  heightDOM.textContent = `Altura: ${height * 10}cm`;
  weightDOM.textContent = `Peso: ${(weight * 0.1).toFixed(1)}kg`;

  mostrarHabilidades(pokemon);
}

function clickNav(e) {
  const listado = document.querySelector('#listado');

  if (e.target.id === 'next') {
    offset += 20
    urlInicial = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    listado.innerHTML = '';
    inicializar();
  } else if (e.target.id === 'previous' && offset != 0) {
    offset -= 20
    urlInicial = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    listado.innerHTML = '';
    inicializar();
  }
}

function configurarNav() {
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');

  previous.addEventListener('click', clickNav);
  next.addEventListener('click', clickNav);
}

function inicializar() {
  const $listado = document.querySelector('#listado');

  obtenerPokemones()
    .then((pokemones) => {
      $listado.appendChild(mostrarListadoPokemones(pokemones));
    })

  configurarNav();
}

inicializar();
