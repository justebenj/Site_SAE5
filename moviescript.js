const apiKey = 'd2ce126fbc7fe822d2ea9332ea12a63a';
const NOMBRERECOMMANDATION = 5;

const params = new URLSearchParams(window.location.search);
const idMovie = params.get("id");


function getId(){
    const params = new URLSearchParams(window.location.search);
    const idMovie = params.get("id");

    if (idMovie) {
        console.log("ID récupéré :", idMovie);
        return idMovie;
    } else {
        console.error("Aucun ID trouvé dans l'URL");
    }
}

const movieId=getId();

let apiUrl2 = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}&language=fr-FR&include_image_language=fr,null`;
let IdCollection;

const moviesContainer = document.getElementById("infoSup");

async function recupereBanniere() {
    try {
        const response = await fetch(apiUrl2);
        const data = await response.json();
        if (!data.posters || data.posters.length === 0) {
            throw new Error("Aucun poster trouvé dans la réponse de l'API.");
        }
        for (let i = 0; i < data.posters.length; i++) {
            if (i == 0){
                const bannerCard = recupereBanniereFilms(data.posters[i]);
                moviesContainer.prepend(bannerCard);
                document.createElement("ul");
            }
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des informations :", error);
    }
}


function recupereBanniereFilms (media) {
    const { file_path } = media;

    const bannerCard = document.createElement('article');
    bannerCard.innerHTML = `
    <a class="imgLink" href="https://brocoflix.com/pages/info?id=${idMovie}&type=movie"><img class="movie_img" src="https://image.tmdb.org/t/p/w780/${file_path}"></a>
    <img class="playButton hidden" src="Img/play-button.png">
    `;
    bannerCard.id = "bannerCard";
    bannerCard.addEventListener("mouseover", () => {
        document.querySelector(".playButton").classList.remove("hidden");
    });
    bannerCard.addEventListener("mouseout", () => {
        document.querySelector(".playButton").classList.add("hidden");
    });
    return bannerCard;
}




async function recupereDetails(){

    const response = await fetch(apiUrl3);
    const data = await response.json();

    //console.log(data.belongs_to_collection);

    const movieCard = document.createElement("div");
    movieCard.classList.add("infos");

    movieCard.innerHTML = `
    <article>
    <h1>${data.title || data.name}</h1>
    <h2>Nom original : ${data.original_title}</h2>
    <p>${data.overview}</p>
    <p> Produit par : ${data.production_companies[0].name}</p>
    </article>
    `;

    document.getElementById("movieContainer").appendChild(movieCard);
    if (data.belongs_to_collection) {
        IdCollection = (data.belongs_to_collection.id);
    }
    else{
        document.getElementById("collection.show").hidden = true;
    }
    return movieCard;
}



getImage();

async function getImage() {
    let answer = await fetch(`https://api.themoviedb.org/3/movie/${idMovie}/images?api_key=d2ce126fbc7fe822d2ea9332ea12a63a`);
    const images = await answer.json();
    const similarCard = document.createElement("article");
    similarCard.classList.add("images");
    similarCard.innerHTML = `
    <img id="imageBackground" src="https://image.tmdb.org/t/p/original/${images.backdrops[0].file_path}">`;
    document.getElementById("movies").append(similarCard);
}




async function infoSup() {
    let answer = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR`);
    let data = await answer.json();
    let answer2 = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr-FR`);
    let data2 = await answer2.json();
    const infos = document.createElement('article');
    infos.classList.add('infos');
    const annee = new Date(data.release_date);
    let date = data.release_date;
    date = date.replace(/-/g, "/");
    const genres = data.genres.map(obj => obj.name).join(', ');
    const heures = Math.floor(data.runtime / 60);
    const minutes = data.runtime % 60;
    infos.innerHTML = `
    <h1><span id="bold">${data.title}</span> (${annee.getFullYear()})</h1>
    <h2>${date} · (${data.origin_country}) · ${genres} · ${heures}h ${minutes}m</h2>
    <h3>${data.tagline}</h3>
    <h4><span id='sLigne'>Résumé</span>${data.overview}</h4>
    <h5><span id='sLigne'>${data2.crew[0].name}</span>${data2.crew[0].job}</h5>
    `
    document.querySelector('#infoSup').appendChild(infos);
}

async function getCast(){
    const castNumber = 10;
    const answer = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr-FR`);
    const data = await answer.json();
    for (let i = 0; i < castNumber; i++) {
        const element = data.cast[i];
        const article = document.createElement('article');
        article.innerHTML = `
        <a href="actor.html?id=${element.id}">
        <img src="https://image.tmdb.org/t/p/w780/${element.profile_path}">
        <h1>${element.name}</h1>
        <h2>${element.character}</h2>
        </a>
        `
        article.classList.add(element.id);
        document.querySelector("#cast").appendChild(article);
    }
}


async function recupereSimilar() {
    let apiUrl6 = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1&`;

    const response = await fetch(apiUrl6);
    const data = await response.json();

    //console.log(data.results);

    for (let i = 0; i < NOMBRERECOMMANDATION; i++) {
        const similarCard = document.createElement("article");
        similarCard.classList.add("movie_similar");
        
        similarCard.innerHTML = `
        <h1>${data.results[i].title}</h1>
        <img src="https://image.tmdb.org/t/p/w780/${data.results[i].poster_path}">
        <p>${data.results[i].overview}</p>
        `

        document.getElementById("similarMovies").append(similarCard);
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    sessionStorage.setItem('theme', html.getAttribute('data-theme'));
}

document.querySelectorAll("header img").forEach(element =>{
    element.addEventListener('click', (event =>{
        if (event.target.id == "sun"){
            toggleTheme();
            document.querySelector("#sun").classList.add("hidden");
            document.querySelector("#moon").classList.remove("hidden");
        }
        else {
            toggleTheme();
            document.querySelector("#moon").classList.add("hidden");
            document.querySelector("#sun").classList.remove("hidden");
        }
    }));
});


document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = sessionStorage.getItem('theme') || 'light'; // Définit 'light' comme valeur par défaut si rien n'est trouvé
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme == "light") {
        document.querySelector("#moon").classList.add("hidden");
        document.querySelector("#sun").classList.remove("hidden");
    }
    else {
        document.querySelector("#sun").classList.add("hidden");
        document.querySelector("#moon").classList.remove("hidden");
    }
});

recupereBanniere();
infoSup();
getCast();
