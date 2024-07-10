import { createCard } from "./createCard.js";

export class Play extends Phaser.Scene {
  cardNames = [
    "card-0",
    "card-1",
    "card-2",
    "card-3",
    "card-4",
    "card-5",
    "card-6",
  ];
  cards = [];
  cardOpened = undefined;
  canMove = false;
  lives = 0;
  score = 0;
  level = 1;
  maxLevel = 3;
  scoreText = null;
  hearts = []; // Initialize hearts array

  gridConfiguration = {
    x: 113,
    y: 102,
    paddingX: 5,
    paddingY: 5,
  };

  constructor() {
    super({
      key: "Play",
    });
    this.cards = [];
    this.hearts = [];
  }

  init() {
    this.cameras.main.fadeIn(500);
    this.lives = 10;
    this.score = 0;
    this.level = 1;
    this.volumeButton();
  }

  create() {
    this.createBackground();
    this.createScoreText();
    this.createLevel();
  }

  createBackground() {
    this.add
      .image(
        this.sys.game.scale.width / 2,
        this.sys.game.scale.height / 2,
        "background"
      )
      .setOrigin(0.5, 0.5);
  }

  createScoreText() {
    this.scoreText = this.add
      .text(this.sys.game.scale.width - 20, 20, `Score: ${this.score}`, {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(1, 0);
  }

  updateScore() {
    this.scoreText.setText(`Score: ${this.score}`);
  }

  createLevel() {
    const levelText = this.add
      .text(
        this.sys.game.scale.width / 2,
        this.sys.game.scale.height / 2,
        `Level ${this.level}\nClick to Start`,
        {
          align: "center",
          strokeThickness: 4,
          fontSize: 40,
          fontStyle: "bold",
          color: "#8c7ae6",
        }
      )
      .setOrigin(0.5)
      .setDepth(3)
      .setInteractive();

    this.add.tween({
      targets: levelText,
      duration: 800,
      ease: (value) => value > 0.8,
      alpha: 0,
      repeat: -1,
      yoyo: true,
    });

    levelText.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.sound.play("whoosh", { volume: 1.3 });
      this.add.tween({
        targets: levelText,
        ease: Phaser.Math.Easing.Bounce.InOut,
        y: -1000,
        onComplete: () => {
          if (!this.sound.get("theme-song")) {
            this.sound.play("theme-song", { loop: true, volume: 0.5 });
          }
          this.startGame();
        },
      });
    });
  }

  restartGame() {
    this.cardOpened = undefined;
    if (this.cards.length > 0) {
      this.cameras.main.fadeOut(200 * this.cards.length);
      this.cards.reverse().forEach((card, index) => {
        this.add.tween({
          targets: card.gameObject,
          duration: 500,
          y: 1000,
          delay: index * 100,
          onComplete: () => {
            card.gameObject.destroy();
          },
        });
      });

      this.time.addEvent({
        delay: 200 * this.cards.length,
        callback: () => {
          this.cards = [];
          this.canMove = false;
          this.scene.restart();
          this.sound.play("card-slide", { volume: 1.2 });
        },
      });
    } else {
      this.cards = [];
      this.canMove = false;
      this.scene.restart();
      this.sound.play("card-slide", { volume: 1.2 });
    }
  }

