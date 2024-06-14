let imageRoutes = Object.values(images);
let allImagesLoaded = false;

loadImages(0);

function loadImages(index) {
  if (index >= imageRoutes.length) {
    if (!allImagesLoaded) {
      allImagesLoaded = true;
      startGame();
    }
    return;
  }

  const img = new Image();
  img.src = imageRoutes[index];
  img.onload = function () {
    cache[imageRoutes[index]] = img;
    loadImages(index + 1);
  };
  img.onerror = function () {
    console.error(`Error loading image: ${imageRoutes[index]}`);
    loadImages(index + 1);
  };
}