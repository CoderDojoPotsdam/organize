

const images = [
  "christophsterz/IMG_6690.jpg",
  //"christophsterz/IMG_6691.jpg",
  "christophsterz/IMG_6696.jpg",
  "christophsterz/IMG_6698.jpg",
  "juliakleeberger/loeten_beim_OTS.jpg",
  "KatrinAugustin/Potsdamer Tag der Wissenschaften 1.jpg",
  "KatrinAugustin/Potsdamer Tag der Wissenschaften 3.jpg",
  "niccokunzmann/2015_10_31_2.JPG",
  "niccokunzmann/SDC11757.JPG",
  "niccokunzmann/6.Dezember-2.jpg",
  "niccokunzmann/2015_11_28_Roboter.JPG",
  "niccokunzmann/SDC11785.JPG",
  "clemensschielicke/20140927_164725.jpg",
  "clemensschielicke/20140927_164631.jpg",
  "ChristopherLehnert/CC_SDC12101.jpg",
  "ChristopherLehnert/SDC12104.JPG",
  "ChristopherLehnert/SDC12113.JPG",
  "björnfelsch/image1.jpeg",
  "björnfelsch/image3.jpeg",
];

var imageIndex = -1;


function showImage(imagenName) {
  var image = document.getElementById("photo");
  image.src = "../bilder/" + imagenName;
}

function nextImage() {
  imageIndex = (imageIndex + 1) % images.length;
  showImage(images[imageIndex]);
}

function loadSlideShow()  {
  nextImage();
  setInterval(nextImage, 5000);
}

window.addEventListener("load", loadSlideShow);

