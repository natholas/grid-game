import { Level } from './level.class'
import { RenderData } from '../assets/render-data'
import { Tile } from './tile.class'
import { Vector } from './vector.class'
import { Character } from './character.class'
import { LevelObject } from './level-object.class';

export class Renderer {

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  renderData: RenderData
  public updating: boolean = false
  public activeCharacter: Character
  public activeLevel: Level

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.renderData = new RenderData()

    this.setCanvasDimentions()
    window.addEventListener('resize', a => {
      this.setCanvasDimentions()
    })
  }

  private setCanvasDimentions() {
    let landscape = window.innerHeight < window.innerWidth
    let resolutionScale = (landscape ? window.innerHeight : window.innerWidth) / this.renderData.resolution.width
    let small = this.renderData.resolution.width
    let large = !landscape ? window.innerHeight : window.innerWidth
    large = Math.floor(large / resolutionScale)
    this.canvas.height = landscape ? small : large
    this.canvas.width = landscape ? large : small
    this.renderData.resolution.height = small
  }

  public startUpdating(level: Level, character: Character) {
    this.updating = true
    this.activeLevel = level
    this.activeCharacter = character
    this.update()
  }

  public update(): void {
    if (this.renderData.loadedAllGraphics) {
      let offsetX = Math.floor(this.renderData.resolution.width / 2)
      let offsetY = Math.floor(this.renderData.resolution.height / 2)
      let offset = new Vector(offsetX, offsetY)
      let size = this.renderData.tileSize
      let viewOffset = this.activeCharacter.pos.copy().multiply(size).sub(offset)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.activeLevel.tiles.forEach((tilesLayer: Tile[][]) => {
        tilesLayer.forEach((row: Tile[]) => {
          row.forEach((tile: Tile) => this.renderTile(tile, viewOffset, size))
        })
      })

      this.activeLevel.objects.forEach((object: LevelObject) => {
        this.renderObject(object, viewOffset, size)
      })

      this.ctx.beginPath()
      let pos = this.activeCharacter.pos.copy().multiply(size)
      pos = pos.sub(viewOffset)
      pos = pos.sub(new Vector(this.renderData.tileSize / 2, this.renderData.tileSize / 2))
      let state = this.activeCharacter.state
      if (this.activeCharacter.invertDir) state += '-inverted'
      this.ctx.drawImage(this.renderData.characterSprites['character-' + state], pos.x, pos.y)
    }

    window.requestAnimationFrame(a => {
      if (this.updating) this.update()
    })
  }

  private renderObject(object: LevelObject, viewOffset: Vector, size: number) {
    let pos = object.pos.copy().multiply(size)
    pos = pos.sub(viewOffset)
    pos = pos.sub(new Vector(this.renderData.tileSize / 2, this.renderData.tileSize / 2))
    if (!this.inView(pos)) return
    let sprite = this.renderData.objectSprites[object.type]
    if (!sprite) return false
    this.ctx.beginPath()
    this.ctx.drawImage(sprite, pos.x, pos.y)
  }

  private renderTile(tile: Tile, viewOffset: Vector, size: number) {
    if (!tile.type) return
    let pos = tile.pos.copy().multiply(size)
    pos = pos.sub(viewOffset)
    pos = pos.sub(new Vector(this.renderData.tileSize / 2, this.renderData.tileSize / 2))
    if (!this.inView(pos)) return
    let sprite = this.renderData.tileSprites[tile.type + '_' + tile.cornerType]
    if (!sprite) return false
    this.ctx.beginPath()
    this.ctx.drawImage(sprite, pos.x, pos.y)
  }

  public stopUpdating() {
    this.updating = false
  }

  private inView(pos: Vector) {
    if (pos.x < -this.renderData.tileSize) return false
    if (pos.x > this.canvas.width) return false
    if (pos.y < -this.renderData.tileSize) return false
    if (pos.y > this.canvas.height) return false
    return true
  }
}