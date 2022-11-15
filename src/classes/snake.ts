import settings from "@/services/settings";
import { VibrationOriginal } from "@awesome-cordova-plugins/vibration";
import { Capacitor } from "@capacitor/core";
import { Color } from "@ionic/core";
import Vibrator from "../custom/implementations/vibration";

interface Coordinates {
    x: number;
    y: number;
}

enum Direction {
    LEFT,
    UP,
    RIGHT,
    DOWN,
    NONE,
}

export class Snake {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    cellSize: number;
    snake: Array<Coordinates> = [];
    food: Coordinates = {
        x: 0,
        y: 0,
    };
    foodX: Array<number> = [];
    foodY: Array<number> = [];
    gameLoop?: number;
    foodColor = "#9d0006";
    snakeLength = 2;
    directionQueue?: Direction = Direction.NONE;
    currentDirection?: Direction = Direction.NONE;
    score = 0;
    endSounds = ["/media/sounds/hs1.wav", "/media/sounds/hs2.wav"];

    constructor(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        cs: number
    ) {
        this.canvas = canvas;
        this.context = ctx;
        this.cellSize = cs;
    }

    init(): void {
        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "#cc341d";
        this.context.lineWidth = 5;
        this.context.stroke();
        this.canvas.setAttribute("tabindex", "1");
        this.canvas.style.outline = "none";
        this.canvas.focus();

        for (
            let i = 0;
            i <= this.canvas.width - this.cellSize;
            i += this.cellSize
        ) {
            this.foodX.push(i);
            this.foodY.push(i);
        }
        this.drawGrid("#98971a", "#3c3836");
        this.createFood();
        this.drawFood();
        this.createSnake();
        this.drawSnake();

        if (this.gameLoop != null) {
            clearInterval(this.gameLoop);
        } else {
            this.gameLoop = window.setInterval(() => this.game(), 150);
        }
    }

