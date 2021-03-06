import React, { Component } from "react";
import { get, post } from "../../../utilities";
import { socket } from "../../../client-socket";

import "./PublicTable.css";

export class PublicTable extends Component {
  constructor(props) {
    super(props);
    this.state = { lobbies: [], user: undefined };
  }

  updateLobbies = () => {
    get("/api/lobbies", {})
      .then((lobbies) => {
        this.setState({ lobbies: lobbies.lobbies });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.updateLobbies();
    get("/api/whoami", {}).then((user) => {
      this.setState({ user: user });
    });
    socket.on("updateLobbiesAll", () => {
      this.updateLobbies();
    });
  }

  componentDidUpdate() {
    if (!this.state.user) {
      get("/api/whoami", {}).then((user) => {
        this.setState({ user: user });
      });
    }
  }

  componentWillUnmount() {
    socket.off("updateLobbiesAll");
  }

  render() {
    return (
      <>
        <div>
          <table>
            <thead>
              <tr className="publictable-headers">
                <th style={{ width: "50%" }}>Name</th>
                <th style={{ width: "30%" }}>Creator</th>
                <th style={{ width: "20%", textAlign: "center" }}>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {this.state.lobbies.map((lobby, index) => (
                <tr
                  className={`publictable-table-row ${
                    this.props.gameId === lobby.gameId ? "publictable-table-row-active" : ""
                  }`}
                  key={index}
                  onClick={() => this.props.changeGameId(lobby.gameId)}
                >
                  <td style={{ width: "50%" }}>{lobby.name}</td>
                  <td style={{ width: "30%" }}>{lobby.creator}</td>
                  <td style={{ width: "20%", textAlign: "center" }}>
                    {lobby.numberJoined + "/" + lobby.capacity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default PublicTable;
