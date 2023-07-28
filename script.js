class Attacker {
    constructor(game) {
        this.game = game
        this.width = 100
        this.height = 100
        this.x = this.game.width * 0.5 - this.width * 0.5
        this.y = this.game.height - this.height
        this.speed = 3
    }
    draw(context) {
        context.fillRect(this.x, this.y, this.width, this.height)
    }

    update() {
        if (this.game.keys.indexOf('ArrowLeft') > -1) this.x -= this.speed

        if (this.game.keys.indexOf('ArrowRight') > -1) this.x += this.speed

        if (this.x < -this.width * 0.5) this.x = -this.width * 0.5
        else if (this.x > this.game.width - this.width * 0.5) this.x = this.game.width - this.width * 0.5
    }

    fire() {
        const missile = this.game.getMissile()
        if (missile) missile.start(this.x + this.width * 0.5, this.y)
    }
}

class Missile {
    constructor() {
        this.width = 10
        this.height = 20
        this.x = 0
        this.y = 0
        this.speed = 20
        this.free = true
    }

    draw(context) {
        if (!this.free) {
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    update() {
        if (!this.free) {
            this.y -= this.speed
            if (this.y < -this.height) this.reset()
        }
    }

    start(x, y) {
        this.x = x - this.width * 0.5
        this.y = y
        this.free = false
    }
    reset() {
        this.free = true
    }
}

class Defender {}

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.keys = []
        this.attacker = new Attacker(this)
        this.missilePool = []
        this.numberOfMissiles = 10
        this.createMissiles()

        window.addEventListener('keydown', e => {
            if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key)

            if (e.key === '1') this.attacker.fire()
        })

        window.addEventListener('keyup', e => {
            const index = this.keys.indexOf(e.key)
            if (index > -1) this.keys.splice(index, 1)
        })
    }
    render(context) {
        this.attacker.draw(context)
        this.attacker.update()
        this.missilePool.forEach(missile => {
            missile.update()
            missile.draw(context)
        })
    }
    createMissiles() {
        for (let i = 0; i < this.numberOfMissiles; i++) {
            this.missilePool.push(new Missile())
        }
    }
    getMissile() {
        for (let i = 0; i < this.missilePool.length; i++) {
            if (this.missilePool[i].free) return this.missilePool[i]
        }
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas-1')
    const ctx = canvas.getContext('2d')
    canvas.width = 600
    canvas.height = 800
    ctx.fillStyle = 'white'

    const game = new Game(canvas)
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.render(ctx)
        requestAnimationFrame(animate)
    }
    animate()
})
