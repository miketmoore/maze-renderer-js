import { ICarveableGrid } from './carveable-grid'
import { ICell } from './cell'

export interface IRenderer {
  readonly render: (grid: ICarveableGrid) => void
}

interface RendererOptions {
  readonly wallWidth: number
  readonly size: number
}

class Renderer implements IRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private options: RendererOptions
  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    options: RendererOptions
  ) {
    this.canvas = canvas
    this.ctx = ctx
    this.options = options
  }
  public render(grid: ICarveableGrid) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    let x = 0
    let y = 0
    grid.forEachRow((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // drawRect(
        //   this.ctx,
        //   x,
        //   y,
        //   this.options.size,
        //   cell.isStart()
        //     ? 'blue'
        //     : cell.isPopped()
        //     ? 'orange'
        //     : cell.isVisited()
        //     ? 'yellow'
        //     : '#999'
        // )
        drawCell(
          this.ctx,
          this.options.wallWidth,
          x,
          y,
          this.options.size,
          cell
        )
        // ctx.font = '12px sans-serif'
        // ctx.fillText(`${rowIndex},${colIndex}`, x + 5, y + 15)
        x += this.options.size
      })
      x = 0
      y += this.options.size
    })
  }
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  wallWidth: number,
  x: number,
  y: number,
  size: number,
  cell: ICell
) {
  const walls = cell.getWalls()

  ctx.fillStyle = '#000'
  if (walls.north.state === 'solid') {
    ctx.fillRect(x, y, size, wallWidth)
  }
  if (walls.east.state === 'solid') {
    ctx.fillRect(x + size - wallWidth, y, wallWidth, size)
  }
  if (walls.south.state === 'solid') {
    ctx.fillRect(x, y + size - wallWidth, size, wallWidth)
  }
  if (walls.west.state === 'solid') {
    ctx.fillRect(x, y, wallWidth, size)
  }
}

export const rendererFactory: (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: RendererOptions
) => IRenderer = (canvas, ctx, options) => new Renderer(canvas, ctx, options)