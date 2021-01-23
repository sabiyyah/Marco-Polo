import React, { Component } from "react";
import { socket } from "../../client-socket";
import { get, post } from "../../utilities";
import GameCanvas from "../modules/GameCanvas";
import { move } from "../../client-socket";
import { collisionManager, drawAllPlayers, drawCanvas, init } from "../../canvasManager";

import "./GamePage.css";

export class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      movement: {
        up: false,
        down: false,
        right: false,
        left: false,
      },
      position: {
        x: 0,
        y: 0,
      },
      powerup: {
        name: "Light Bomb",
        cooldown: "40 sec",
        ready: false,
      },
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    get("/api/whoami", {})
      .then((user) => {
        this.setState({ user: user });
      })
      .then(() => {
        get("/api/initialRender", { gameId: this.props.gameId })
          .then((res) => {
            this.processUpdate(res.initialRender);
            this.setState({ gameState: res.initialRender });
          })
          .then(() => {
            this.gameLoop();
            socket.on("update", (gameState) => {
              this.setState({ gameState: gameState });
            });
          });
      });
  }

  gameLoop = () => {
    requestAnimationFrame(() => {
      let tempState = this.state.gameState;
      this.state.updatePowerups();
      this.updatePosition();
      tempState.players[this.state.user._id].position = this.state.position;
      this.move();
      drawCanvas(this.state.gameState, this.state.user._id);
      this.gameLoop();
    });
  };

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    socket.off("update");
  }

  handleKeyDown = (event) => {
    switch (event.code) {
      case "KeyA": // A
        this.setState({ movement: { ...this.state.movement, left: true } });
        break;
      case "KeyW": // W
        this.setState({ movement: { ...this.state.movement, up: true } });
        break;
      case "KeyD": // D
        this.setState({ movement: { ...this.state.movement, right: true } });
        break;
      case "KeyS": // S
        this.setState({ movement: { ...this.state.movement, down: true } });
        break;
    }
  };

  handleKeyUp = (event) => {
    switch (event.code) {
      case "KeyA": // A
        this.setState({ movement: { ...this.state.movement, left: false } });
        break;
      case "KeyW": // W
        this.setState({ movement: { ...this.state.movement, up: false } });
        break;
      case "KeyD": // D
        this.setState({ movement: { ...this.state.movement, right: false } });
        break;
      case "KeyS": // S
        this.setState({ movement: { ...this.state.movement, down: false } });
        break;
    }
  };

  updateCooldowns = () => {};

  updatePosition() {
    let positionUpdate = { x: 0, y: 0 };
    const SPEED = 5;
    const dirMap = {
      up: ["y", 1],
      down: ["y", -1],
      right: ["x", 1],
      left: ["x", -1],
    };
    Object.keys(this.state.movement).map((dir, index) => {
      if (this.state.movement[dir]) {
        positionUpdate[dirMap[dir][0]] += SPEED * dirMap[dir][1];
      }
    });

    let newX = this.state.position.x;
    let newY = this.state.position.y;

    if (positionUpdate.x == 0 && positionUpdate.y == 0) {
      return;
    } else if (positionUpdate.x == 0 && positionUpdate.y !== 0) {
      newY = collisionManager(true, this.state.position.x, this.state.position.y, positionUpdate.y);
    } else if (positionUpdate.x !== 0 && positionUpdate.y == 0) {
      newX = collisionManager(
        false,
        this.state.position.x,
        this.state.position.y,
        positionUpdate.x
      );
    } else {
      newX = collisionManager(
        false,
        this.state.position.x,
        this.state.position.y,
        positionUpdate.x
      );
      newY = collisionManager(true, this.state.position.x, this.state.position.y, positionUpdate.y);
    }

    this.setState({
      position: {
        ...this.state.position,
        x: (this.state.position.x = newX),
        y: (this.state.position.y = newY),
      },
    });
  }

  /*
  handleInput = (event) => {
    switch (event.code) {
      case "KeyA": // A
        this.move("left");
        break;
      case "KeyW": // W
        this.move("up");
        break;
      case "KeyD": // D
        this.move("right");
        break;
      case "KeyS": // S
        this.move("down");
        break;
    }
  };
   */

  move = () => {
    //render movement for me
    move(this.state.user._id, this.props.gameId, this.state.position);
  };

  processUpdate = (gameState) => {
    drawCanvas(gameState, this.state.user._id);
  };

  render() {
    return (
      <div className="gamepage-base">
        <div className="gamepage-game-container">
          <div className="gamepage-header">Welcome to Marco Polo!</div>
          <div className="gamepage-canvas-container">
            <canvas
              id="game-canvas"
              width={window.innerWidth}
              height={window.innerHeight}
              className="gamepage-canvas"
            />
          </div>
          <button className="gamepage-ui-button gamepage-powerup-button">
            {this.state.powerup.ready ? this.state.powerup.name : this.state.powerup.cooldown}
          </button>
          <button className="gamepage-ui-button gamepage-tag-button">Tag</button>
        </div>
      </div>
    );
  }
}

export default GamePage;