  createCountdown(callback) {
    let countdown = 5;
    const countdownText = this.add
      .text(
        this.sys.game.scale.width / 2,
        this.sys.game.scale.height / 2,
        countdown,
        {
          align: "center",
          strokeThickness: 4,
          fontSize: 80,
          fontStyle: "bold",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setDepth(5);

    const countdownInterval = this.time.addEvent({
      delay: 1000,
      repeat: countdown - 1,
      callback: () => {
        countdown -= 1;
        countdownText.setText(countdown);
        if (countdown === 0) {
          countdownText.destroy();
          callback();
        }
      },
    });
  }

  //#region  create grid cards
  createGridCards() {
    // Shuffle the cardNames array to randomize the order
    const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames]);

    // Calculate the total number of pairs and total cards based on the level
    const numPairs = this.level * 2;
    // Each level increases by 4 cards (2 pairs)

    // Select the necessary number of pairs and ensure each pair is distinct
    const selectedCardNames = gridCardNames.slice(0, numPairs);

    // Duplicate the selected card names to create pairs and shuffle them
    const duplicatedCardNames = Phaser.Utils.Array.Shuffle([
      ...selectedCardNames,
      ...selectedCardNames,
    ]);
    const totalCards = duplicatedCardNames.length;

    // Maximum number of columns
    const maxCols = 4;
    const numRows = Math.ceil(totalCards / maxCols);
    const numCols = Math.min(maxCols, totalCards);

    // Calculate the starting position to center the grid
    const totalGridWidth = (98 + this.gridConfiguration.paddingX) * numCols;
    const totalGridHeight = (128 + this.gridConfiguration.paddingY) * numRows;
    const startX =
      (this.sys.game.scale.width - totalGridWidth) / 2 +
      (98 + this.gridConfiguration.paddingX) / 2;
    const startY =
      (this.sys.game.scale.height - totalGridHeight) / 2 +
      (128 + this.gridConfiguration.paddingY) / 2;

    console.log("====List card====");
    return Phaser.Utils.Array.Shuffle(duplicatedCardNames).map((name, index) => {
      const row = Math.floor(index / numCols);
      const col = index % numCols;
      console.log("card name: " + name);

      const newCard = createCard({
        scene: this,
        x: startX + (98 + this.gridConfiguration.paddingX) * col,
        y: startY + (128 + this.gridConfiguration.paddingY) * row,
        frontTexture: name,
        cardName: name,
      });

      this.add.tween({
        targets: newCard.gameObject,
        duration: 800,
        delay: index * 100,
        onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
        y: startY + (128 + this.gridConfiguration.paddingY) * row,
      });

      return newCard;
    });
  }

  //#endregion

  createHearts() {
    this.hearts = Array.from(new Array(this.lives)).map((el, index) => {
      const heart = this.add
        .image(this.sys.game.scale.width + 1000, 20, "heart")
        .setScale(2);

      this.add.tween({
        targets: heart,
        ease: Phaser.Math.Easing.Expo.InOut,
        duration: 1000,
        delay: 1000 + index * 200,
        x: 140 + 30 * index,
      });
      return heart;
    });
  }