    async game(): Promise<void> {
        const head = this.snake[0];

        //checkCollision with wall
        if (
            head.x < 0 ||
            head.x > this.canvas.width - this.cellSize ||
            head.y < 0 ||
            head.y > this.canvas.height - this.cellSize
        ) {
            switch (this.currentDirection) {
                case Direction.UP:
                    head.y = this.canvas.height - this.cellSize;
                    break;
                case Direction.DOWN:
                    head.y = 0;
                    break;
                case Direction.LEFT:
                    head.x = this.canvas.width - this.cellSize;
                    break;
                case Direction.RIGHT:
                    head.x = 0;
                    break;
            }
        }

        //checkCollision with body
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x == this.snake[i].x && head.y == this.snake[i].y) {
                clearInterval(this.gameLoop);
                Vibrator.vibrate(2000);
                await this.flickerSquare("#cc341d", this.snake[i]);
                this.context.fillStyle = "rgba(0,0,0,0.4)";
                this.context.fillRect(
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                );
                this.context.font = "30px sans-serif";
                this.context.fillStyle = "white";
                this.context.textAlign = "center";
                this.context.fillText("You Lost!", this.canvas.width / 2, 40);
                this.context.fillText(
                    `Score: ${this.score}`,
                    this.canvas.width / 2,
                    120
                );

                if (this.score > settings.highScore) {
                    this.context.fillText(
                        "New Highscore!",
                        this.canvas.width / 2,
                        180
                    );
                    const track =
                        this.endSounds[
                        Math.floor(Math.random() * this.endSounds.length)
                        ];
                    const sound = new Audio(track);
                    sound.play().catch();
                    settings.highScore = this.score;
                }
                this.context.fillText(
                    `Current Highscore: ${settings.highScore} `,
                    this.canvas.width / 2,
                    240
                );
                return;
            }
        }

        // checkCollision with food
        if (this.checkCollision(head.x, head.y, this.food.x, this.food.y)) {
            this.snake[this.snake.length] = { x: head.x, y: head.y };
            this.score++;
            this.createFood();
            this.drawFood();
        }
        this.canvas.onkeydown = (evt) => {
            evt = evt || window.event;
            this.changeDirection(this.directionCode(evt.code));
        };
        this.context.beginPath();
        this.drawGrid("#98971a", "#3c3836");
        this.drawSnake();
        this.drawFood();
        this.moveSnake();
    }

    drawSquare(x: number, y: number, color: string): void {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, this.cellSize, this.cellSize);
    }

    createFood(): void {
        this.food.x = this.foodX[Math.floor(Math.random() * this.foodX.length)];
        this.food.y = this.foodY[Math.floor(Math.random() * this.foodY.length)];

        for (let i = 0; i < this.snake.length; i++) {
            if (
                this.checkCollision(
                    this.food.x,
                    this.food.y,
                    this.snake[i].x,
                    this.snake[i].y
                )
            ) {
                this.createFood();
            }
        }
    }

    checkCollision(x1: number, y1: number, x2: number, y2: number): boolean {
        if (x1 == x2 && y1 == y2) {
            return true;
        } else {
            return false;
        }
    }

    drawFood(): void {
        this.drawSquare(this.food.x, this.food.y, this.foodColor);
    }

    drawGrid(color1: string, color2: string): void {
        this.context.fillStyle = color1;
        this.context.strokeStyle = color2;

        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.lineWidth = 1;
        for (let x = 0.5; x < this.canvas.width; x += this.cellSize) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.canvas.height);
        }
        for (let y = 0.5; y < this.canvas.height; y += this.cellSize) {
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
        }

        this.context.stroke();
    }

    createSnake(): void {
        for (let i = this.snakeLength; i > 0; i--) {
            const k = i * this.cellSize;
            this.snake.push({ x: k, y: 0 });
        }
    }
    drawSnake(): void {
        for (let i = 0; i < this.snake.length; i++) {
            let color = settings.color;
            if (i === 0) {
                color = this.changeShade(color, -50);
            }
            this.drawSquare(this.snake[i].x, this.snake[i].y, color);
        }
    }
    changeDirection(direction: Direction | undefined): void {
        if (
            this.oppositeDirection(direction) ||
            (this.score == 0 &&
                this.currentDirection == Direction.NONE &&
                direction == Direction.LEFT)
        ) {
            this.directionQueue = Direction.NONE;
        } else {
            this.directionQueue = direction;
        }
    }

    changeShade(color: Color, magnitude: number): Color {
        color = color.replace(`#`, ``);
        if (color.length === 6) {
            const decimalColor = parseInt(color, 16);
            let r = (decimalColor >> 16) + magnitude;
            r > 255 && (r = 255);
            r < 0 && (r = 0);
            let g = (decimalColor & 0x0000ff) + magnitude;
            g > 255 && (g = 255);
            g < 0 && (g = 0);
            let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
            b > 255 && (b = 255);
            b < 0 && (b = 0);
            return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
        } else {
            return color;
        }
    }

    moveSnake(): void {
        if (this.currentDirection != Direction.NONE) {
            const tail = this.snake.pop();
            if (tail) {
                tail.x = this.snake[0].x;
                tail.y = this.snake[0].y;
                this.snake.unshift(tail);
            }
        }
        if (this.directionQueue != Direction.NONE) {
            this.currentDirection = this.directionQueue;
        }
        if (this.currentDirection == Direction.RIGHT) {
            this.snake[0].x += this.cellSize;
        } else if (this.currentDirection == Direction.LEFT) {
            this.snake[0].x -= this.cellSize;
        } else if (this.currentDirection == Direction.UP) {
            this.snake[0].y -= this.cellSize;
        } else if (this.currentDirection == Direction.DOWN) {
            this.snake[0].y += this.cellSize;
        }
    }

    oppositeDirection(direction: Direction | undefined): boolean {
        if (
            (direction == Direction.LEFT &&
                this.currentDirection != Direction.RIGHT) ||
            (direction == Direction.UP &&
                this.currentDirection != Direction.DOWN) ||
            (direction == Direction.RIGHT &&
                this.currentDirection != Direction.LEFT) ||
            (direction == Direction.DOWN &&
                this.currentDirection != Direction.UP)
        ) {
            return false;
        } else return true;
    }

    directionCode(code: string): Direction | undefined {
        let dir: Direction | undefined;
        switch (code) {
            case "ArrowLeft":
                dir = Direction.LEFT;
                break;
            case "ArrowUp":
                dir = Direction.UP;
                break;
            case "ArrowRight":
                dir = Direction.RIGHT;
                break;
            case "ArrowDown":
                dir = Direction.DOWN;
                break;
        }
        return dir;
    }

    flickerSquare(color: Color, coords: Coordinates): Promise<void> {
        let localColor: Color = color;
        let count = 0;
        return new Promise((resolve) => {
            const flicker = setInterval(() => {
                if (count === 10) {
                    clearInterval(flicker);
                    resolve();
                }
                this.drawSquare(coords.x, coords.y, localColor);
                localColor = localColor == color ? settings.color : color;
                count++;
            }, 500);
        });
    }
}
