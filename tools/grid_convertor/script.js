const el = document.getElementById('upload')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const data = {}

function convertImage() {
  const file = el.files[0]
  var reader = new FileReader()
  reader.onload = function (e) {
    var image = new Image()
    image.onload = function () {
      ctx.drawImage(image, 0, 0)
      readCanvasData(image.width, image.height)
    }
    image.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function readCanvasData(width, height) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = [[]]

  for (let i = 0; i < imageData.data.length; i += 4) {

    if (i && i / 4 % width == 0) {
      pixels.push([])
    }

    pixels[pixels.length - 1].push([
      imageData.data[i],
      imageData.data[i + 1],
      imageData.data[i + 2],
      imageData.data[i + 3]
    ])
  }

  const colors = findColors(pixels)
  createColorLabels(colors)
  data.pixels = pixels
  data.colors = colors
}

function createColorLabels(colors) {
  let colorLabelContainer = document.getElementById('color-labels')

  for (let i in colors) {
    let colorLabel = document.createElement('div')
    let colorInput = document.createElement('input')
    colorLabel.appendChild(colorInput)
    colorInput.style.backgroundColor = 'rgba(' + colors[i] + ')'
    colorLabelContainer.appendChild(colorLabel)
  }
}

function findColors(pixels) {
  let colors = []
  for (let i in pixels) {
    for (let j in pixels[i]) {
      let color = pixels[i][j].join(',')
      if (colors.indexOf(color) < 0) {
        colors.push(color)
      }
    }
  }
  return colors
}

function downloadJSON() {
  let colorInputs = document.getElementById('color-labels').querySelectorAll('input')
  let colors = {}
  
  for (let i in colorInputs) {
    if (!colorInputs[i].style) continue
    colors[colorInputs[i].style.backgroundColor] = colorInputs[i].value
  }

  var obj = {tiles: []}

  for (let i in data.pixels) {
    let row = []
    for (let j in data.pixels[i]) {
      let color = 'rgb(' + data.pixels[i][j].splice(0,3).join(', ') + ')'
      row.push(colors[color])
    }
    obj.tiles.push(row)
  }

  let link = document.createElement('a')
  link.download = 'level-data.json';
  link.href = 'data:application/octet-stream;charset=utf-16le;base64,' + btoa(JSON.stringify(obj.tiles));
  link.click()
}