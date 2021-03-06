import { Level } from './level.class'
import { GameData } from './game-data.class'
import { Renderer } from './renderer.class'
import { Character } from './character.class'
import { InputController } from './input-controller.class'
import { Connection } from './connection.class'
import { Vector } from './vector.class'
import { UI } from './ui'

export class Game {
  levels: Level[] = []
  renderer: Renderer
  activeLevel: Level
  character: Character = new Character('Nathan')
  inputController: InputController
  ui: UI
  levelChangeTimeout: any

  constructor(el: HTMLCanvasElement, gameData: GameData, uiCanvas: HTMLCanvasElement) {
    this.renderer = new Renderer(el)
    this.levels = this.createLevels(gameData.levelData)
    this.character.pos = gameData.startingPos
    this.inputController = new InputController(uiCanvas, this.character)
    this.ui = new UI(this, uiCanvas)
    this.changeLevel(gameData.startingLevel)
    this.inputController.startListening()
  }
  
  private changeLevel(index: number) {
    this.activeLevel = this.levels[index]
    this.character.level = this.activeLevel
    this.renderer.stopUpdating()
    this.renderer.startUpdating(this.activeLevel, this.character)
    this.addLevelText()
  }
  
  private addLevelText() {
    if (this.levelChangeTimeout) {
      clearTimeout(this.levelChangeTimeout)
      this.ui.removeText('change-level')
      this.levelChangeTimeout = undefined
    }
    this.ui.createText('change-level', this.activeLevel.title, 'centerTop', 2)
    this.levelChangeTimeout = setTimeout((a: any) => {
      this.ui.removeText('change-level')
    }, 2500)
  }
  
  public processConnection(connection: Connection) {
    this.inputController.pause()
    this.renderer.startLevelTransition((a: any) => {
      this.inputController.resume()
      this.changeLevel(connection.levelIndex)
      connection = this.activeLevel.getConnectionFromId(connection.connectionId)
      this.character.pos = connection.levelPos.copy()
      this.character.lerpPos = connection.levelPos.copy()
      this.character.MoveInDir(this.character.dirToVec(connection.direction))
    })
  }

  private createLevels(levelData: any): Level[] {
    let levels: Level[] = []
    levelData.levels.forEach((data: any) => {
      levels.push(new Level(data, this))
    })
    return levels
  }


}