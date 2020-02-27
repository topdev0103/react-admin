import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import assert from 'assert';

import RoutesWithLayout from './RoutesWithLayout';

describe('<RoutesWithLayout>', () => {
    afterEach(cleanup);

    const Dashboard = () => <div>Dashboard</div>;
    const Custom = ({ name }) => <div>Custom</div>;
    const FirstResource = ({ name }) => <div>Default</div>;
    const Resource = ({ name }) => <div>Resource</div>;

    // the Provider is required because the dashboard is wrapped by <Authenticated>, which is a connected component
    const store = createStore(() => ({
        admin: {},
        router: { location: { pathname: '/' } },
    }));

    it('should show dashboard on / when provided', () => {
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout dashboard={Dashboard}>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        assert.notEqual(queryByText('Dashboard'), null);
    });

    it('should show the first resource on / when there is only one resource and no dashboard', () => {
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout>
                        <FirstResource name="default" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        assert.notEqual(queryByText('Default'), null);
    });

    it('should show the first resource on / when there are multiple resource and no dashboard', () => {
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        assert.notEqual(queryByText('Default'), null);
        assert.equal(queryByText('Resource'), null);
    });

    it('should accept custom routes', () => {
        const customRoutes = [
            <Route key="custom" path="/custom" component={Custom} />,
        ]; // eslint-disable-line react/jsx-key
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <RoutesWithLayout customRoutes={customRoutes}>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );
        assert.notEqual(queryByText('Custom'), null);
    });
});
