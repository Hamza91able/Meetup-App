import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import coffee from './images/coffee.jpg';
import juice from './images/juice.jpg';
import cocktail from './images/cocktail.jpg';

const tileData = [
    {
        img: coffee,
        title: 'Coffee',
        author: 'Press to select',
    },
    {
        img: juice,
        title: 'Juice',
        author: 'Press to select',
    },
    {
        img: cocktail,
        title: 'Cocktail',
        author: 'Press to select',
    },
];

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
});

function TitlebarGridList(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList}>
                {tileData.map(tile => (
                    <GridListTile onClick={() => props.selectedDrinks(tile.title)} key={tile.img}>
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                            title={tile.title}
                            subtitle={<span>{tile.author}</span>}
                            actionIcon={
                                <IconButton className={classes.icon}>
                                    <AddIcon />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

TitlebarGridList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);