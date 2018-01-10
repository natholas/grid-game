import { Vector } from "./vector.class"
import { Level } from "./level.class"
import { CharacterData } from "./data-classes/character-data"
import { LevelObject } from "./level-object.class";

export class Character {
  public name: string
  public pos: Vector
  public facing: string = 'down'
  public lerpPos: Vector = new Vector()
  public inventory: LevelObject[] = []
  public level: Level
  public state: string = 'idle'
  private walkingDir: Vector
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

  public pickUpObjects(objects: LevelObject[]) {
    this.inventory = this.inventory.concat(objects)
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

  public MoveInDir(dir: Vector): boolean {
    let canMove = this.level.tileWalkable(this.pos.add(dir))
    let objects = this.level.getObjectsFromPos(this.pos.add(dir))
    let meetsNeeds = this.hasWhatObjectsNeeds(objects)
    this.facing = this.vecToDir(dir)
    if (canMove && meetsNeeds) {
      this.pos = this.pos.add(dir)
      this.level.processPos(this)
    }
    return canMove
  }

  private hasWhatObjectsNeeds(objs: LevelObject[]): boolean {
    for (let obj of objs) {
      if (!this.hasWhatObjectNeeds(obj)) return false
    }
    return true
  }

  public hasWhatObjectNeeds(obj: LevelObject): boolean {
    for (let need of obj.needs) {
      if (!this.getInventoryItemFromId(need)) return false
    }
    return true
  }

  private getInventoryItemFromId(id: number) {
    for (let obj of this.inventory) {
      if (obj.id === id) return obj
    }
  }

  private stopWalkLoop() {
    this.isWalking = false
  }

  public dirToVec(dir: string): Vector {
    if (dir === 'up') return new Vector(0,-1)
    if (dir === 'down') return new Vector(0,1)
    if (dir === 'left') return new Vector(-1,0)
    return new Vector(1,0)
  }

  private vecToDir(vec: Vector): string {
    if (vec.x > 0) return 'right'
    if (vec.x < 0) return 'left'
    if (vec.y > 0) return 'down'
    return 'up'
  }
}