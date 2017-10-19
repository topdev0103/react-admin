import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Button from 'material-ui/Button';
import ContentAdd from 'material-ui-icons/Add';
import Hidden from 'material-ui/Hidden';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';

import translate from '../../i18n/translate';

const styles = {
    floating: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 60,
        left: 'auto',
        position: 'fixed',
    },
    mobileLink: {
        color: 'white',
    },
    desktopLink: {
        display: 'inline-flex',
        alignItems: 'center',
    },
};

const CreateButton = ({
    basePath = '',
    classes = {},
    translate,
    label = 'ra.action.create',
}) => [
    <Hidden smUp key="mobile">
        <Button fab color="primary" className={classes.floating}>
            <Link to={`${basePath}/create`} className={classes.mobileLink}>
                <ContentAdd />
            </Link>
        </Button>
    </Hidden>,
    <Hidden xsDown key="destkop">
        <Button color="primary">
            <Link to={`${basePath}/create`} className={classes.desktopLink}>
                <ContentAdd />
                &nbsp;
                {label && translate(label)}
            </Link>
        </Button>
    </Hidden>,
];

CreateButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    onlyUpdateForKeys(['basePath', 'label']),
    withStyles(styles),
    translate
);

export default enhance(CreateButton);
