import React, { Component } from 'react'

class Navbar extends Component {

    constructor(props) {
        super(props)

        this.account = this.props.account
    }


    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="http://www.dappuniversity.com/bootcamp"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        SOUK | DeFi marketplace
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white"><span id="account">{this.account}</span></small>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Navbar
