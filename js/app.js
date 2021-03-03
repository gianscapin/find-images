const result = document.getElementById('resultado')
const form = document.getElementById('formulario')
const divPagination = document.getElementById('paginacion')

const registersPerPage = 40;
let totalPages;
let iterator;
let pageActual = 1;
let findTerm;

window.onload = () =>{
    form.addEventListener('submit', validateForm)
}

function validateForm(e){
    e.preventDefault()

    findTerm = document.getElementById('termino').value;

    if(findTerm == ''){
        showMessage('Agrega palabras para encontrar imágenes!.')
        return;
    }

    findImages(findTerm)
}


function showMessage(message){

    const alertExist = document.querySelector('.bg-red-100');

    if(!alertExist){
        const alert = document.createElement('p');
        alert.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center')

        alert.innerHTML =`
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${message}</span>
        `;

        form.appendChild(alert);

        setTimeout(()=>{
            alert.remove()
        },3000)
     }
}

function findImages(term){
    const key = '20498592-abea22d140669ad1c18877e7a';
    const url = `https://pixabay.com/api/?key=${key}&q=${term}&image_type=photo&per_page${registersPerPage}&page=${pageActual}`
    
    fetch(url)
        .then(answer => answer.json())
        .then(result => {
            totalPages = calculatePages(result.totalHits);
            showImages(result.hits)
        })
}

function *createPaginator(total){
    for(let i = 1; i<=total; i++){
        yield(i);
    }
}

function calculatePages(total){
    return parseInt((Math.ceil(total/registersPerPage)));
}

function showImages(images){
    
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }

    console.log(images)
    images.forEach(image =>{
        const {previewURL,likes,views,largeImageURL} = image;

        result.innerHTML+=`
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light"> Me gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light"> Visualizaciones</span></p>

                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                        Ver imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    })

    printPaginator()
    
}

function printPaginator(){
    iterator = createPaginator(totalPages);

    while(divPagination.firstChild){
        divPagination.removeChild(divPagination.firstChild);
    }

    while(true){

        const {value, done} = iterator.next();
        if(done) return;

        const button = document.createElement('a');
        button.href = '#';
        button.dataset.page = value;
        button.textContent = value;
        button.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-10','rounded')

        button.onclick = () =>{
            pageActual = value;
            findImages(findTerm);
        }

        divPagination.appendChild(button);
    }
}
