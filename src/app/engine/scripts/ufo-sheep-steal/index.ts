import * as PIXI from 'pixi.js'
import { Lane } from '../../objects/lane'
import { UFO } from '../../objects/ufo'
import { clamp } from '../../../../utils'
import { Point } from 'pixi.js'
import { Sheep } from '../../objects/sheep'

const STATE = {
  FREE_ROAM: 1,
  IDENTIFYING_TARGET: 2,
  MOVING_TO_TARGET: 3,
  KIDNAP_TARGET: 4
}

export class UFOSheepSteal {
  private interaction: PIXI.InteractionManager
  private focusedPoint: PIXI.Point
  private targetLane: Lane
  private targetSheep: Sheep
  private bounds: PIXI.Rectangle
  private ufo: UFO
  private state: number = STATE.FREE_ROAM
  private container: PIXI.Container
  private descriptionText: PIXI.Text

  constructor (container: PIXI.Container, interaction: PIXI.InteractionManager, ufo: UFO) {
    this.container = container
    this.interaction = interaction
    this.ufo = ufo
    this.updateFocusedPoint = this.updateFocusedPoint.bind(this)
    interaction.on('touchstart', this.updateFocusedPoint)
    interaction.on('mousedown',this.updateFocusedPoint)
  }

  setBounds (bounds: PIXI.Rectangle) {
    this.bounds = bounds
  }

  private updateFocusedPoint (e: PIXI.InteractionEvent) {
    this.focusedPoint = e.data.global.clone()
    if (this.targetSheep) {
      this.targetSheep.startMoving()
      this.targetSheep = undefined
    }
    if (this.descriptionText) {
      this.container.removeChild(this.descriptionText)
      this.descriptionText = undefined
    }
    this.focusedPoint = e.data.global.clone()
    this.state = STATE.IDENTIFYING_TARGET
  }

  update (delta: number, lanes: Lane[]) {
    if (this.state === STATE.FREE_ROAM) {
      this.freeRoam()
    } else if (this.state === STATE.IDENTIFYING_TARGET) {
      this.identifyTarget(lanes)
    } else if (this.state === STATE.MOVING_TO_TARGET) {
      this.moveToTarget()
    } else if (this.state === STATE.KIDNAP_TARGET) {
      this.kidnapTarget()
    }
  }

  private freeRoam () {
    const mouseposition = this.interaction.mouse.global
    const targetPoint = mouseposition.x < -9999 ? this.focusedPoint : mouseposition
    if (!targetPoint) return
    const boundedTargetPoint = new Point(
      clamp(targetPoint.x, this.bounds.x, this.bounds.x + this.bounds.width),
      clamp(targetPoint.y, this.bounds.y, this.bounds.y + this.bounds.height)
    )
    this.ufo.moveTowards(boundedTargetPoint)
  }

  private identifyTarget (lanes: Lane[]) {
    let laneWithTargetSheep: Lane
    let targetSheep: Sheep
    for (let i = lanes.length - 1; i >= 0; --i) {
      const lane = lanes[i]
      const sheep = lane.getSheepAtPoint(this.focusedPoint)
      if (sheep) {
        laneWithTargetSheep = lane
        targetSheep = sheep
        break
      }
    }
    if (targetSheep) {
      this.targetSheep = targetSheep
      this.targetLane = laneWithTargetSheep
      this.state = STATE.MOVING_TO_TARGET
    } else {
      this.state = STATE.FREE_ROAM
    }
  }

  private moveToTarget () {
    const targetX = this.targetLane.x + this.targetSheep.x + this.targetSheep.width / 2
    const targetY = this.targetLane.y + this.targetSheep.y
    const targetPoint = new PIXI.Point(
      clamp(targetX, this.bounds.x, this.bounds.x + this.bounds.width),
      clamp(targetY, this.bounds.x, this.bounds.y + this.bounds.height)
    )
    if (this.bounds.x > targetX || (this.bounds.x + this.bounds.width) < targetX) {
      this.state = STATE.FREE_ROAM
      return
    }
    this.ufo.moveTowards(targetPoint)
    const ufoXStart = this.ufo.x
    const ufoXEnd = this.ufo.x + this.ufo.width
    // Stop the target from moving if UFO is nearby
    if (this.targetSheep.x >= ufoXStart && this.targetSheep.x <= ufoXEnd) {
      this.targetSheep.stopMoving()

      if (this.ufo.isHovering()) {
        this.targetSheep.float(
          this.targetLane.y - targetPoint.y - (this.ufo.height / 2)
        )
        this.descriptionText = new PIXI.Text(this.targetSheep.description, {
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 2,
          fontSize: 30
        })
        if (this.ufo.x < (((this.bounds.x + this.bounds.width) / 2) - (this.ufo.width / 2))) {
          this.descriptionText.x = this.ufo.x + this.ufo.width
        } else {
          this.descriptionText.x = this.ufo.x - this.descriptionText.width
        }
        this.descriptionText.y = this.ufo.y + this.ufo.height / 2 - this.descriptionText.height / 2
        this.container.addChild(this.descriptionText)
        this.state = STATE.KIDNAP_TARGET
      }
    }
  }

  private kidnapTarget () {
  }
}
