import LogoutButton from "./LogoutButton.tsx";
import {NavLink} from "react-router-dom";
import logo from "../assets/logo/logo_navbar.png";

function NavBarClient() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container-fluid">
                <div className="navbar-brand">
                    <img
                        src={logo}
                        alt="BookIT"
                        style={{height: 30, marginRight: 8}}
                    />
                    BookIT
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="clientNavbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/salons">
                                Salons
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/my_bookings">
                                My Bookings
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/loyalty-points">
                                Loyalty Points
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/ai-chat">
                                AI Assistant
                            </NavLink>
                        </li>
                    </ul>

                    <div className="d-flex">
                        <LogoutButton/>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBarClient;