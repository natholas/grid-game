import { Level } from './level.class'
import { RenderData } from './data-classes/render-data'
import { Tile } from './tile.class'
import { Vector } from './vector.class'
import { Character } from './character.class'
import { LevelObject } from './level-object.class';

export class Renderer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  renderData: RenderData
  public landscape: boolean
  public updating: boolean = false
  public activeCharacter: Character
  public activeLevel: Level
  private frameCount: number = 0
  private animationCount: number = 0
  private transitioningLevel: boolean = false
  private transitionLevelStartTime: number = 0

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
    this.landscape = window.innerHeight < window.innerWidth
    let resolutionScale = (this.landscape ? window.innerHeight : window.innerWidth) / this.renderData.resolution.width
    let small = this.renderData.resolution.width
    let large = !this.landscape ? window.innerHeight : window.innerWidth
    large = Math.floor(large / resolutionScale)
    this.canvas.height = this.landscape ? small : large
    this.canvas.width = this.landscape ? large : small
    this.renderData.resolution.height = large
  }

  public startUpdating(level: Level, character: Character) {
    this.updating = true
    this.activeLevel = level
    this.activeCharacter = character
    if (this.frameCount === 0) this.update()
  }

  public update(): void {
    if (this.renderData.loadedAllGraphics) {
      this.frameCount += 1
      if (this.frameCount % this.renderData.spriteAnimationRate === 0) this.animationCount += 1
      let halfWidth = Math.floor(this.renderData.resolution.width / 2)
      let halfHeight = Math.floor(this.renderData.resolution.height / 2)

      let offsetX = this.landscape ? halfHeight : halfWidth
      let offsetY = this.landscape ? halfWidth : halfHeight
      let offset = new Vector(offsetX, offsetY)

      let size = this.renderData.tileSize
      let viewOffset = this.activeCharacter.getLerpPos().multiply(size).sub(offset)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.activeLevel.tiles.forEach((tilesLayer: Tile[][]) => {
        tilesLayer.forEach((row: Tile[]) => {
          row.forEach((tile: Tile) => this.renderTile(tile, viewOffset, size))
        })
      })

      this.activeLevel.objects.forEach((object: LevelObject) => {
        this.renderObject(object, viewOffset, size)
      })

      this.renderCharacter(viewOffset, size)

      if (this.transitioningLevel) {
        this.addDarkness()
      }
    }

    window.requestAnimationFrame(a => {
      if (this.updating) this.update()
    })
  }

  public startLevelTransition(callback: Function) {
    this.transitioningLevel = true
    this.transitionLevelStartTime = new Date().getTime()
    setTimeout((a: any) => {
      this.transitioningLevel = false
      callback()
    }, this.renderData.levelTransitionTime)
  }

  private addDarkness() {
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    let timeSinceStart = new Date().getTime() - this.transitionLevelStartTime
    let opacity = (1 / this.renderData.levelTransitionTime) * timeSinceStart
    this.ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')'
    this.ctx.fill()
  }

  private renderCharacter(viewOffset: Vector, size: number) {
    this.ctx.beginPath()
    let pos = this.activeCharacter.getLerpPos().multiply(size)
    pos = pos.sub(viewOffset)
    pos = pos.sub(new Vector(this.renderData.tileSize / 2, this.renderData.tileSize / 2))
    let state = this.activeCharacter.state + '-' + this.activeCharacter.facing
    let sprites = this.renderData.characterSprites['character-' + state]
    this.ctx.drawImage(sprites[this.animationCount % sprites.length], pos.x, pos.y)
  }

  private renderObject(object: LevelObject, viewOffset: Vector, size: number) {
    this.ctx.beginPath()
    let pos = object.pos.copy().multiply(size)
    pos = pos.sub(viewOffset)
    pos = pos.sub(new Vector(this.renderData.tileSize / 2, this.renderData.tileSize / 2))
    if (!this.inView(pos)) return
    let sprites = this.renderData.objectSprites['object-' + object.type]
    this.ctx.drawImage(sprites[this.animationCount % sprites.length], pos.x, pos.y)
  }

  private renderTile(tile: Tile, viewOffset: Vector, size: number) {
    if (!tile.type) return
    let pos = tile.pos.copy().multiply(size)
    pos = pos.sub(viewOffset)
    pos = pos.sub(new Vector(this.renderData.tileSize / 2, this.renderData.tileSize / 2))
    if (!this.inView(pos)) return
    let sprite = this.renderData.tileSprites[tile.type + '_' + tile.cornerType][0]
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