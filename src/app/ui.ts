import { Game } from "./game.class"
import { UIData } from "./data-classes/ui.data";
import { Vector } from "./vector.class";

export class UI {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  uiData: UIData = new UIData()
  printedData: any = {}
  game: Game

  constructor(game: Game, el: HTMLCanvasElement) {
    this.game = game
    this.canvas = el
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.setCanvasDimensions()
    window.addEventListener('resize', a => {
      this.setCanvasDimensions()
    })
  }

  private setCanvasDimensions() {
    let landscape = window.innerHeight < window.innerWidth
    let resolutionScale = (landscape ? window.innerHeight : window.innerWidth) / this.uiData.resolution.width
    let small = this.uiData.resolution.width
    let large = !landscape ? window.innerHeight : window.innerWidth
    large = Math.floor(large / resolutionScale)
    this.canvas.height = landscape ? small : large
    this.canvas.width = landscape ? large : small
    this.uiData.resolution.height = small
    this.createText('loading', 'Loading...', 'center', 4)
    this.game.renderer.renderData.returnWhenLoaded((a: any) => {
      this.removeText('loading')
    })
  }

  public createText(id: string, string: string, presetString: string, scale: number) {
    let preset = this.uiData.textPositions[presetString]
    let pos = this.presetPos(preset)
    pos = new Vector(Math.floor(pos.x), Math.floor(pos.y))
    this.printedData[id] = {
      string: string, pos: pos, align: preset.alignX, scale: scale
    }
    this.render(string, pos, preset.alignX, scale)
  }

  public removeText(id: string, delay: number = 0) {
    if (!delay) {
      delete this.printedData[id]
      this.renderAll()
    } else {
      setTimeout((a:any) => {
        delete this.printedData[id]
        this.renderAll()
      }, delay)
    }
  }

  private renderAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i in this.printedData) {
      let item = this.printedData[i]
      this.render(item.string, item.pos, item.align, item.scale)
    }
  }

  private render(string: string, pos: Vector, align: string, scale: number) {
    string = string.toUpperCase()
    this.ctx.fillStyle = 'white'
    let output = []
    let words = string.split(' ')
    this.ctx.beginPath()
    let lines: string[][] = [[]]

    let lineLength = 0
    for (let word of words) {
      lineLength += this.wordLength(word) * scale
      if (lineLength >= this.canvas.width) {
        lines.push([])
        lineLength = 0
      }
      lines[lines.length - 1].push(word)
    }

    for (let line of lines) {
      let _line = line.join(' ')
      this.drawWord(_line, pos, align, scale)
      pos = pos.add(new Vector(0, (5 + this.uiData.lineSpacing) * scale))
    }
    this.ctx.fillStyle = 'white'
    this.ctx.fill()
  }

  private wordLength(word: string): number {
    let total = 0
    for (let letter of word) {
      let _letter = this.uiData.font[letter]
      if (!_letter) continue
      total += this.longgestArrayLength(_letter)
      total += 1
    }
    return total + 2
  }

  private drawWord(string: string, pos: Vector, align: string, scale: number) {
    let output = []
    let array = string.split('')
    let totalLength = 0

    for (let item of array) {
      let letter = this.uiData.font[item]
      if (!letter) continue
      totalLength += (this.longgestArrayLength(letter) + 1) * scale
      output.push(letter)
    }

    totalLength -= (1 * scale)

    if (align === 'right') pos = pos.add(new Vector(- totalLength))
    if (align === 'center') pos = pos.add(new Vector(- Math.floor(totalLength / 2)))

    for (let letter of output) {
      this.drawLetter(letter, pos, scale)
      pos = pos.add(new Vector((this.longgestArrayLength(letter) + 1) * scale))
    }
  }

  private drawLetter(letter: boolean[][], pos: Vector, scale: number) {
    for (let i = 0; i < letter.length; i++) {
      for (let j = 0; j < letter[i].length; j++) {
        let pixel = letter[i][j]
        if (!pixel) continue
        let _pos = pos.add(new Vector(j * scale, i * scale))
        this.ctx.rect(_pos.x, _pos.y, scale, scale)
      }
    }
  }

  private longgestArrayLength(array: any[]): number {
    let longest
    for (let item of array) {
      if (!longest || item.length > longest.length) {
        longest = item
      }
    }
    return longest.length
  }

  private presetPos(preset: any): Vector {
    let vec = new Vector()
    let width = this.canvas.width
    let height = this.canvas.height

    if (preset.alignX === 'center') vec.x = width / 2
    if (preset.alignY === 'center') vec.y = height / 2
    if (preset.alignX === 'right') vec.x = width
    if (preset.alignY === 'bottom') vec.y = height
    vec.x += preset.offsetPixelsX
    vec.y += preset.offsetPixelsY
    if (preset.offsetPercentX) vec.x += (width / 100) * preset.offsetPercentX
    if (preset.offsetPercentY) vec.y += (height / 100) * preset.offsetPercentY
    
    return vec
  }
} 