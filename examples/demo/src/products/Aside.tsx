import * as React from 'react';
import { FC } from 'react';
import inflection from 'inflection';
import { Card, CardContent, makeStyles } from '@material-ui/core';
import LocalOfferIcon from '@material-ui/icons/LocalOfferOutlined';
import BarChartIcon from '@material-ui/icons/BarChart';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import {
    FilterList,
    FilterListItem,
    FilterLiveSearch,
    useGetList,
} from 'react-admin';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            order: -1,
            width: '15em',
            marginRight: '1em',
            overflow: 'initial',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}));

const Aside: FC = () => {
    const { data, ids } = useGetList(
        'categories',
        { page: 1, perPage: 100 },
        { field: 'name', order: 'ASC' }
    );
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>
                <FilterLiveSearch />

                <FilterList
                    label="resources.products.filters.sales"
                    icon={<AttachMoneyIcon />}
                >
                    <FilterListItem
                        label="resources.products.filters.best_sellers"
                        value={{
                            sales_lte: undefined,
                            sales_gt: 25,
                            sales: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.average_sellers"
                        value={{
                            sales_lte: 25,
                            sales_gt: 10,
                            sales: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.low_sellers"
                        value={{
                            sales_lte: 10,
                            sales_gt: 0,
                            sales: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.never_sold"
                        value={{
                            sales_lte: undefined,
                            sales_gt: undefined,
                            sales: 0,
                        }}
                    />
                </FilterList>

                <FilterList
                    label="resources.products.filters.stock"
                    icon={<BarChartIcon />}
                >
                    <FilterListItem
                        label="resources.products.filters.enough_stock"
                        value={{
                            stock_lte: undefined,
                            stock_gt: 10,
                            stock: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.low_stock"
                        value={{
                            stock_lte: 10,
                            stock_gt: 0,
                            stock: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.no_stock"
                        value={{
                            stock_lte: undefined,
                            stock_gt: undefined,
                            stock: 0,
                        }}
                    />
                </FilterList>

                <FilterList
                    label="resources.products.filters.categories"
                    icon={<LocalOfferIcon />}
                >
                    {ids.map((id: any) => (
                        <FilterListItem
                            label={inflection.humanize(data[id].name)}
                            key={data[id].id}
                            value={{ category_id: data[id].id }}
                        />
                    ))}
                </FilterList>
            </CardContent>
        </Card>
    );
};

export default Aside;
