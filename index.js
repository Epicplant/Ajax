/**
 * Christopher Roy
 * 05/06/2020
 * Section AK: Austin Jenchi
 *
 * Javascript code the html file "index.html." This code deals with adding song cards to
 * index.html's DOM through the last.fm API. These cards contain information on an inputted
 * song alongside a link and a picture of the album/song if possible.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  /**
   * This function ensures that all code runs after the DOM has loaded in order to prevent
   * any issues with referencing elements that haven't been initilized yet.
   */
  function init() {
    id("song-name").addEventListener("click", function() {
      id("song-name").value = "";
    });
    id("fetcher").addEventListener("click", makeRequest);
  }

  /**
   * This function brings up a list of songs from a the last.fm API
   * that matches the name of (or are similar to) a value put into a text box. An error
   * is thrown and caught if there is a problem getting the data.
   */
  function makeRequest() {
    if (id("song-name").value !== "") {
      let btn = document.createElement("button");
      let current = document.querySelector("body").childNodes[0];
      let reset = document.querySelector("body").insertBefore(btn, current);
      reset.textContent = "New Song?";
      reset.id = "reset-btn";
      reset.addEventListener("click", restart);
      fetch("http://ws.audioscrobbler.com/2.0/?method=album.search&album=" +
      id("song-name").value + "&api_key=aab691c84070687ca967fa020700fa25&format=json")
        .then(checkStatus)
        .then(resp => resp.json())
        .then(splitSongs)
        .catch(handleError);
    }
  }

  /**
   * This function takes in an string representing an error and displays that error in the place
   * of a list of songs.
   * @param {Error} error - An error in the form of a string that contain whats what went wrong
   * with the code.
   */
  function handleError(error) {
    id("text-menu").appendChild(document.createElement("p")).textContent =
      "There was an Error: [" + error + "]";
  }

  /**
   * This function switches to the song menu and prints out a specified number of songs(or
   * as many as can possibly be found).
   * @param {JSON} songs - JSON data that contains a list of songs connected to a previously
   * inputted string.
   */
  function splitSongs(songs) {
    id("text-menu").classList.add("hidden");
    id("song-menu").classList.remove("hidden");
    let quantityIndex = document.querySelector("select").selectedIndex;
    let quantity = document.querySelector("select")[quantityIndex].value;
    let songNum = songs.results.albummatches.album.length;
    if (quantity < songNum) {
      for (let i = 0; i < quantity; i++) {
        let card = findSongs(songs);
        id("song-menu").appendChild(card);
      }
    } else {
      for (let i = 0; i < songNum; i++) {
        let card = findSongs(songs);
        id("song-menu").appendChild(card);
      }
    }
  }

  /**
   * This function activates after the New Songs button is pressed. The function takes
   * the user back to the text-menu where they can input data to find new songs.
   */
  function restart() {
    id("song-menu").innerHTML = "";
    id("song-menu").classList.add("hidden");
    id("text-menu").classList.remove("hidden");
    document.querySelector("body").removeEventListener("click", restart);
    document.querySelector("body").removeChild(id("reset-btn"));
  }

  /**
   * This function constructs small cards of songs that contain an image (if it can be found),
   * the songs name, the songs band/artist, and a link to the song on last.fm. All songs
   * found are different and unique.
   * @param {JSON} songs - JSON data containing info from the last.fm API pertaining to
   * a specific keyword previously inputted.
   * @return {Element} card - Returns an article containing information on a song.
   */
  function findSongs(songs) {
    let randNum = Math.floor(Math.random() * (songs.results.albummatches.album.length));
    let songCard = document.createElement("article");
    let imageCard = document.createElement("article");
    songCard.classList.add("songCard");

    let songName = songCard.appendChild(document.createElement("p"));
    songName.textContent = "Song Name: " + songs.results.albummatches.album[randNum].name;

    let artName = songCard.appendChild(document.createElement("p"));
    artName.textContent = "Artist Name: " + songs.results.albummatches.album[randNum].artist;

    let songLink = songCard.appendChild(document.createElement("a"));
    songLink.textContent = "Link to Song";
    songLink.href = songs.results.albummatches.album[randNum].url;

    let songImg = imageCard.appendChild(document.createElement("img"));
    let imageLink = songs.results.albummatches.album[randNum].image[2]["#text"];
    songImg.src = imageLink;
    if (imageLink === "") {
      let picRep = imageCard.appendChild(document.createElement("p"));
      picRep.textContent = "Imagine an amazing picture here";
    }
    imageCard.classList.add("imageCard");
    let card = createCard(randNum, songs);
    if (!card.contains(card.querySelector("p"))) {
      card.appendChild(songCard);
      card.appendChild(imageCard);
    }
    return card;
  }

  /**
   * This functions primary directive is to ensure a card is unique by recursively tracing
   * through JSON data until unique information is found.
   * @param {Integer} randNum - A random index for JSON data (random song)
   * @param {JSON} songs - JSON data containing songs from the last.fm API.
   * @returns {Element} card - Returns a unique card to the function findSongs.
   */
  function createCard(randNum, songs) {
    let uniqueId = songs.results.albummatches.album[randNum].name + "-" +
                   songs.results.albummatches.album[randNum].artist;
    let card = document.createElement("article");

    card.id = uniqueId;
    let cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].id === uniqueId) {
        card = findSongs(songs);
      }
    }

    card.classList.add("card");
    card.id = uniqueId;
    id("song-menu").appendChild(card);
    return card;
  }

  /**
   * This function checks a promises status and depending on whether there is a resolved or
   * rejected state it will accordingly return the response or throw an error.
   * @param {Promise} response - A promise from a fetch which, in thise case, contains
   * data from the last.fm API.
   * @return {Promise} response - Returns the inputted parameter if there was no error
   * @throw {Error} error - A thrown error in string format
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    }
    throw Error("Error in request: " + response.statusText);
  }

  /**
   * This function accepts an id name and gets said elemeny from the html page index.html.
   * @param {String} idName - A name of an elements id in index.html.
   * @return {Element} - Returns an element with a specific ID.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

})();