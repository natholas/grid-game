import { Vector } from "./vector.class"
import { Level } from "./level.class"
import { CharacterData } from "./data-classes/character-data"

export class Character {
  public name: string
  public pos: Vector
  public facing: string = 'down'
  public lerpPos: Vector = new Vector()
  private walkingDir: Vector
  public level: Level
  public state: string = 'idle'
  private startedMoveTime: number = new Date().getTime()
  private characterData: CharacterData = new CharacterData()
  private isWalking: boolean = false
  private canWalk: boolean = true
  private walkingInterval: any

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

  public getLerpPos() {
    let moveDiff = this.pos.sub(this.lerpPos)
    let timeSinceStartLerp = new Date().getTime() - this.startedMoveTime
    if (this.characterData.moveTime < timeSinceStartLerp) return this.pos.copy()
    let timeToGo = this.characterData.moveTime - timeSinceStartLerp
    let progress = 1 - (1 / this.characterData.moveTime * timeToGo)
    return this.lerpPos.add(moveDiff.multiply(progress))
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
        this.state = 'idle'
        clearInterval(this.walkingInterval)
      } else this.processMove(this.walkingDir)
    }, this.characterData.moveTime)
  }

  private processMove(vec: Vector) {
    this.lerpPos = this.pos.copy()
    this.startedMoveTime = new Date().getTime()
    let moved = this.MoveInDir(vec)
    this.state = moved ? 'walking' : 'idle'
  }

  private MoveInDir(dir: Vector): boolean {
    let canMove = this.level.tileWalkable(this.pos.add(dir))
    this.facing = this.vecToDir(dir)
    if (canMove) {
      this.pos = this.pos.add(dir)
      this.level.processPos(this)
    }
    return canMove
  }

  private stopWalkLoop() {
    this.isWalking = false
  }

  private dirToVec(dir: string): Vector {
    let vec = new Vector()
    if (dir === 'up') vec.y -= 1
    else if (dir === 'down') vec.y += 1
    if (dir === 'left') vec.x -= 1
    else if (dir === 'right') vec.x += 1
    return vec
  }

  private vecToDir(vec: Vector): string {
    if (vec.x > 0) return 'right'
    if (vec.x < 0) return 'left'
    if (vec.y > 0) return 'down'
    return 'up'
  }
}