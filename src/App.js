import React from 'react';
import "bulma";
import { HashRouter, NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faPrint } from "@fortawesome/free-solid-svg-icons";
import './App.scss';
import ToolsRouter from "./components/router";

function App() {
  return (
    <HashRouter>
      <nav className="navbar is-light" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="#/">
            <FontAwesomeIcon icon={faSchool} className="margin-right-s" />
            <strong>World History Teacher Tools</strong>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">

            <div className="navbar-item">
              <NavLink to="/pace">
                Pace Planner
              </NavLink>
            </div>
          </div>

          <div className="navbar-end">
            <button className="button is-info margin-xs" onClick={() => window.print() }>
              <FontAwesomeIcon icon={faPrint} className="margin-right-xs" />
              Print
            </button>
          </div>
        </div>
      </nav>
      <ToolsRouter />
    </HashRouter>
  );
}

export default App;
