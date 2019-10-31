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
}
