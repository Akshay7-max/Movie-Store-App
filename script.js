//Function to search movie based on query

const BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = "dfc97787012377efed03e63a8bc6598a";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

async function searchMovieHandler() {
  //get the query

  let userQuery = document.getElementById("query-input").value;

  if (userQuery) {
    //search movie API
    let response = await fetch(
      `${BASE_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${userQuery}&page=1&include_adult=false`
    );

    parsedResponse = await response.json();

    let movieResponse = [];
    movieResponse = parsedResponse.results;

    let moviesListBox = document.getElementById("movies-list");

    //add the movie to list
    for (let i = 0; i < movieResponse.length; i++) {
      let newListItem = document.createElement("li");

      //create and add poster image
      let movieImageBox = document.createElement("img");
      movieImageBox.setAttribute(
        "src",
        `${IMGPATH}${movieResponse[i].poster_path}`
      );
      movieImageBox.setAttribute("height", "300px");
      movieImageBox.setAttribute("width", "200px");

      newListItem.append(movieImageBox);

      //create title & like button box
      let captionBox = document.createElement("div");

      //create and add movie name
      let movieTitleBox = document.createElement("span");
      movieTitleBox.innerText = movieResponse[i].title;
      //newListItem.append(movieTitleBox);

      //create and add favourite button
      let movieFavButton = document.createElement("button");
      movieFavButton.setAttribute(
        "onclick",
        `addMovieToFavourite(${movieResponse[i].id})`
      );
      movieFavButton.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>';
      //newListItem.append(movieFavButton);

      //add button and span to div
      captionBox.append(movieTitleBox, movieFavButton);
      newListItem.append(captionBox);

      moviesListBox.append(newListItem);
    }

    console.log(">>>>>>>", parsedResponse);
  }
}

function addMovieToFavourite(movieId) {
  let favouriteList = localStorage.getItem("fav-movies");

  if (favouriteList) {
    let moviesIdArray = JSON.parse(favouriteList);

    //Check element is available in array or not for avoid duplication
    if (moviesIdArray.findIndex((val) => val === movieId) === -1) {
      moviesIdArray.unshift(movieId);
    }

    localStorage.setItem("fav-movies", JSON.stringify(moviesIdArray));
  } else {
    let moviesIdArray = [];
    moviesIdArray.push(movieId);
    localStorage.setItem("fav-movies", JSON.stringify(moviesIdArray));
  }
}

function removeMovieFromFavourite(movieId) {
  let favouriteList = localStorage.getItem("fav-movies");

  let moviesIdArray = JSON.parse(favouriteList);

  //Check element is available in array or not for avoid duplication
  let currentMovieIndex = moviesIdArray.findIndex((val) => val === movieId);
  moviesIdArray.splice(currentMovieIndex, 1);

  localStorage.setItem("fav-movies", JSON.stringify(moviesIdArray));

  //reset the list
  resetFavList();
  //call the favourite function again
  addFavouritesMovieToList();
}

async function addFavouritesMovieToList() {
  let favouriteList = localStorage.getItem("fav-movies");
  //If favouriteList is not NULL
  if (favouriteList) {
    let moviesIdArray = JSON.parse(favouriteList);
    let moviesListBox = document.getElementById("fav-movies-list");
    for (let index = 0; index < moviesIdArray.length; index++) {
      const movieId = moviesIdArray[index];
      let movieResponse = await fetch(
        `${BASE_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      movieResponse = await movieResponse.json();

      let newListItem = document.createElement("li");

      //create and add poster image
      let movieImageBox = document.createElement("img");
      movieImageBox.setAttribute(
        "src",
        `${IMGPATH}${movieResponse.poster_path}`
      );
      movieImageBox.setAttribute("height", "300px");
      movieImageBox.setAttribute("width", "200px");

      newListItem.append(movieImageBox);

      //create title & like button box
      let captionBox = document.createElement("div");

      //create and add movie name
      let movieTitleBox = document.createElement("span");
      movieTitleBox.innerText = movieResponse.title;
      newListItem.append(movieTitleBox);

      //create remove favourite button
      let movieFavButton = document.createElement("button");
      movieFavButton.setAttribute(
        "onclick",
        `removeMovieFromFavourite(${movieResponse.id})`
      );
      movieFavButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      // newListItem.append(movieFavButton);

      captionBox.append(movieTitleBox, movieFavButton);
      newListItem.append(captionBox);

      moviesListBox.append(newListItem);
    }
  }
}

function resetFavList() {
  let favMovieBox = document.getElementById("inner-fav-movie-box");
  let favMoviesList = document.getElementById("fav-movies-list");

  favMovieBox.removeChild(favMoviesList);

  let newFavMovieList = document.createElement("ul");
  newFavMovieList.setAttribute("id", "fav-movies-list");
  favMovieBox.append(newFavMovieList);
}
