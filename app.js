
const imagenDia = document.getElementById("img-dia");
const fecha = document.getElementById("fecha");
const hoy = new Date().toISOString().split("T")[0];
fecha.max = hoy;
let datos = {};

fecha.addEventListener("change", () => {
    const fechaElegida = fecha.value;

    const url = `https://api.nasa.gov/planetary/apod?api_key=7sMKZ1HGTEiMjM3rDyFlY1B6xlGvO7f0p3on41hu&date=${fechaElegida}`;
    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error("Error al obtener los datos de la API");
            }
            return response.json();
        })
        .then(data => {
            datos = data;
            imagenDia.innerHTML =`
                <img src="${data.url}" class="card-img-top" alt="imagen-del-dia">
                <div class="card-body">
                    <h5 class="card-title">${data.title}- ${data.date}</h5>
                    <p class="card-text">${data.explanation}</p>
                    <button type="button" id="favorito" class="btn btn-primary">GUARDAR FAVORITOS</button>
                </div>`;
            const favoritos = document.getElementById("favorito");
            favoritos.addEventListener("click", ()=> {
                let favoritos = JSON.parse(localStorage.getItem('NASA-favoritos'));
                if (!favoritos) {
                    favoritos = [];
                }
                favoritos.push(datos);
                localStorage.setItem('NASA-favoritos', JSON.stringify(favoritos));
                alert("¡Agregado a favoritos!");
            })
        })
})



