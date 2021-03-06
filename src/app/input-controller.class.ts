import { Character } from "./character.class";
import { Vector } from "./vector.class";

export class InputController {
  character: Character
  touchPos: Vector
  canvas: HTMLCanvasElement
  moveDir: string
  paused: boolean = false

  constructor(uiCanvas: HTMLCanvasElement, character: Character) {
    this.character = character
    this.canvas = uiCanvas
  }

  public startListening() {
    this.canvas.addEventListener('touchstart', this.touchstart.bind(this))
    this.canvas.addEventListener('touchend', this.touchend.bind(this))
    this.canvas.addEventListener('touchmove', this.touchmove.bind(this))
    window.addEventListener('blur', a => {
      this.stopMoving()
    })
  }

  public stopListening() {
    this.canvas.removeEventListener('touchstart', this.touchstart.bind(this))
    this.canvas.removeEventListener('touchend', this.touchend.bind(this))
    this.canvas.removeEventListener('touchmove', this.touchmove.bind(this))
    this.character.triggerInput('stop-moving')
  }

  public pause() {
    this.paused = true
    this.character.triggerInput('stop-moving')
  }

  public resume() {
    this.paused = false
    this.moveDir = undefined
    this.screenMove()
  }

  private touchstart(e: TouchEvent) {
    let touch = e.touches[e.touches.length - 1]
    this.touchPos = new Vector(touch.clientX, touch.clientY)
    this.screenMove()
  }

  private mousedown(e: MouseEvent) {
    this.touchPos = new Vector(e.clientX, e.clientY)
    this.screenMove()
  }
  
  private touchend(e: TouchEvent) {
    if (e.touches.length === 0) this.stopMoving()
  }

  private mouseup(e: MouseEvent) {
    this.stopMoving()
  }

  private touchmove(e: TouchEvent) {
    let touch = e.touches[e.touches.length - 1]
    this.touchPos = new Vector(touch.clientX, touch.clientY)
    this.screenMove()
  }
  
  private mousemove(e: MouseEvent) {
    if (!this.touchPos) return
    this.touchPos = new Vector(e.clientX, e.clientY)
    this.screenMove()
  }

  private stopMoving() {
    this.touchPos = undefined
    this.moveDir = undefined
    this.character.triggerInput('stop-moving')
  }

  private screenMove() {
    if (!this.touchPos || this.paused) return
    let dir = this.getTouchDir()
    if (this.moveDir !== dir) {
      this.character.triggerInput('move-' + dir)
      this.moveDir = dir
    }
  }

  private getTouchDir(): string {
    let x = (window.innerWidth / 2) - this.touchPos.x
    let y = (window.innerHeight / 2) - this.touchPos.y
    if (Math.abs(x) > Math.abs(y)) {
      return x < 0 ? 'right' : 'left'
    } else {
      return y < 0 ? 'down' : 'up'
    }
  }
}