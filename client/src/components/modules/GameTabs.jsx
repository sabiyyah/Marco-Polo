import React, { Component } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

// Tab Components
import PublicGames from "./PublicGames";
import JoinGame from "./JoinGame";
import HostGame from "./HostGame";


export class GameTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
        };
    };

    toggle = (tab) => {
        if(this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        return (
            <>
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            <h1 style ={{color: "white"}}>Public</h1>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            <h1 style ={{color: "white"}}>Private</h1>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            <h1 style ={{color: "white"}}>Host</h1>
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            <div>
                <TabContent activeTab = {this.state.activeTab}>
                    <TabPane tabId="1">
                        <PublicGames />
                    </TabPane>
                    <TabPane tabId="2">
                        <JoinGame />
                    </TabPane>
                    <TabPane tabId="3">
                        <HostGame />
                    </TabPane>
                </TabContent>
            </div>
            </>
        )
    }
}

export default GameTabs