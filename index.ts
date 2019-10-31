const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const strokeFactor : number = 90
const rFactor : number = 15
const foreColor : string = "#673AB7"
const backColor : string = "#BDBDBD"
const delay : number = 45

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        document.body.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
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
        const endY : number = 0.8 * h
        const startY : number = h / 30
        const y : number = (endY - startY)
        const sc : number = ScaleUtil.divideScale(scale, 1, 2)
        const scc : number = ScaleUtil.cosify(sc)
        const r : number = Math.min(w, h) / rFactor
        context.lineCap = 'round'
        context.strokeStyle = foreColor
        context.fillStyle = foreColor
        context.lineWidth = Math.min(w, h) / strokeFactor
        DrawingUtil.drawLine(context, w / 10, startY, w / 2, startY)
        DrawingUtil.drawLine(context, w / 2, startY, w / 2, startY + y * sf)
        DrawingUtil.drawCircle(context, w / 2, endY - y * scc, r)
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class RodCaptureBall {

    state : State = new State()

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawRodCaptureBall(context, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }
}

class Renderer {

    rcb : RodCaptureBall = new RodCaptureBall()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.rcb.draw(context)
    }

    handleTap(cb : Function) {
        this.rcb.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.rcb.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
