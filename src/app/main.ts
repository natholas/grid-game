import { Game } from './game.class'
import { GameData } from './game-data.class'
import { LevelData } from './data-classes/level-data'

import { UI } from './ui'

const gameData = new GameData()
const gameCanvas = <HTMLCanvasElement>document.getElementById("game")
const uiCanvas = <HTMLCanvasElement>document.getElementById("ui")

const game = new Game(gameCanvas, gameData, uiCanvas)

const ui = new UI(game, uiCanvas)