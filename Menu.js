export class Menu extends Phaser.Scene {
    constructor() {
      super({
        key: 'Menu',
      });
    }
  
    preload() {
      this.load.setPath("assets/games/card-memory-game/");
      this.load.image("menu-background", "background/menu/menu-background.png");
      this.load.image("play-button", "background/menu/btn-play.png");
      this.load.image("play-button-hover", "background/menu/btn-play-hover.png");
      this.load.image("campaign-button", "background/menu/btn-campaign.png");
      this.load.image("campaign-button-hover", "background/menu/btn-campaign-hover.png");
      this.load.image("home-button", "background/menu/btn-home.png");
      this.load.image("home-button-hover", "background/menu/btn-home-hover.png");
      this.load.image("quit-button", "background/menu/btn-play.png");
    }
  
    create() {
      const background = this.add.image(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2, 'menu-background').setOrigin(0.5);
      background.setScale(1); 
  
      const playButton = this.add.image(this.sys.game.scale.width / 2, 300, 'play-button').setInteractive();
      playButton.setScale(1); 
      const campaignButton = this.add.image(this.sys.game.scale.width / 2, 400, 'campaign-button').setInteractive();
      campaignButton.setScale(1);
  
      const homeButton = this.add.image(this.sys.game.scale.width / 2, 500, 'home-button').setInteractive();
      homeButton.setScale(1);
  
    //btn play
    playButton.on('pointerdown', () => {
        console.log("play");
        this.scene.start('Preloader');
      });
 
    playButton.on('pointerover', () => {
        playButton.setTexture('play-button-hover');
      });
  
      playButton.on('pointerout', () => {
        playButton.setTexture('play-button');
      });


    //btn campaign
    campaignButton.on('pointerdown', () => {
        console.log("campaign btn clicked");
    
      });
 
      campaignButton.on('pointerover', () => {
        campaignButton.setTexture('campaign-button-hover');
      });
  
      campaignButton.on('pointerout', () => {
        campaignButton.setTexture('campaign-button');
      });


    //btn home
    homeButton.on('pointerdown', () => {
        console.log("home clicked");
    
      });
 
      homeButton.on('pointerover', () => {
        playButton.setTexture('play-button-hover');
      });
  
      homeButton.on('pointerout', () => {
        playButton.setTexture('play-button');
      });
    }
  }
  