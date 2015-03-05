window.onload = function() {    
    "use strict";
    var game = new Phaser.Game(
                                800, 600,           // Width, height of game in px
                                Phaser.AUTO,        // Graphic rendering
                                'game',     
                                { preload: preload, // Preload function
                                  create: create,   // Creation function
                                  update: update }  // Update function
                               );

    var maze;
    var walls;
    var player;
    var cursors;
    var persuasion = 0;
    var nextIncrease = 0;
    var HUDbg;
    var persuadeDisplayText;
    var gotten;
    var zero;
    var one;
    var two;
    var three;
    var four;
    var five;
    var six;
    var seven;
    var g = [zero, one, two, three, four, five, six, seven];
    var gems;
    var gemsCollected = 0;
    var drinkWater;
    var getGem;
    var lavaOverflow;
    
    function preload() {
        game.load.image('tiles_sheet', 'assets/img/tiles_spritesheet.png');
        game.load.tilemap('map_json', 'assets/map/maze.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('bg', 'assets/img/bg.png');
        
        game.load.image('player', 'assets/img/player.png');
        
        game.load.image('gotGem', 'assets/img/gotGem.png');
        game.load.image('HUDbg', 'assets/img/HUDbg.png');
        
        game.load.image('zero', 'assets/img/hud_0.png');
        game.load.image('one', 'assets/img/hud_1.png');
        game.load.image('two', 'assets/img/hud_2.png');
        game.load.image('three', 'assets/img/hud_3.png');
        game.load.image('four', 'assets/img/hud_4.png');
        game.load.image('five', 'assets/img/hud_5.png');
        game.load.image('six', 'assets/img/hud_6.png');
        game.load.image('seven', 'assets/img/hud_7.png');
        
        game.load.image('win', 'assets/img/win.png');
        game.load.image('lose', 'assets/img/lose.png');
        
        game.load.audio('bg', ['assets/audio/bg.mp3'], ['assets/audio/bg.ogg']);
        game.load.audio('drinkWater', ['assets/audio/drinkWater.mp3', 'assets/audio/drinkWater.ogg']);
        game.load.audio('getGem', ['assets/audio/getGem.mp3', 'assets/audio/getGem.ogg']);
        game.load.audio('lavaOverflow', ['assets/audio/lavaOverflow.mp3', 'assets/audio/lavaOverflow.ogg']);
    }
    
    function audioStartUp() {
        var bg = game.add.audio('bg', 1, true);
        bg.play('', 0, 1, true);
        
        drinkWater = game.add.audio('drinkWater');
        getGem = game.add.audio('getGem');
        lavaOverflow = game.add.audio('lavaOverflow');
    }
    
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 2100, 2100, 'bg');
        
        audioStartUp();

        maze = game.add.tilemap('map_json');
        maze.addTilesetImage('tiles_spritesheet', 'tiles_sheet');
        walls = maze.createLayer("Tile Layer 1");
        walls.resizeWorld();
        maze.setTileIndexCallback(153, function (player, tile) {    // dig
                maze.removeTile(tile.x, tile.y);
                maze.setPreventRecalculate(false);
            }, game, walls);
        maze.setTileIndexCallback(8, function (player, tile) {     // lava
            if (gemsCollected < 8) {
                if ((persuasion - 10) > 0)
                {
                    lavaOverflow.play();
                    persuasion = persuasion - 10;
                    HUDUpdate();
                    if (tile.x < 25 && tile.y < 25)
                    {
                        player.body.velocity.x = 0;
                        player.body.velocity.y = 0;
                        maze.fill(8, tile.x, tile.y, 5, 5);
                        player.body.position.x = tile.x*70;
                        player.body.position.y = tile.y*70;
                        maze.removeTile(tile.x, tile.y);
                    }
                    else
                    {
                        player.body.velocity.x = 0;
                        player.body.velocity.y = 0;
                        maze.fill(8, tile.x - 5, tile.y - 5, 5, 5);
                        player.body.position.x = tile.x*70;
                        player.body.position.y = tile.y*70;
                        maze.removeTile(tile.x, tile.y);
                    }
                }
                else
                {
                    var lose = game.add.sprite(0, 0, 'lose');
                    lose.fixedToCamera = true;
                    game.input.keyboard.stop();
                }
            }
            maze.setPreventRecalculate(false);
            }, game, walls);
        maze.setTileIndexCallback(44, function (player, tile) {    // water
                if (gemsCollected < 8) {
                    drinkWater.play();
                    persuasion = persuasion + 10;
                    HUDUpdate();
                    maze.removeTile(tile.x, tile.y);
                    maze.setPreventRecalculate(false);
                }
            }, game, walls);
        
        gemPlace();
        
        player = game.add.sprite(50, 29*70, 'player');
        player.anchor.set(0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;       
        game.camera.follow(player);
        
        HUDCreate();
        
        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function gemPlace() {
        gems = game.add.group();
        gems.enableBody = true;
        
        maze.removeTile(22, 3);
        maze.removeTile(4, 6);
        maze.removeTile(16, 8);
        maze.removeTile(13, 15);
        maze.removeTile(25, 16);
        maze.removeTile(4, 23);
        maze.removeTile(20, 25);
        maze.removeTile(9, 27);
        
        var gem = gems.create(1570, 240, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;
        
        gem = gems.create(310, 450, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;
        
        gem = gems.create(1150, 590, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;
        
        gem = gems.create(940, 1080, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;
        
        gem = gems.create(1780, 1150, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;
        
        gem = gems.create(310, 1640, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;
        
        gem = gems.create(1430, 1780, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;
        
        gem = gems.create(660, 1920, 'gotGem');
        gem.anchor.set(0.5);
        gem.body.immovable = true;
        gem.body.moves = false;

    }
    
    function gemHit(player, gem) {
        getGem.play();
        gem.destroy();
        if (gemsCollected === 0) { zero.loadTexture('gotGem'); }
        if (gemsCollected === 1) { one.loadTexture('gotGem'); }
        if (gemsCollected === 2) { two.loadTexture('gotGem'); }
        if (gemsCollected === 3) { three.loadTexture('gotGem'); }
        if (gemsCollected === 4) { four.loadTexture('gotGem'); }
        if (gemsCollected === 5) { five.loadTexture('gotGem'); }
        if (gemsCollected === 6) { six.loadTexture('gotGem'); }
        if (gemsCollected === 7) { seven.loadTexture('gotGem'); }
        gemsCollected = gemsCollected + 1;
        if (gemsCollected >= 8) {
            var win = game.add.sprite(0, 0, 'win');
            win.fixedToCamera = true;
            game.input.keyboard.stop();
        }
    }
    
    function HUDCreate() {
        HUDbg = game.add.sprite(0, 0, 'HUDbg');
        HUDbg.fixedToCamera = true;
        HUDbg.cameraOffset.x = 550;
        HUDbg.cameraOffset.y = 0;
        HUDbg.scale.x = 0.63;
        HUDbg.scale.y = 0.8;
        HUDbg.alpha = 0.95;
    
        persuadeDisplayText = game.add.text(0, 0, "Persuasion: " + persuasion);
        persuadeDisplayText.fixedToCamera = true;
        persuadeDisplayText.cameraOffset.x = 580;
        persuadeDisplayText.cameraOffset.y = 10;
        persuadeDisplayText.font = "20px";
        
        zero = game.add.sprite(0, 0, 'zero');
        zero.anchor.set(0.5);
        zero.fixedToCamera = true;
        zero.cameraOffset.x = 600;
        zero.cameraOffset.y = 80;
        
        one = game.add.sprite(0, 0, 'one');
        one.anchor.set(0.5);
        one.fixedToCamera = true;
        one.cameraOffset.x = 650;
        one.cameraOffset.y = 80;
        
        two = game.add.sprite(0, 0, 'two');
        two.anchor.set(0.5);
        two.fixedToCamera = true;
        two.cameraOffset.x = 700;
        two.cameraOffset.y = 80;
        
        three = game.add.sprite(0, 0, 'three');
        three.anchor.set(0.5);
        three.fixedToCamera = true;
        three.cameraOffset.x = 750;
        three.cameraOffset.y = 80;
        
        four = game.add.sprite(0, 0, 'four');
        four.anchor.set(0.5);
        four.fixedToCamera = true;
        four.cameraOffset.x = 600;
        four.cameraOffset.y = 130;
        
        five = game.add.sprite(0, 0, 'five');
        five.anchor.set(0.5);
        five.fixedToCamera = true;
        five.cameraOffset.x = 650;
        five.cameraOffset.y = 130;
        
        six = game.add.sprite(0, 0, 'six');
        six.anchor.set(0.5);
        six.fixedToCamera = true;
        six.cameraOffset.x = 700;
        six.cameraOffset.y = 130;
        
        seven = game.add.sprite(0, 0, 'seven');
        seven.anchor.set(0.5);
        seven.fixedToCamera = true;
        seven.cameraOffset.x = 750;
        seven.cameraOffset.y = 130;
    }
    
    function HUDUpdate() {
        persuadeDisplayText.text = "Persuasion: " + persuasion;
    }

    function update() {
        game.physics.arcade.collide(player, walls);
        game.physics.arcade.overlap(player, gems, gemHit, null, this);
    
        if (cursors.right.isDown && cursors.up.isDown) {
            player.body.velocity.y = -300;
        }
        if (cursors.left.isDown && cursors.up.isDown) {
            player.body.velocity.y = -300;
        }
        if (cursors.right.isDown && cursors.down.isDown) {
            player.body.velocity.y = 300;
        }
        if (cursors.left.isDown && cursors.down.isDown) {
            player.body.velocity.y = 300;
        }
        if (cursors.right.isDown) {
            player.body.velocity.x = 300;
        }
        else if (cursors.left.isDown) {
            player.body.velocity.x = -300;
        }
        else if (cursors.up.isDown) {
            player.body.velocity.y = -300;
        }
        else if (cursors.down.isDown) {
            player.body.velocity.y = 300;
        }
        else {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }
    }
};
