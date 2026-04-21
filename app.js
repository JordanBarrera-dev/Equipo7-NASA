// Traer los elementos del html
const imagenDia = document.getElementById("img-dia");
const fecha = document.getElementById("fecha-nasa");

// Fecha de hoy en formato YYYY-MM-DD
const hoy = new Date().toISOString().split("T")[0];
fecha.value = hoy;        // fecha del día en que se abre la página
fecha.max = hoy;          // no deja seleccionar fechas futuras

// Guarda los datos de la imagen actual
let datosActuales = {};

// =====================================================
// FUNCION PARA CARGAR UNA IMAGEN DESDE LA API
// =====================================================
function cargarImagen(fechaElegida) {
    // Mostrar mientras carga
    imagenDia.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Cargando...</p>
        </div>
    `;

    const url = `https://api.nasa.gov/planetary/apod?api_key=7sMKZ1HGTEiMjM3rDyFlY1B6xlGvO7f0p3on41hu&date=${fechaElegida}`;
    
    fetch(url)
        .then(function(respuesta) {
            if (!respuesta.ok) {
                throw new Error("Error al cargar");
            }
            return respuesta.json();
        })
        .then(function(datos) {
            mostrarDatos(datos);
        })
        .catch(function(error) {
            imagenDia.innerHTML = `
                <div class="alert alert-danger text-center m-3">
                    <p>No se pudo cargar la imagen para esta fecha</p>
                    <p class="small">Prueba con otra fecha</p>
                </div>
            `;
        });
}

// =====================================================
// FUNCION PARA MOSTRAR LA LISTA DE FAVORITOS
// =====================================================
function mostrarListaFavoritos() {
    // Buscar si ya existe el contenedor donde van los favoritos
    let contenedor = document.getElementById("contenedorFavoritos");
    
    // Si no existe, crearlo
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "contenedorFavoritos";
        contenedor.className = "container mt-5";
        contenedor.innerHTML = '<h3 class="text-center mb-3">MIS FAVORITOS</h3><div id="listaFavoritos" class="row g-3"></div>';
        
        // Poner el contenedor debajo del main
        const main = document.querySelector("main");
        main.insertAdjacentElement("afterend", contenedor);
    }
    
    // Buscar el div donde van las tarjetas de favoritos
    const lista = document.getElementById("listaFavoritos");
    
    // Traer los favoritos guardados del localStorage (o lista vacia si no hay)
    const favoritos = JSON.parse(localStorage.getItem('NASA-favoritos')) || [];
    
    // Si no hay favoritos, mostrar mensaje y salir de la funcion
    if (favoritos.length === 0) {
        lista.innerHTML = '<div class="col-12 text-center text-white-50 p-4">No hay favoritos guardados</div>';
        return;
    }
    
    // Limpiar la lista actual para volver a llenarla
    lista.innerHTML = "";
    
    // Recorrer cada favorito y crear su tarjeta
    for (let i = 0; i < favoritos.length; i++) {
        const fav = favoritos[i];
        
        // Crear una columna para cada favorito
        const columna = document.createElement("div");
        columna.className = "col-md-6 col-lg-4";
        
        // Definir la miniatura (si es video o imagen)
        let miniatura = "";
        if (fav.media_type === "video") {
            // Si es video, mostrar icono
            miniatura = '<div class="video-placeholder" style="height:150px; background:#1a1a2e; display:flex; align-items:center; justify-content:center;"><i class="fas fa-video fa-3x" style="color:#8b5cf6;"></i></div>';
        } else {
            // Si es imagen, mostrarla
            miniatura = `<img src="${fav.url}" style="height:150px; width:100%; object-fit:cover;" alt="${fav.title}">`;
        }
        
        // Armar la tarjeta completa del favorito
        columna.innerHTML = `
            <div class="card h-100 bg-dark bg-opacity-50 border-secondary">
                ${miniatura}
                <div class="card-body">
                    <h6 class="card-title">${fav.title}</h6>
                    <p class="small text-white-50">${fav.date}</p>
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="cargarFecha('${i}')">
                        Ver imagen
                    </button>
                </div>
            </div>
        `;
        
        // Agregar la columna a la lista de favoritos
        lista.appendChild(columna);
    }
}

// Toma la fecha del favorito cuando el usuario hace clic y carga la imagen 
function cargarFecha(favoritoIndex) {
    const favoritos = JSON.parse(localStorage.getItem('NASA-favoritos')) || [];
    const datos = favoritos[favoritoIndex];
    mostrarDatos(datos)
    // Ir arriba
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// =====================================================
// EVENTO CUANDO CAMBIA LA FECHA
// =====================================================
fecha.addEventListener("change", function() {
    const fechaElegida = fecha.value;
    
    // Validar que no sea una fecha futura
    if (fechaElegida > hoy) {
        alert("No se pueden seleccionar fechas futuras");
        fecha.value = hoy;
        return;
    }
    
    cargarImagen(fechaElegida);
});

function mostrarDatos(datos) {
    datosActuales = datos;
    
    // Verificar si es video o imagen
    let contenido = "";
    if (datos.media_type === "video") {
        contenido = `<video src="${datos.url}" controls style="width:100%; height:300px; border:none; border-radius:8px;"></video>`;
    } else {
        contenido = `<img src="${datos.url}" class="card-img-top" alt="imagen-del-dia">`;
    }
    
    // Verifica si la imagen ya esta en favoritos para cambiar el texto del boton de guardar a ya está en favoritos
    let favoritosGuardados = JSON.parse(localStorage.getItem('NASA-favoritos')) || [];
    let yaEsta = false;
    for (let i = 0; i < favoritosGuardados.length; i++) {
        if (favoritosGuardados[i].date === datos.date) {
            yaEsta = true;
            break;
        }
    }
    
    let textoBoton = "☆ GUARDAR FAVORITOS";
    let claseBoton = "btn btn-primary";
    if (yaEsta) {
        textoBoton = "★ YA EN FAVORITOS";
        claseBoton = "btn btn-secondary";
    }
    
    // Mostrar la imagen y la informacion
    imagenDia.innerHTML = `
        ${contenido}
        <div class="card-body">
            <h5 class="card-title">${datos.title} - ${datos.date}</h5>
            <p class="card-text">${datos.explanation}</p>
            <button type="button" id="botonFavorito" class="${claseBoton} w-100">${textoBoton}</button>
        </div>
    `;
    
    // Evento del boton guardar
    const boton = document.getElementById("botonFavorito");
    if (boton) {
        boton.addEventListener("click", function() {
            let favoritos = JSON.parse(localStorage.getItem('NASA-favoritos')) || [];

            // Revisar que no este repetido
            let repetido = false;
            for (let i = 0; i < favoritos.length; i++) {
                if (favoritos[i].date === datosActuales.date) {
                    repetido = true;
                    break;
                }
            }
            
            if (!repetido) {
                favoritos.push(datosActuales);
                localStorage.setItem('NASA-favoritos', JSON.stringify(favoritos));
                alert("❤️ Imagen guardada en favoritos");
                cargarImagen(datosActuales.date); // recargar para actualizar el boton
                mostrarListaFavoritos(); // actualizar la lista
            } else {
                alert("Esta imagen ya esta en favoritos");
            }
        });
    }
}

// =====================================================
// CARGAR LA IMAGEN DEL DIA AL INICIAR
// =====================================================
cargarImagen(hoy);
mostrarListaFavoritos();