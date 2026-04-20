const url = "https://api.nasa.gov/planetary/apod?api_key=4E6uMrqTMpeFjWcID0BUdIgt9IZLbW9zqtU8YRG8";
const imagenDia = document.getElementById("img-dia");

fetch(url)
.then(response => {
    if(!response.ok){
        throw new Error("Error al obtener los datos de la API");
    }
    return response.json();
})
.then(data => {
    imagenDia.innerHTML =`
        <img src="${data.url}" class="card-img-top" alt="imagen-del-dia">
        <div class="card-body">
            <h5 class="card-title">${data.title}- ${data.date}</h5>
            <p class="card-text">${data.explanation}</p>
            <button type="button" class="btn btn-primary">GUARDAR FAVORITOS</button>
        </div>`
})