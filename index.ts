const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const strokeFactor : number = 90
const rFactor : number = 5
const foreColor : string = "#673AB7"
const backColor : string = "#BDBDBD"
const delay : number = 30

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        document.body.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static sinify(scale : number) : number {
        return Math.sin(Math.PI * scale)
    }

    static cosify(scale : number) : number {
        return 1 - Math.cos((Math.PI / 2) * scale)
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawRodCaptureBall(context : CanvasRenderingContext2D, scale : number) {
        const sf : number = ScaleUtil.sinify(scale)
        const y : number = (h / 2 - h / 10)
        const startY : number = h / 10
        const sc : number = ScaleUtil.divideScale(scale, 1, 2)
        const scc : number = ScaleUtil.cosify(sc)
        const r : number = Math.min(w, h) / rFactor
        DrawingUtil.drawLine(context, w / 10, startY, w / 2, startY)
        DrawingUtil.drawLine(context, w / 2, startY, w / 2, startY + y * sf)
        DrawingUtil.drawCircle(context, w / 2, h / 2 - y * scc, r)
    }
}
