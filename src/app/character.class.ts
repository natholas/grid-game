import { Vector } from "./vector.class"
import { Level } from "./level.class"
import { CharacterData } from "../assets/character-data"

export class Character {
  public name: string
  public pos: Vector
  public invertDir: boolean = false
  public currentMove: string
  public level: Level
  characterData: CharacterData = new CharacterData()
  public state: string = 'idle'
  private intervals: any = {}

  constructor(name: string) {
    this.name = name
  }

  public triggerInput(action: string) {
    if (action.substring(0,4) === 'move') {
      if (this.currentMove) return
      if (this.moveInDir(action.substring(5))) {
        this.currentMove = action
        this.state = 'walking'
        setTimeout(a => {
          this.state = 'idle'
          this.currentMove = null
        }, this.characterData.moveTime)
      }
    } else {
      console.error('Action not supported')
    }
  }

  public triggerInputEndless(action: string) {
    if (this.intervals[action]) this.triggerInputEnd(action)
    this.intervals[action] = setInterval(a => {
      this.triggerInput(action)
    }, 1000 / 30)
  }

  public triggerInputEnd(action: string) {
    clearInterval(this.intervals[action])
  }

  private moveInDir(dir: string): boolean {
    if (dir === 'left') this.invertDir = true
    else if (dir === 'right') this.invertDir = false
    
    let diff = new Vector()
    if (dir === 'up') diff.y -= 1
    else if (dir === 'down') diff.y += 1
    if (dir === 'left') diff.x -= 1
    else if (dir === 'right') diff.x += 1

    if (this.level.tileWalkable(this.pos.add(diff))) {
      this.pos = this.pos.add(diff)
      this.level.processPos(this)
      return true
    }
    return false
  }
}