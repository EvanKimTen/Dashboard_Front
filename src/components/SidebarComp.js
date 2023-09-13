
import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";


const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <Tooltip title={title} placement="right" arrow >
      <div>
        <MenuItem
          active={selected === title}
          onClick={() => setSelected(title)}
          icon={icon}
          component={<Link to={to} />}
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
            color: "#5560b5",
          },
          "& .ps-active": {
            color: "#5560b5",
          },
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
            }}
          >
          </MenuItem>


          <Box >
            <Item
              title="Analytics"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Transcript"
              to="/transcript"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Knowledge Base"
              to="/knowledge-base"
              icon={<ContactsOutlinedIcon />}
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