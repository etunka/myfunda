import "normalize.css";
import "tiny-slider/dist/tiny-slider.css";
import "./scss/main.scss";

import { tns } from "tiny-slider/src/tiny-slider";
import {
  c,
  setContentById,
  append,
  getFirstInteger,
  thousandSeparator
} from "./helpers/html";
import { fetchHouseData } from "./api";

const mapKey = "AIzaSyCoASPQO8eUcpODhfDCIwCaz6Ctmg4kEhM";

function renderHousePage(data) {
  const {
    Adres,
    Postcode,
    Plaats,
    Prijs,
    Bouwjaar,
    VolledigeOmschrijving,
    KenmerkenKort,
    PerceelOppervlakte,
    Media
  } = data;

  // for using with map
  const fullAddress = `${Adres} ${Postcode} ${Plaats}`;

  setContentById("title", `House for sale: ${Adres} ${Plaats}`);
  setContentById("address", Adres);

  setContentById("city", `${Postcode} ${Plaats}`);

  setContentById(
    "price",
    `€ ${thousandSeparator(Prijs.Koopprijs)} ${Prijs.KoopAbbreviation}`
  );

  // desktop & mobile separate
  setContentById("year", `${Bouwjaar}`);
  setContentById("year--m", `${Bouwjaar}`);

  // I filter house features for highlights
  // Living area
  const area = KenmerkenKort.Kenmerken.find(
    feature => feature.Naam === "Woonoppervlakte"
  );
  setContentById("area", getFirstInteger(area.Waarde));
  // mobile
  setContentById("area--m", getFirstInteger(area.Waarde));

  // Number of rooms
  const rooms = KenmerkenKort.Kenmerken.find(
    feature => feature.Naam === "Aantal kamers"
  );
  setContentById("rooms", getFirstInteger(rooms.Waarde));
  setContentById("rooms--m", getFirstInteger(rooms.Waarde));

  // Plot size
  setContentById("plot", PerceelOppervlakte);
  setContentById("plot--m", PerceelOppervlakte);

  // Full description
  setContentById("full-description", VolledigeOmschrijving);

  // Slider
  const sliderContainer = document.getElementById("slider-container");

  // First I filter the media that are images (ContentType: 1)
  // Then I fetch the big images(Category: 7) for the gallery
  // We have an array of images
  const sliderImages = Media.filter(media => media.ContentType === 1).map(
    img => {
      return img.MediaItems.find(imgSize => imgSize.Category === 7);
    }
  );

  // I loop through the images and create an img tag for each image
  for (let i = 0; i < sliderImages.length; i++) {
    const galleryImg = c("img");
    // I replaced http with https to have secure urls
    galleryImg.src = sliderImages[i].Url.replace("http://", "https://");
    append(sliderContainer, galleryImg);
  }

  // I used tiny-slider for a simple slider implementation
  const slider = tns({
    container: sliderContainer,
    controlsContainer: document.getElementById("slider-control"),
    nav: false
  });

  // Google map embed
  append(
    document.getElementById("map-embed"),
    createGoogleMapEmbed(fullAddress, mapKey)
  );
}

/**
 * Creates iframe for google map with address and key
 * @param {string} address
 * @param {string} key
 */
function createGoogleMapEmbed(address, key) {
  const map = c("iframe");
  // address encoded to use in embed url
  const encodedAddress = encodeURI(address);
  const src = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&key=${key}`;
  // props from google maps embed html
  map.src = src;
  map.width = "300";
  map.height = "250";
  map.frameborder = "0";
  map.style = "border:0";
  map.allowfullscreen;
  return map;
}

fetchHouseData()
  .then(r => r.json())
  .then(response => {
    renderHousePage(response);
  })
  .catch(e => {
    console.log("Couldn't fetch the house data");
  });
