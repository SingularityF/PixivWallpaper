import React from 'react';
import {
  Drawer,
  IconButton,
  ListItem,
  List,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Speed, Settings, FormatListNumbered } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import styles from './Navbar.css';
import GlobalStyles from '../../constants/styles.json';

const drawerWidth = GlobalStyles.navWidth;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    paddingTop: 25,
  },
}));

export default function Navbar() {
  const classes = useStyles();
  return (
    <nav className={classes.drawer}>
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="permanent"
      >
        <List>
          <Link to="/" className={styles.links}>
            <ListItem button>
              <ListItemIcon>
                <Speed />
              </ListItemIcon>
              <ListItemText primary="Dashboard"></ListItemText>
            </ListItem>
          </Link>
          <Link to="/ranking" className={styles.links}>
            <ListItem button>
              <ListItemIcon>
                <FormatListNumbered />
              </ListItemIcon>
              <ListItemText primary="Ranking" />
            </ListItem>
          </Link>
          <Link to="/settings" className={styles.links}>
            <ListItem button>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </nav>
  );
}
