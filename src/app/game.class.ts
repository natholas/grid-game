import { Level } from './level.class'
import { GameData } from './game-data.class'
import { Renderer } from './renderer.class'
import { Character } from './character.class'
import { InputController } from './input-controller.class'
import { Connection } from './connection.class';
import { Vector } from './vector.class';

export class Game {
  levels: Level[] = []
  renderer: Renderer
  activeLevel: Level
  character: Character = new Character('Test')
  inputController: InputController

  constructor(el: HTMLCanvasElement, gameData: GameData, uiCanvas: HTMLCanvasElement) {
    this.renderer = new Renderer(el)
    this.levels = this.createLevels(gameData.levelData)
    this.character.pos = gameData.startingPos
    this.changeLevel(gameData.startingLevel)
    this.inputController = new InputController(uiCanvas, this.character)
    this.inputController.startListening()
  }
  
  changeLevel(index: number) {
    this.activeLevel = this.levels[index]
    this.character.level = this.activeLevel
    this.renderer.stopUpdating()
    this.renderer.startUpdating(this.activeLevel, this.character)
    console.log('moved to', this.activeLevel.title)
  }

  processConnection(connection: Connection) {
    this.changeLevel(connection.levelIndex)
    connection = this.activeLevel.getConnectionFromId(connection.connectionId)
    this.character.pos = connection.levelPos.copy()
    this.character.MoveInDir(this.character.dirToVec(connection.direction))
  }

  createLevels(levelData: any): Level[] {
    let levels: Level[] = []

    levelData.levels.forEach((data: any) => {
      levels.push(new Level(data, this))
    })

    return levels
  }


}