import React, { FunctionComponent, memo } from 'react';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const TextField: FunctionComponent<
    FieldProps & InjectedFieldProps & TypographyProps
> = ({ className, source, record = {}, emptyText, ...rest }) => {
    const value = get(record, source);

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {value != null && typeof value !== 'string'
                ? JSON.stringify(value)
                : value || emptyText}
        </Typography>
    );
};

// what? TypeScript looses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';

const EnhancedTextField = memo<FieldProps & TypographyProps>(TextField);
// @ts-ignore
EnhancedTextField.defaultProps = {
    addLabel: true,
};
// @ts-ignore
EnhancedTextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
};

EnhancedTextField.displayName = 'EnhancedTextField';

export default EnhancedTextField;
