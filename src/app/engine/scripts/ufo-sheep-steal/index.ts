import * as PIXI from 'pixi.js'
import { Lane } from '../../objects/lane'
import { UFO } from '../../objects/ufo'
import { clamp, openLink } from '../../../../utils'
import { Point, Rectangle } from 'pixi.js'
import { Sheep } from '../../objects/sheep'

const TEXT_PADDING = 15

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
  private descriptionText: PIXI.Container

  constructor (container: PIXI.Container, interaction: PIXI.InteractionManager, ufo: UFO) {
    this.container = container
    this.interaction = interaction
    this.ufo = ufo
    this.updateFocusedPoint = this.updateFocusedPoint.bind(this)
    interaction.on('pointerdown', this.updateFocusedPoint)
  }

  setBounds (bounds: PIXI.Rectangle) {
    this.bounds = bounds
  }

  private updateFocusedPoint (e: PIXI.InteractionEvent) {
    this.focusedPoint = e.data.global.clone()
    if (this.descriptionText) {
      const textHitArea = new Rectangle(
        this.descriptionText.x,
        this.descriptionText.y,
        this.descriptionText.width,
        this.descriptionText.height
      )
      if (textHitArea.contains(this.focusedPoint.x, this.focusedPoint.y)) {
        openLink(this.targetSheep.link)
        return
      }
      this.container.removeChild(this.descriptionText)
      this.descriptionText = undefined
    }
    if (this.targetSheep) {
      this.targetSheep.startMoving()
      this.targetSheep = undefined
    }
    this.focusedPoint = e.data.global.clone()
    this.ufo.disengageTractorBeam()
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
      this.ufo.engageTractorBeam(this.targetLane.y - this.ufo.y - this.ufo.height + this.targetSheep.height * 0.7)
      if (this.ufo.isHovering()) {
        this.targetSheep.float(this.targetLane.y - targetPoint.y - (this.ufo.height / 2))
        this.descriptionText = createTextContainer(this.targetSheep.description, this.targetSheep.link)
        const rightBoundaryEdge = this.bounds.x + this.bounds.width
        const halfOfBounds = rightBoundaryEdge / 2
        if (this.ufo.x < halfOfBounds - (this.ufo.width / 2)) {
          this.descriptionText.x = Math.min(this.ufo.x + this.ufo.width, rightBoundaryEdge - this.descriptionText.width)
        } else {
          this.descriptionText.x = Math.max(this.ufo.x - this.descriptionText.width, this.bounds.x)
        }
        // Align vertical centres of UFO and text
        this.descriptionText.y = this.ufo.y + this.ufo.height / 2 - this.descriptionText.height / 2
        this.container.addChild(this.descriptionText)
        this.state = STATE.KIDNAP_TARGET
      }
    }
  }

  private kidnapTarget () {
  }
}

function createTextContainer (text, link) {
  const container = new PIXI.Container()
  const description = new PIXI.Text(text, {
    fill: '#000000',
    fontSize: '2rem',
  })
  const details = new PIXI.Text('↗️ View on NanoCrawler', {
    fill: '#333333',
    fontSize: '1.5rem'
  })
  details.y = description.height + TEXT_PADDING
  const background = new PIXI.Sprite(PIXI.Texture.WHITE)
  background.width = Math.max(description.width, details.width) + TEXT_PADDING * 2
  background.height = details.y + details.height + TEXT_PADDING * 2
  background.x = -TEXT_PADDING
  background.y = -TEXT_PADDING
  container.addChild(background, description, details)
  return container
}
