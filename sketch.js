//crear las variables 
var tower, towerImg;
var door, doorImg, doorsGroup;
var climber, climberImg, climbersGroup;
var ghost,ghostImg;
var soul,soulImg,soulGroup;
var soul2,soul2Img,soul2Group;
var soul3,soul3Img,soul3Group;
var invisibleBlockGroup;
var gameState = "START";
var score;
var vida = 0;

//funcion para que se pueda descargar las imagenes
function preload() {
  towerImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadImage("ghost-standing.png");
  spookySound = loadSound ("spooky.wav");
  soulImg = loadImage("soul.png");
  soul2Img = loadImage("soul2.png");
  soul3Img = loadImage("soul3.png");
  //crear los grupos 
  doorsGroup = new Group();
  climbersGroup = new Group();
  invisibleBlockGroup = new Group();
  soulGroup = new Group();
  soul2Group = new Group();
  soul3Group = new Group();
//score para poder hacer el conteo
  score = 0;
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  //funcion para reproducir la musica
  spookySound.loop();
  //creacion de la imagen de la torre para el fondo 
  tower = createSprite (displayWidth/2 ,displayHeight/2);
  tower.addImage ("tower",towerImg);
  tower.scale = 2;
  tower.velocityY = 1;
  //crear la muerte o ghost que sera el protagonista
  ghost = createSprite (displayWidth/2,displayHeight/2, 100,100);
  ghost.addImage ("ghost", ghostImg);
  //poder escalar la imagen del ghost
  ghost.scale = 0.5;
}

