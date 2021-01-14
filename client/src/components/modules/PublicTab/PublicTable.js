import React, { Component } from "react";
import { get, post } from "../../../utilities";

import "./PublicTable.css";

export class PublicTable extends Component {
  constructor(props) {
    super(props);
    this.state = { lobbies: { lobbies: [] } };
  }

  componentDidMount() {
    get("/api/lobbies", {}).then((lobbies) => {
      console.log(lobbies);
      this.setState({ lobbies: lobbies });
    });
  }

  render() {
    return (
      <>
        <div>
          <table>
            <tr className="publictable-headers">
              <th style={{ width: "50%" }}>Name</th>
              <th style={{ width: "30%" }}>Creator</th>
              <th style={{ width: "20%", textAlign: "center" }}>Capacity</th>
            </tr>
            {Object.keys(this.state.lobbies.lobbies).map((lobby, index) => (
              <tr
                className={`publictable-table-row ${
                  this.props.gameId === lobby.gameId
                    ? "publictable-table-row-active"
                    : ""
                }`}
                key={index}
                onClick={() => this.props.changeGameId(lobby.gameId)}
              >
                <td style={{ width: "50%" }}>{lobby.name}</td>
                <td style={{ width: "30%" }}>{lobby.creator}</td>
                <td style={{ width: "20%", textAlign: "center" }}>
                  {lobby.numberJoined +
                    "/" +
                    lobby.capacity}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </>
    );
  }
}

export default PublicTable;