  volumeButton() {
    const volumeIcon = this.add
      .image(25, 25, "volume-icon")
      .setName("volume-icon");
    volumeIcon.setInteractive();

    volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor("pointer");
    });

    volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.input.setDefaultCursor("default");
    });

    volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.sound.volume === 0) {
        this.sound.setVolume(1);
        volumeIcon.setTexture("volume-icon");
        volumeIcon.setAlpha(1);
      } else {
        this.sound.setVolume(0);
        volumeIcon.setTexture("volume-icon_off");
        volumeIcon.setAlpha(0.5);
      }
    });
  }

  resetData() {
    if (this.hearts) {
      this.hearts.forEach((heart) => heart.destroy());
    }
    if (this.cards) {
      this.cards.forEach((card) => card.destroy()); // Remove existing hearts
    }
  }

  startGame() {
    this.resetData();
    this.lives = 10;
    this.createHearts();
    this.cards = this.createGridCards();

    this.createCountdown(() => {
      this.canMove = true;
    });

    this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
      if (this.canMove) {
        const card = this.cards.find((card) =>
          card.gameObject.hasFaceAt(pointer.x, pointer.y)
        );
        if (card) {
          this.input.setDefaultCursor("pointer");
        } else {
          this.input.setDefaultCursor("default");
        }
      }
    });

    //#region Click to card
    //click to card
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
      if (!this.canMove || !this.cards.length) return;

      const clickedCard = this.getClickedCard(pointer);
      if (!clickedCard) return;

      this.canMove = false;

      if (this.cardOpened) {
        if (this.isSameCard(clickedCard)) {
          this.canMove = true;
          return;
        }
        this.handleCardFlip(clickedCard);
      } else {
        this.openCard(clickedCard);
      }
    });
    //#endregion
    this.winnerText = this.add
      .text(
        this.sys.game.scale.width / 2,
        -1000,
        `Finish level ${this.level}`,
        {
          align: "center",
          strokeThickness: 4,
          fontSize: 40,
          fontStyle: "bold",
          color: "#8c7ae6",
        }
      )
      .setOrigin(0.5)
      .setDepth(3)
      .setInteractive();

    this.gameOverText = this.add
      .text(
        this.sys.game.scale.width / 2,
        -1000,
        "GAME OVER\nClick to restart",
        {
          align: "center",
          strokeThickness: 4,
          fontSize: 40,
          fontStyle: "bold",
          color: "#ff0000",
        }
      )
      .setName("gameOverText")
      .setDepth(3)
      .setOrigin(0.5)
      .setInteractive();

    this.winnerText.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.winnerText.setColor("#FF7F50");
      this.input.setDefaultCursor("pointer");
    });

    this.winnerText.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.winnerText.setColor("#8c7ae6");
      this.input.setDefaultCursor("default");
    });

    this.gameOverText.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.gameOverText.setColor("#FF7F50");
      this.input.setDefaultCursor("pointer");
    });

    this.gameOverText.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.gameOverText.setColor("#8c7ae6");
      this.input.setDefaultCursor("default");
    });

    this.gameOverText.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.add.tween({
        targets: this.gameOverText,
        ease: Phaser.Math.Easing.Bounce.InOut,
        y: -1000,
        onComplete: () => {
          this.restartGame();
        },
      });
    });
  }

  //#region  card clicked method
  getClickedCard(pointer) {
    return this.cards.find((card) =>
      card.gameObject.hasFaceAt(pointer.x, pointer.y)
    );
  }

  isSameCard(card) {
    return (
      this.cardOpened.gameObject.x === card.gameObject.x &&
      this.cardOpened.gameObject.y === card.gameObject.y
    );
  }

  handleCardFlip(card) {
    card.flip(() => {
      if (this.isMatchingPair(card)) {
        this.handleMatch(card);
        this.canMove = true;
      } else {
        this.handleMismatch(card);
      }
      this.checkGameOver();
      this.checkLevelCompletion();
    });
  }

  isMatchingPair(card) {
    return this.cardOpened.cardName === card.cardName;
  }

  handleMatch(card) {
    this.sound.play("card-match");
    this.cardOpened.destroy();
    card.destroy();
    this.cards = this.cards.filter((c) => c.cardName !== card.cardName);
    this.cardOpened = undefined;
    this.score += 10;
    this.updateScore();
  }

  handleMismatch(card) {
    this.sound.play("card-mismatch");
    this.cameras.main.shake(600, 0.01);
    this.removeHeart();

    // Delay flipping back the cards to ensure player waits
    this.time.delayedCall(1000, () => {
      card.flip();
      this.cardOpened.flip(() => {
        this.cardOpened = undefined;
        this.canMove = true; // Allow player to move again after both cards have flipped back
      });
    });
  }

  removeHeart() {
    const lastHeart = this.hearts.pop();
    this.add.tween({
      targets: lastHeart,
      ease: Phaser.Math.Easing.Expo.InOut,
      duration: 1000,
      y: -1000,
      onComplete: () => {
        lastHeart.destroy();
      },
    });
    this.lives -= 1;
  }

  checkGameOver() {
    if (this.lives > 0) return;

    this.sound.play("whoosh", { volume: 1.3 });
    this.add.tween({
      targets: this.gameOverText,
      ease: Phaser.Math.Easing.Bounce.Out,
      y: this.sys.game.scale.height / 2,
    });
    this.canMove = false;
  }

  checkLevelCompletion() {
    if (this.cards.length > 0) return;

    this.sound.play("whoosh", { volume: 1.3 });
    this.sound.play("victory");

    this.add.tween({
      targets: this.winnerText,
      ease: Phaser.Math.Easing.Bounce.Out,
      y: this.sys.game.scale.height / 2,
    });

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.add.tween({
          targets: this.winnerText,
          ease: Phaser.Math.Easing.Bounce.InOut,
          y: -1000,
          onComplete: () => {
            if (this.level < this.maxLevel) {
              this.level += 1;
              this.canMove = false;
              this.startGame();
            } else {
              this.canMove = false;
            }
          },
        });
      },
    });
  }

  openCard(card) {
    card.flip(() => {
      this.canMove = true;
    });
    this.cardOpened = card;
  }
  //#endregion
}