function draw() {
  background('black');
  stroke("red");
  fill("red");
  textSize(35);
  //poder hacer el texto de la vidas 
  text ("Souls: "+ score,100,ghost.y);
  text ("Vidas: "+ vida,100,ghost.y + 35);
//como hacer que el fondo de la imagen de la torre se repita haciendo que sea vea infinito
  if(tower.y > displayHeight*8/10){
    tower.y = displayHeight*2/10;
  }
//este if hara que se muestre el inicio del juego y solo comenzara si se preciona el SPACE
if (gameState === "START" && vida === 0){
  stroke ("yellow");
  fill ("yellow");
  textSize (30);
  text ("BIENVENIDO AMIGO CAZA-FANTASMAS!", displayWidth/2 -150, displayHeight/2 - 120);
  stroke ("white");
  fill ("white");
  textSize (25);
  text("SIMPLE - 5 MONEDAS",displayWidth/2 - 20, displayHeight/2 - 50);
  text("LEGENDARIO - 50 MONEDAS",displayWidth/2 - 30, displayHeight/2 - 20);
  text("MITICO - 100 MONEDAS",displayWidth/2 - 30, displayHeight/2 + 10);
  stroke ("yellow");
  fill("yellow");
  textSize (35);
  text ("CAPTURA A MUCHOS FANTASMAS :D!",displayWidth/2 - 110, displayHeight/2 + 60);
  stroke ("white");
  fill ("white");
  textSize (25);
  text (" Inicia presionando SPACE", displayWidth/2 - 50, displayHeight/2 + 120);
//aqui si se preciona el SPACE se transforma el juego en jugar y se comienza hacer al conteo a de la vida 
  if( keyDown ("SPACE")){
    gameState = "PLAY";
    vida = 1;
  }

}
//es if para que se puede ejecutar la partida 
  if (gameState === "PLAY" && vida < 4){
    if( ghost.isTouching(soulGroup)) {
      soulGroup.destroyEach();
      score = score + 5;
    }  

    if( ghost.isTouching(soul2Group)) {
      soul2Group.destroyEach();
      score = score + 50;
    }  

    if( ghost.isTouching(soul3Group)) { 
      soul3Group.destroyEach();
      score = score + 100;
    }  
    //se preciona la barra espaciadora para que puede saltar el fantasma y que tambien la camara lo sigue en el eje Y
  if (keyDown ("SPACE")) {
    ghost.velocityY = -3;
    camera.position.x = displayWidth/2;
    camera.position.y = ghost.y;
  }
 //para que abance el fantasma de izquierda a deracha
  if (keyDown("LEFT_ARROW")) {
    ghost.x = ghost.x -3;
  }
  
  if (keyDown("right_arrow")) {
    ghost.x = ghost.x + 3;
  }
  //esparaa que el fantasme se deje de mover despues de tocar la parte de abajde la ventana
  if (climbersGroup.isTouching(ghost)) {
    ghost.velocityY = 0;
  }

  console.log(ghost.Y);

//es para cuando el fantasma toca la parte de abajo de la ventana se destruya y se cuenta una vida
  if (invisibleBlockGroup.isTouching(ghost) || (ghost.Y)) {
    ghost.destroy();
    vida = vida + 1;
//aqui si la vida es menor que cuatro el fantasme se regenrera  si no se pasa a game state end
    if(vida < 4){
      ghost = createSprite (displayWidth/2,displayHeight/2, 100,100);
      ghost.addImage ("ghost", ghostImg);
      ghost.scale = 0.5;
      gameState = "PLAY";
      }
      else {
        gameState = "END";
      }
      //si es mayor a 3 de la vida se termina el juego
        if (vida > 3){
        gameState = "END";
        }
  }
  //se mide la velicidad del fantasma
  ghost.velocityY = ghost.velocityY + 0.3;
//es para poner el letrero de GAME OVER
  if (gameState === "END") {
    stroke ("yellow");
    fill ("yellow");
    textSize (70);
    text ("GAME OVER",displayWidth/2 - 30 ,displayHeight/2);
    stroke("white");
    fill ("white");
    textSize (30);
    text("PRESIONA FLECHA ABAJO PARA VOLVER A JUGAR",displayWidth/2 - 150 ,displayHeight/2 + 15 );
    //es un boton para que se puede reiniciar el juego
    if (keyDown("down_arrow")){    
      gameState = "START";
      vida = 0;
      score = 0;
    }
  }

  spawnSoul();
  spawnSoul2();
  spawnSoul3();
  spawnDoors();
  drawSprites();
  }
  
  
}
//funcion para que se pueda aparecer las puertas y que aparezcan de manera aleatoria
function spawnDoors() {
  if (frameCount % 200 === 0) {
    var door = createSprite (200,-50);
    var climber = createSprite (200,10);
    var invisibleBlock = createSprite(200,20);
  
    climber.addImage(climberImg);
    door.addImage(doorImg);
    
    door.x = Math.round (random(displayWidth/4, displayWidth*3/4));
    climber.x = door.x;
    climber.y = 22;
    
    door.velocityY =1;
    climber.velocityY =1;
    
    invisibleBlock.wieght = climber.wight;
    invisibleBlock.height = 1;
    
//asignar ciclo de vida
    door.lifeTime = 800;   
    climber.lifeTime = 800;
    
//agregar cada puerta al grupo 
    doorsGroup.add(door);
    climbersGroup.add(climber);
    
    invisibleBlock.x = door.x;
    invisibleBlock.velocityY =1;
    
    invisibleBlock.debug = true;
    invisibleBlockGroup.add(invisibleBlock);
    
    
    ghost.depth = door.depth
    ghost.depth +=1;
  }
}
//para crear a los fantasmas y que aprezcan de manera aleatoria
function spawnSoul() {
  if (frameCount % 200 === 0) {
    var soul = createSprite (200,-50);
    soul.addImage(soulImg);
    soul.x = Math.round (random(displayWidth/4,displayWidth*3/4));
    soul.velocityY =2;

    soul.scale = 0.1;
    
    ghost.depth = soul.depth;
    ghost.depth +=1;
    soul.lifeTime = 800;
    soulGroup.add(soul);
  }
}

function spawnSoul2() {
  if (frameCount % 200 === 0) {
    var soul2 = createSprite (200,-50);
    soul2.addImage(soul2Img);
    soul2.x = Math.round (random(displayWidth/4,displayWidth*3/4));
    soul2.velocityY =3;

    soul2.scale = 0.2;
    
    ghost.depth = soul2.depth;
    ghost.depth +=1;
    soul2.lifeTime = 800;
    soul2Group.add(soul2);
  }
}

function spawnSoul3() {
  if (frameCount % 200 === 0) {
    var soul3 = createSprite (200,-50);
    soul3.addImage(soul3Img);
    soul3.x = Math.round (random(displayWidth/4,displayWidth*3/4));
    soul3.velocityY =5;

    soul3.scale = 0.2;
    
    ghost.depth = soul3.depth;
    ghost.depth +=1;
    soul3.lifeTime = 800;
    soul3Group.add(soul3);
  }
}