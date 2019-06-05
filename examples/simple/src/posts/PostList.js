import BookIcon from '@material-ui/icons/Book';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import React, { Children, Fragment, cloneElement } from 'react';
import {
    BooleanField,
    BulkDeleteButton,
    ChipField,
    Datagrid,
    DateField,
    EditButton,
    Filter,
    List,
    NumberField,
    ReferenceArrayField,
    Responsive,
    SearchInput,
    ShowButton,
    SimpleList,
    SingleFieldList,
    TextField,
    TextInput,
    useTranslate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import ResetViewsButton from './ResetViewsButton';
export const PostIcon = BookIcon;

const QuickFilter = ({ label }) => {
    const translate = useTranslate();
    return <Chip style={{ marginBottom: 8 }} label={translate(label)} />;
};

const PostFilter = props => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <TextInput
            source="title"
            defaultValue="Qui tempore rerum et voluptates"
        />
        <QuickFilter
            label="resources.posts.fields.commentable"
            source="commentable"
            defaultValue
        />
    </Filter>
);

const useStyles = makeStyles(theme => ({
    title: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    hiddenOnSmallScreens: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    publishedAt: { fontStyle: 'italic' },
}));

const PostListBulkActions = props => (
    <Fragment>
        <ResetViewsButton {...props} />
        <BulkDeleteButton {...props} />
    </Fragment>
);

const usePostListActionToolbarStyles = makeStyles({
    toolbar: {
        alignItems: 'center',
        display: 'flex',
    },
});

const PostListActionToolbar = ({ children, ...props }) => {
    const classes = usePostListActionToolbarStyles();
    return (
        <div className={classes.toolbar}>
            {Children.map(children, button => cloneElement(button, props))}
        </div>
    );
};

const rowClick = (id, basePath, record) => {
    if (record.commentable) {
        return 'edit';
    }

    return 'show';
};

const PostPanel = ({ id, record, resource }) => (
    <div dangerouslySetInnerHTML={{ __html: record.body }} />
);

const PostList = props => {
    const classes = useStyles();
    return (
        <List
            {...props}
            bulkActionButtons={<PostListBulkActions />}
            filters={<PostFilter />}
            sort={{ field: 'published_at', order: 'DESC' }}
        >
            <Responsive
                small={
                    <SimpleList
                        primaryText={record => record.title}
                        secondaryText={record => `${record.views} views`}
                        tertiaryText={record =>
                            new Date(record.published_at).toLocaleDateString()
                        }
                    />
                }
                medium={
                    <Datagrid rowClick={rowClick} expand={<PostPanel />}>
                        <TextField source="id" />
                        <TextField
                            source="title"
                            cellClassName={classes.title}
                        />
                        <DateField
                            source="published_at"
                            cellClassName={classes.publishedAt}
                        />

                        <BooleanField
                            source="commentable"
                            label="resources.posts.fields.commentable_short"
                            sortable={false}
                        />
                        <NumberField source="views" />
                        <ReferenceArrayField
                            label="Tags"
                            reference="tags"
                            source="tags"
                            sortBy="tags.name"
                            cellClassName={classes.hiddenOnSmallScreens}
                            headerClassName={classes.hiddenOnSmallScreens}
                        >
                            <SingleFieldList>
                                <ChipField source="name" />
                            </SingleFieldList>
                        </ReferenceArrayField>
                        <PostListActionToolbar>
                            <EditButton />
                            <ShowButton />
                        </PostListActionToolbar>
                    </Datagrid>
                }
            />
        </List>
    );
};

export default PostList;
