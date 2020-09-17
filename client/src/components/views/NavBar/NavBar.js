import React, { useState, useEffect } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import { Menu, Segment } from "semantic-ui-react";
import "./Sections/Navbar.css";
import '../../commons/Nav.css'

function NavBar() {
  const [visible, setVisible] = useState(false);

	const showDrawer = () => {
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
  };
  
  

	return (
		<nav
			className='menu'
			style={{
				position: "fixed",
				zIndex: 5,
				width: "100%",
				backgroundColor: "black",
			}}>
			<div className="menu__logo">
        <a href="/">
          <img className="ui small image" src="../logo.png" alt="logo"></img>
        </a>
      </div>
			<div className='menu__container'>
				<div className='menu_left'>
					<LeftMenu mode='horizontal' />
				</div>
				<div className='menu_rigth'>
					<RightMenu mode='horizontal' />
				</div>
				<Button
					className='menu__mobile-button'
					type='primary'
					onClick={showDrawer}>
					<Icon type='align-right' />
				</Button>
				<Drawer
					title='Basic Drawer'
					placement='right'
					className='menu_drawer'
					closable={false}
					onClose={onClose}
					visible={visible}>
					<LeftMenu mode='inline' />
					<RightMenu mode='inline' />
				</Drawer>
			</div>
		</nav>
	);
}

export default NavBar;
