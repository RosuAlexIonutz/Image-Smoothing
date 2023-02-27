let startTime, endTime;
function convolution(pixels, width, height, mask, maskSize) {
  startTime = performance.now();
  const output = new Float32Array(pixels.length);
  const side = Math.floor(maskSize / 2);
  const alpha = 1 / (maskSize * maskSize);

  // Loop through each pixel in the image
  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
          let r = 0, g = 0, b = 0;
          // Loop through the mask window surrounding the current pixel
          for (let dy = -side; dy <= side; dy++) {
              for (let dx = -side; dx <= side; dx++) {
                  const x2 = x + dx;
                  const y2 = y + dy;
                   // Check if the pixel in the window is valid (inside the image)
                  if (x2 >= 0 && x2 < width && y2 >= 0 && y2 < height) {
                      const i = (y2 * width + x2) * 4;
                      // Add the R, G, B values of the valid pixel to the corresponding sums
                      r += pixels[i] * mask[(dy + side) * maskSize + (dx + side)];
                      g += pixels[i + 1] * mask[(dy + side) * maskSize + (dx + side)];
                      b += pixels[i + 2] * mask[(dy + side) * maskSize + (dx + side)];
                  }
              }
          }
          const i = (y * width + x) * 4;
          // Calculate the average R, G, B values for the current pixel
          output[i] = r * alpha;
          output[i + 1] = g * alpha;
          output[i + 2] = b * alpha;
          // Keep the original value of the A channel
          output[i + 3] = pixels[i + 3];
      }
    }
    endTime = performance.now();
    var results = document.createElement('p');
    results.innerHTML = 'Applying Smoothing Effect = ' + (endTime - startTime).toFixed(0) + ' ms.';
    document.body.appendChild(results);
  return output;
  
}

async function afisareSiPrelucareImagine() {
  startTime = performance.now();
  // Get image data from API
  const response = await fetch('https://dog.ceo/api/breeds/image/random');
  const json = await response.json();
  const imageUrl = json.message;

  // Convert JSON object to string
  const jsonString = JSON.stringify(json);

  // Create a div element
  const div = document.createElement('div');

  // Insert the JSON string into the div's innerHTML
  div.innerHTML = jsonString;

  // Add the div to the body
  document.body.appendChild(div);

  endTime = performance.now();
  var results = document.createElement('p');
  results.innerHTML = 'Getting image from JSON = ' + (endTime - startTime).toFixed(0) + ' ms.';
  document.body.appendChild(results);

  startTime = performance.now();

  // Create image element and set source
  const image = new Image();
  image.src = imageUrl;
  image.crossOrigin = "anonymous";

  // Add the image to the body
  document.body.appendChild(image);

  // Wait for image to load
  await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
  });

  // Create canvas and context
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions to match image
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw image on canvas
  ctx.drawImage(image, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  endTime = performance.now();
  var results = document.createElement('p');
  results.innerHTML = 'Insert the image in canvas = ' + (endTime - startTime).toFixed(0) + ' ms.';
  document.body.appendChild(results);
 
  // Apply convolution filter
  const mask = [1, 1, 1, 1, 1, 1, 1, 1, 1]; // example of convolution mask
  const output = convolution(pixels, image.width, image.height, mask, 3);
  const outputImageData = new ImageData(new Uint8ClampedArray(output), image.width, image.height);

  // Put the image data back on canvas
  ctx.putImageData(outputImageData, 0, 0);

  // Append canvas to body
  document.body.appendChild(canvas);

  // Mirror image by swapping pixels
  startTime = performance.now();
  for (let x = 0; x < canvas.width / 2; x++) {
      for (let y = 0; y < canvas.height; y++) {
          const leftPixelIndex = (x + y * canvas.width) * 4;
          const rightPixelIndex = (canvas.width - x - 1 + y * canvas.width) * 4;
          for (let i = 0; i < 4; i++) {
              const leftPixelValue = outputImageData.data[leftPixelIndex + i];
              outputImageData.data[leftPixelIndex + i] = outputImageData.data[rightPixelIndex + i];
              outputImageData.data[rightPixelIndex + i] = leftPixelValue;
          }
      }
  }
  endTime = performance.now();
      var results = document.createElement('p');
      results.innerHTML = 'Mirroring image process = ' + (endTime - startTime).toFixed(0) + ' ms.';
      document.body.appendChild(results);
  ctx.putImageData(outputImageData, 0, 0);

 document.body.appendChild(canvas);
}

// Create a button
const button = document.createElement('button');

// Set button text
button.textContent = 'Aplicarea efectului de smoothing';

// Add click event listener to button
button.addEventListener('click', afisareSiPrelucareImagine);

button.style.position = "absolute";
button.style.left = "50%";
button.style.top = "10%";
button.style.transform = "translate(-50%, -50%)";
button.style.fontSize = "30px";

// Add the button to the body
document.body.appendChild(button);

setTimeout(afisareSiPrelucareImagine, 3000)
