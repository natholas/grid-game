import { Vector } from "./vector.class"
import { Level } from "./level.class"
import { CharacterData } from "../assets/character-data"

export class Character {
  public name: string
  public pos: Vector
  public invertDir: boolean = false
  public level: Level
  characterData: CharacterData = new CharacterData()
  public state: string = 'idle'
  private intervals: any = {}
  private isWalking: boolean = false
  private canWalk: boolean = true
  private walkingInterval: any
  private walkingDir: Vector

  constructor(name: string) {
    this.name = name
  }

  public triggerInput(action: string) {
    if (action.substring(0,4) === 'move') {
      if (this.isWalking) this.changeWalkingDir(action.substring(5))
      else this.startWalkLoop(action.substring(5))
    } else if (action === 'stop-moving') {
      this.stopWalkLoop()
    } else {
      console.error('Action not supported')
    }
  }

  private MoveInDir(dir: Vector): boolean {
    let canMove = this.level.tileWalkable(this.pos.add(dir))
    if (canMove) {
      this.pos = this.pos.add(dir)
      this.level.processPos(this)
    }
    return canMove
  }

  private changeWalkingDir(dir: string) {
    this.walkingDir = this.dirToVec(dir)
  }

  private startWalkLoop(dir: string) {
    if (this.isWalking || !this.canWalk) return
    this.walkingDir = this.dirToVec(dir)
    this.isWalking = true
    this.canWalk = false
    this.processMove(this.walkingDir)
    this.walkingInterval = setInterval(a => {
      if (!this.isWalking) {
        this.canWalk = true
        clearInterval(this.walkingInterval)
      } else this.processMove(this.walkingDir)
    }, this.characterData.moveTime)
  }

  private processMove(vec: Vector) {
    let moved = this.MoveInDir(vec)
    this.state = moved ? 'walking' : 'idle'
  }

  private stopWalkLoop() {
    this.isWalking = false
    this.state = 'idle'
  }

  private dirToVec(dir: string): Vector {
    let vec = new Vector()
    if (dir === 'up') vec.y -= 1
    else if (dir === 'down') vec.y += 1
    if (dir === 'left') vec.x -= 1
    else if (dir === 'right') vec.x += 1
    return vec
  }
}