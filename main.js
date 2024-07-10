import { Preloader } from "./Preloader.js";
import { Play } from "./Play.js";
import { Menu } from "./Menu.js";
const config = {
  title: "Card Memory Game",
  type: Phaser.AUTO,
  backgroundColor: "#192a56",
  width: 1600,
  height: 800,
  parent: "phaser-example",
  render: {
    pixelArt: true,
  },
  scene: [Menu,Preloader, Play]
};

new Phaser.Game(config);
