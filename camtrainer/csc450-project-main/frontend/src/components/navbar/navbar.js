import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "@mui/material";
import { NavLink } from "react-router-dom";
import Home from "../../pages/home";

const pages = ["workout", "statistics"];
const settings = ["profile", "logout"];

function Navbar() {
  const [nav, setNav] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setNav(null);
  };

  const handleCloseUserMenu = () => {
    setUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0b2a3b" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavLink to="/home">
            <Avatar src="favicon2.ico" sx={{ width: 60, height: 60 }} />
          </NavLink>
          <Typography
            variant="h6"
            noWrap
            component="a"
            style={{ marginLeft: "10px" }}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Arial",
              fontWeight: 700,
              letterSpacing: ".05rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            CamTrainer
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={nav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(nav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            CamTrainer
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <NavLink
                to={`/${page}`}
                style={{ textDecoration: "none" }}
                color="inherit"
              >
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              </NavLink>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="USER" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={user}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(user)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <NavLink
                  to={`/${setting}`}
                  style={{
                    textDecoration: "none",
                    textTransform: "capitalize",
                  }}
                  color="inherit"
                >
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
