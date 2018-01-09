export class RenderData {
  public tileSize: number = 16
  public spriteAnimationRate: number = 16
  levelTransitionTime: number = 500
  private notifyWhenLoaded: any[] = []
  private loadCount: number = 0

  private tileNames: string[][] = [
    ['center'],
    ['top-left'],
    ['top'],
    ['top-right'],
    ['right'],
    ['bottom-right'],
    ['bottom'],
    ['bottom-left'],
    ['left'],
    ['top-bottom'],
    ['right-left'],
    ['top-only'],
    ['right-only'],
    ['bottom-only'],
    ['left-only'],
    ['center-only'],
    ['top-left-inv-corner'],
    ['top-right-inv-corner'],
    ['bottom-right-inv-corner'],
    ['bottom-left-inv-corner'],
  ]

  public characterNames: string[][] = [
    ['idle-up'],
    ['idle-right'],
    ['idle-down'],
    ['idle-left'],
    ['walking-up_0', 'walking-up_1'],
    ['walking-right_0', 'walking-right_1'],
    ['walking-down_0', 'walking-down_1'],
    ['walking-left_0', 'walking-left_1'],
  ]

  public tileTypes: string[] = [
    'grass',
    'dirt',
    'bridge'
  ]
  public objectTypes: string[][] = [
    ['stairs'],
    ['hole'],
    ['key_0', 'key_1', 'key_2', 'key_3'],
  ]
  public tileSprites: any = {}
  public objectSprites: any = {}
  public characterSprites: any = {}
  public resolution: any = {
    width: 180
  }

  public loadedAllGraphics: boolean = false

  constructor() {
    this.loadCount = 0
    this.tileTypes.forEach((tileType: string) => {
      for (let tileNames of this.tileNames) {
        let key = tileType + '_' + tileNames[0].split('_')[0]
        this.tileSprites[key] = []
        for (var tileName of tileNames) {
          this.loadCount ++
          let img = new Image()
          img.src = '/assets/sprites/' + tileType + '_' + tileName + '.png'
          img.onload = function() {
            this.loadCount --
            this.tileSprites[key].push(img)
            if (this.loadCount === 0) this.allLoaded()
          }.bind(this)
        }
      }
    })

    this.loadImagesOfType('character', this.characterNames, this.characterSprites)
    this.loadImagesOfType('object', this.objectTypes, this.objectSprites)
  }

  public returnWhenLoaded(fun: Function) {
    if (this.loadedAllGraphics) fun()
    else this.notifyWhenLoaded.push(fun)
  }

  private allLoaded() {
    this.loadedAllGraphics = true
    this.notifyWhenLoaded.forEach((fun: Function) => {
      fun()
    })
  }

  private loadImagesOfType(name: string, input: string[][], output: any) {
    for (let item of input) {
      let key = name + '-' + item[0].split('_')[0]
      output[key] = []
      for (var suffix of item) {
        this.loadCount++
        let img = new Image()
        img.src = '/assets/sprites/' + name + '-' + suffix + '.png'
        img.onload = function () {
          this.loadCount--
          output[key].push(img)
          if (this.loadCount === 0) this.allLoaded()
        }.bind(this)
      }
    }
  }
}