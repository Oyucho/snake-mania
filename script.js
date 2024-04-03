document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;
    let snake;
    let fruit;
    let score = 0;
    let topScores = [];
  
    // Load top scores from local storage or initialize if empty
    if (localStorage.getItem('topScores')) {
      topScores = JSON.parse(localStorage.getItem('topScores'));
    } else {
      topScores = Array(10).fill(0);
    }
  
    function saveTopScores() {
      localStorage.setItem('topScores', JSON.stringify(topScores));
    }
  
    function updateScore() {
      document.querySelector('.score').innerText = score;
    }
  
    function updateTopScores() {
      const topScoresList = document.querySelector('.top-scores');
      topScoresList.innerHTML = '';
      topScores.forEach((topScore, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${index + 1}. ${topScore}`;
        topScoresList.appendChild(listItem);
      });
    }
  
    function gameOver() {
      // Update top scores
      topScores.push(score);
      topScores.sort((a, b) => b - a);
      topScores = topScores.slice(0, 10);
      saveTopScores();
      updateTopScores();
  
      // Display game over message
      ctx.fillStyle = '#333';
      ctx.font = '30px Arial';
      ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
      ctx.font = '20px Arial';
      ctx.fillText('Mean Score: ' + calculateMeanScore(), canvas.width / 2 - 100, canvas.height / 2 + 30);
    }
  
    function calculateMeanScore() {
      const sum = topScores.reduce((acc, cur) => acc + cur, 0);
      return sum / topScores.length;
    }
  
    (function setup() {
      snake = new Snake();
      fruit = new Fruit();
      fruit.pickLocation();
  
      window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();
  
        if (snake.eat(fruit)) {
          fruit.pickLocation();
          score++;
          updateScore();
        }
  
        snake.checkCollision();
      }, 250);
    }());
  
    window.addEventListener('keydown', (evt) => {
      const direction = evt.key.replace('Arrow', '');
      snake.changeDirection(direction);
    });
  
    function Snake() {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale * 1;
      this.ySpeed = 0;
      this.total = 0;
      this.tail = [];
  
      this.draw = function() {
        // Draw snake tail
        ctx.fillStyle = '#00FF00';
        for (let i = 0; i < this.tail.length; i++) {
          ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
  
        // Draw snake head
        ctx.fillStyle = '#33CCCC';
        ctx.fillRect(this.x, this.y, scale, scale);
      };
  
      this.update = function() {
        // Move snake tail
        for (let i = 0; i < this.tail.length - 1; i++) {
          this.tail[i] = this.tail[i + 1];
        }
  
        this.tail[this.total - 1] = { x: this.x, y: this.y };
  
        // Move snake head
        this.x += this.xSpeed;
        this.y += this.ySpeed;
  
        // Wrap around canvas edges
        if (this.x >= canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width - scale;
        }
  
        if (this.y >= canvas.height) {
          this.y = 0;
        } else if (this.y < 0) {
          this.y = canvas.height - scale;
        }
      };
  
      this.changeDirection = function(direction) {
        switch (direction) {
          case 'Up':
            if (this.ySpeed !== scale * 1) {
              this.xSpeed = 0;
              this.ySpeed = -scale * 1;
            }
            break;
          case 'Down':
            if (this.ySpeed !== -scale * 1) {
              this.xSpeed = 0;
              this.ySpeed = scale * 1;
            }
            break;
          case 'Left':
            if (this.xSpeed !== scale * 1) {
              this.xSpeed = -scale * 1;
              this.ySpeed = 0;
            }
            break;
          case 'Right':
            if (this.xSpeed !== -scale * 1) {
              this.xSpeed = scale * 1;
              this.ySpeed = 0;
            }
            break;
        }
      };
  
      this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
          this.total++;
          return true;
        }
        return false;
      };
  
      this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
          if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
            score = 0;
            updateScore();
            this.total = 0;
            this.tail = [];
            gameOver();
          }
        }
      };
    }
  
    function Fruit() {
      this.x;
      this.y;
  
      this.pickLocation = function() {
        this.x = Math.floor(Math.random() * columns) * scale;
        this.y = Math.floor(Math.random() * rows) * scale;
      };
  
      this.draw = function() {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y, scale, scale);
      };
    }
  
    // Initialize score display
    updateScore();
    updateTopScores();
  });
  