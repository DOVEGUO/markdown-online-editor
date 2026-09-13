import html2canvas from 'html2canvas'
import { Canvg } from 'canvg'
import { generateScreenshot } from '@/helper/export'

jest.mock('html2canvas', () => jest.fn())
jest.mock('canvg', () => ({
  Canvg: {
    fromString: jest.fn(),
  },
}))

describe('image export', () => {
  const context = {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    clip: jest.fn(),
    drawImage: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.XMLSerializer = class XMLSerializer {
      serializeToString() {
        return '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
      }
    }
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 1,
    })
    HTMLCanvasElement.prototype.getContext = jest.fn(() => context)
  })

  it('restores the original SVG after screenshot generation', async () => {
    const target = document.createElement('div')
    target.style.width = '320px'
    target.style.height = '200px'
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '24')
    svg.setAttribute('height', '24')
    svg.getBoundingClientRect = jest.fn(() => ({ width: 24, height: 24 }))
    target.appendChild(svg)
    document.body.appendChild(target)

    const renderer = { render: jest.fn(() => Promise.resolve()) }
    Canvg.fromString.mockReturnValue(renderer)
    const captured = document.createElement('canvas')
    captured.width = 320
    captured.height = 200
    html2canvas.mockResolvedValue(captured)

    await generateScreenshot(target)

    expect(Canvg.fromString).toHaveBeenCalledTimes(1)
    expect(renderer.render).toHaveBeenCalledTimes(1)
    expect(target.querySelector('svg')).toBe(svg)
    expect(target.querySelector('canvas')).toBeNull()

    document.body.removeChild(target)
  })
})
