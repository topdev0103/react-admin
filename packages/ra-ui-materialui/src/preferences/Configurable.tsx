import * as React from 'react';
import { useRef, useEffect, cloneElement, ReactElement } from 'react';
import { usePreferencesEditor } from 'ra-core';
import { alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import { InspectorButton } from './InspectorButton';

/**
 * Wrap any component with this component to make it configurable
 *
 * When the edit mode is enabled, users will see a button to edit the component;
 * when clicked, the inspector will show the editor element.
 *
 * The child component must forward its ref to the root DOM element
 *
 * @example
 * const ConfigurableTextBlock = (props) => (
 *     <Configurable editor={<TextBlockInspector />}>
 *         <TextBlock {...props} />
 *     </Configurable>
 * );
 *
 * @example // with preferenceKey (allows more than one editor of that type per page)
 * const ConfigurableTextBlock = ({ preferenceKey, ...props }) => (
 *     <Configurable editor={<TextBlockInspector />} preferenceKey={preferenceKey}>
 *         <TextBlock {...props} />
 *     </Configurable>
 * );
 */
export const Configurable = (props: ConfigurableProps) => {
    const {
        children,
        editor,
        preferenceKey,
        openButtonLabel = 'ra.configurable.customize',
    } = props;
    const ref = useRef(null);
    const rect = ref.current?.getBoundingClientRect();

    const preferencesEditorContext = usePreferencesEditor();
    const hasPreferencesEditorContext = !!preferencesEditorContext;

    const {
        isEnabled,
        editor: currentEditor,
        setEditor,
        preferenceKey: currentPreferenceKey,
        setPreferenceKey,
    } = preferencesEditorContext || {};

    const isEditorOpen = preferenceKey
        ? preferenceKey === currentPreferenceKey
        : editor === currentEditor;

    useEffect(() => {
        // on unmount, remove the editor
        return hasPreferencesEditorContext && isEditorOpen
            ? () => {
                  setEditor(null);
                  setPreferenceKey(null);
              }
            : undefined;
    }, [
        hasPreferencesEditorContext,
        isEditorOpen,
        setEditor,
        setPreferenceKey,
    ]);

    if (!hasPreferencesEditorContext) {
        return children;
    }

    const handleOpenEditor = () => {
        if (preferenceKey) {
            // include the editorKey as key to force destroy and mount
            // when switching between two identical editors with different editor keys
            // otherwise the editor will see an update and its useStore will return one tick later
            // which would forbid the usage of uncontrolled inputs ion the editor
            setEditor(
                cloneElement(editor, { preferenceKey, key: preferenceKey })
            );
            // as we modify the editor, isEditorOpen cannot compare the editor element
            // we'll compare the editor key instead
            setPreferenceKey(preferenceKey);
        } else {
            setEditor(editor);
        }
    };

    return (
        <Root
            className={clsx(
                isEnabled && ConfigurableClasses.editMode,
                isEditorOpen && ConfigurableClasses.editorActive
            )}
        >
            {preferenceKey
                ? cloneElement(children, { ref, preferenceKey })
                : cloneElement(children, { ref })}
            {isEnabled && (
                <InspectorButton
                    onClick={handleOpenEditor}
                    label={openButtonLabel}
                    size="small"
                    color="warning"
                    className={ConfigurableClasses.button}
                    sx={{
                        left: rect?.right - 30,
                        top: rect?.top,
                    }}
                    SvgIconProps={{
                        sx: {
                            filter:
                                'drop-shadow(0 0 3px rgba(255, 255, 255, .8))',
                        },
                    }}
                />
            )}
        </Root>
    );
};

export interface ConfigurableProps {
    children: ReactElement;
    editor: ReactElement;
    preferenceKey?: string;
    openButtonLabel?: string;
}

const PREFIX = 'RaConfigurable';

export const ConfigurableClasses = {
    editMode: `${PREFIX}-editMode`,
    button: `${PREFIX}-button`,
    editorActive: `${PREFIX}-editorActive`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ConfigurableClasses.button}`]: {
        display: 'none',
    },
    [`&.${ConfigurableClasses.editMode}:hover > .${ConfigurableClasses.button}`]: {
        display: 'block',
        position: 'absolute',
        zIndex: theme.zIndex.modal - 1,
    },
    [`&.${ConfigurableClasses.editMode} > :not(.${ConfigurableClasses.button})`]: {
        transition: theme.transitions.create('outline'),
        outline: `${alpha(theme.palette.warning.main, 0.3)} solid 2px`,
    },
    [`&.${ConfigurableClasses.editMode}:hover > :not(.${ConfigurableClasses.button})`]: {
        outline: `${alpha(theme.palette.warning.main, 0.5)} solid 2px`,
    },

    [`&.${ConfigurableClasses.editMode}.${ConfigurableClasses.editorActive} > :not(.${ConfigurableClasses.button}), &.${ConfigurableClasses.editMode}.${ConfigurableClasses.editorActive}:hover > :not(.${ConfigurableClasses.button})`]: {
        outline: `${theme.palette.warning.main} solid 2px`,
    },
}));
