
import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <Tooltip title={title} placement="right" arrow >
      <div>
        <MenuItem
          active={selected === title}
          onClick={() => setSelected(title)}
          icon={icon}
          component={<Link to={to} />}
          className="nav-icon"
        >
          <Typography>{title}</Typography>
        </MenuItem>
      </div>
    </Tooltip>
  );
};

const SidebarComp = () => {
  const [selected, setSelected] = useState(localStorage.getItem('selectedItem') || 'Analytics');

  useEffect(() => {
    localStorage.setItem('selectedItem', selected);
  }, [selected]);

  return (
    <Box
    position="fixed"
    sx={{
          "& .ps-sidebar-root": {
            height:"100vh"
          },
          "& .ps-sidebar-container": {
            backgroundColor: "#FFFFFF !important",
          },
          "& .ps-menuitem-root:hover": {
            color: "#7583e0e7",
          },
          "& .ps-active": {
            color: "#7583e0e7",
          },
          borderRight: "0.5px solid grey"
        }}
    >
      <Sidebar collapsed={true}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            icon={ <MenuOutlinedIcon />}
            style={{
              margin: "10px 0 20px 0",
              color: "#141414",
              borderBottom: "0.5px solid grey"
            }}
          >
          </MenuItem>


          <Box >
            <Item
              title="Analytics"
              to="/"
              icon={<ShowChartRoundedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Transcript"
              to="/transcript"
              icon={<SmsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Knowledge Base"
              to="/knowledge-base"
              icon={<SmartToyOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarComp;