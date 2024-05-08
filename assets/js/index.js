let currentPage = 1;
let loadedCharacters = [];

let isLoading = false;

const fetchApiAll = async(page = 1, limit = 8) => {
    try{
        const response = await fetch("https://rickandmortyapi.com/api/character?page=${page}&limit=${limit}");
        const data = await response.json();
        return data.results;
    }catch(error){
        console.log(error);
    }
}

const createCharacterCards = async (characters) => {

    const personajesRow = document.getElementById('personajesRow');

    characters.map((character) => {
         const { id, name,image } = character;
         
             const divRow = document.createElement('div');
             divRow.classList.add("col-xl-3");
             divRow.classList.add("col-lg-3");
             divRow.classList.add("col-md-3");
             divRow.classList.add("col-sm-12");
             divRow.classList.add("col-xs-12");

             const card = document.createElement('div');
             card.classList.add('card');
             card.classList.add('mt-2');
             card.classList.add('mb-2');

             const imgCard = document.createElement('img');
             imgCard.classList.add('card-img-top');
             imgCard.classList.add('mt-2');
             imgCard.classList.add('mx-auto');
             imgCard.classList.add('w-75');
             imgCard.src = image;

             const divBody = document.createElement('div');
             divBody.classList.add('card-body');
             divBody.classList.add('text-center');
             divBody.classList.add('mx-auto');

             const tituloC = document.createElement('h5');
             tituloC.classList.add('card-title');
             tituloC.textContent = name;

             const levelC = document.createElement('p');
             levelC.classList.add('card-text');
             levelC.textContent = id;

             const btnVer = document.createElement('button');
             btnVer.classList.add('btn');
             btnVer.classList.add('btn-primary');
             btnVer.classList.add('text-center');
             btnVer.classList.add('mx-auto');

             btnVer.textContent = 'Ver detalles';
             btnVer.addEventListener("click", () => enviarData(id, name, image));             

             divRow.appendChild(card);
             card.appendChild(imgCard);
             card.appendChild(divBody);

             divBody.appendChild(tituloC);
             divBody.appendChild(levelC);
             divBody.appendChild(btnVer);

             personajesRow.appendChild(divRow);
        });
    }
     



fetchApiAll()
    .then((data)=> {
        const { id , name , image , origin } = data[0];
        
        const { name : nombre , url } = origin;


        console.log(id);
        console.log(name);
        console.log(image);        

        console.log("----------------------");
        console.log(nombre);
        console.log(url);
        createCharacterCards(data);
    })
    .catch((error) => {
        console.log(`El error es: ${error}`);
})

    export const loadMoreCharacters = async () => {
        if (isLoading) return;
        isLoading = true;
    
        currentPage++;
        const characters = await fetchApiAll(currentPage);
        if (characters.length > 0) {
            createCharacterCards(characters);
        } else {
            // No more characters to load
            alert("No hay más personajes disponibles.");
        }
    
        isLoading = false;
    }

    const enviarData = (id , name , image) => {
        const rutaArchivoHTML = '../personajes.html';
        
        console.log(id);
        console.log(name);
        console.log(image);
        //Realiza una solicitud para obtener el contenido del archivo HTML
        fetch(rutaArchivoHTML)
             .then((response) => response.text())
             .then(html => {
    
                // Una vez que hayas obtenido el contenido del archivo HTML, puedes manipularlo
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
    
    //         // Modifica el contenido del archivo HTML como desees
               const imagePage = doc.getElementById('imagePage');
               imagePage.src = image;
    
               const namePage = doc.getElementById('name');
    //         namePage.textContent = name;
    
               const idPage = doc.getElementById('id');
               idPage.textContent = id;
    
               const nuevoHTML = new XMLSerializer().serializeToString(doc);               

          // Finalmente, puedes usar el nuevo HTML como desees, por ejemplo, inyectándolo en tu página actual
            document.body.innerHTML = nuevoHTML;
             })
    
        .catch(error => {
          console.error('Error al cargar el archivo HTML:', error);
        });
    }

    export const loadInitialCharacters = async () => {
        const characters = await fetchApiAll();
        createCharacterCards(characters);
    }

    window.onload = loadInitialCharacters;

    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
        if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
            loadMoreCharacters();
        }
    });