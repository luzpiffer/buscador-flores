const apiKey = "sk-TRNM682a74b011e0110534";
const container = document.getElementById("flowers-container");
const searchInput = document.getElementById("search");

async function getFlowers(query = "") {
    container.style.opacity = 0;
    container.innerHTML = "Cargando flores...";
    try {
        const res = await fetch(`https://perenual.com/api/species-list?key=${apiKey}&q=${query}`);
        const data = await res.json();
        showFlowers(data.data);
        container.style.opacity = 1;
    } catch (err) {
        console.error("Error al cargar la lista de flores:", err);
        container.innerHTML = "Error al cargar datos 😢";
        container.style.opacity = 1;
    }
}

function showFlowers(flowers) {
    container.innerHTML = "";
    flowers.forEach(flower => {
        const div = document.createElement("div");
        div.className = "flower";
        div.innerHTML = `
            <h3>${flower.common_name || "Sin nombre"}</h3>
            <img src="${flower.default_image?.thumbnail || ''}" alt="${flower.common_name || 'Flor'}" style="max-width:100%;" onerror="this.onerror=null; this.src='img/default_flower.jpg'"/>
            <button onclick="getFlowerDetails(${flower.id})">Ver más</button>
        `;
        container.appendChild(div);
    });
}

async function getFlowerDetails(id) {
    container.style.opacity = 0;
    container.innerHTML = "Cargando detalles...";
    try {
        const res = await fetch(`https://perenual.com/api/species/details/${id}?key=${apiKey}`);
        const data = await res.json();
        showFlowerDetails(data);
        container.style.opacity = 1;
    } catch (err) {
        console.error(`Error al cargar los detalles de la flor con ID ${id}:`, err);
        container.innerHTML = "Error al cargar los detalles 😢";
        container.style.opacity = 1;
    }
}

function showFlowerDetails(data) {
    container.innerHTML = `
        <div class="flower-details-container" style="opacity: 0;">
            <h2>${data.common_name || "Sin nombre"}</h2>
            <img src="${data.default_image?.regular_url || ''}" alt="${data.common_name || 'Flor'}" class="flower-image-details" onerror="this.onerror=null; this.src='img/default_flower_large.jpg'"/>
            <div class="flower-info">
                <p><strong>Nombre científico:</strong> <span class="scientific-name">${data.scientific_name || "No disponible"}</span></p>
                <p><strong>Riego:</strong> <span class="watering">${data.watering || "No disponible"}</span></p>
                <p><strong>Luz solar:</strong> <span class="sunlight">${data.sunlight?.join(", ") || "No disponible"}</span></p>
            </div>
            <div class="flower-description">
                <h3>Descripción</h3>
                <p>${data.description || "Sin descripción."}</p>
            </div>
            <button class="back-button" onclick="getFlowers(searchInput.value)">⬅ Volver</button>
        </div>
    `;
    setTimeout(() => {
        const detailsContainer = document.querySelector('.flower-details-container');
        if (detailsContainer) {
            detailsContainer.style.opacity = 1;
        }
    }, 50);
}

searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim();
    // Evitar búsquedas vacías o solo con espacios
    if (value) {
        getFlowers(value);
    } else {
        getFlowers();
    }
});

getFlowers();