import { Character } from "./character.class";
import { ControlData } from "../assets/control-data";
import { Vector } from "./vector.class";

export class InputController {

  character: Character
  listener: any
  controlData: ControlData = new ControlData()
  touchPos: Vector
  canvas: HTMLCanvasElement

  constructor(uiCanvas: HTMLCanvasElement, character: Character) {
    this.character = character
    this.canvas = uiCanvas
  }

  public startListening() {
    this.canvas.addEventListener('mousedown', this.mousedown.bind(this))
    this.canvas.addEventListener('mouseup', this.mouseup.bind(this))
    this.canvas.addEventListener('touchstart', this.touchstart.bind(this))
    this.canvas.addEventListener('touchend', this.touchend.bind(this))

    window.addEventListener('blur', a => {
      this.touchPos = undefined
    })
  }

  private touchstart(e) {
    let touch = e.touches[0]
    this.touchPos = new Vector(touch.clientX, touch.clientY)
  }
  
  private touchend(e) {
    this.touchPos = undefined
  }
  
  private mousedown(e) {
    this.touchPos = new Vector(e.clientX, e.clientY)
  }

  private mouseup(e) {
    this.touchPos = undefined
  }

  public stopListening() {
    clearInterval(this.listener)
  }
}