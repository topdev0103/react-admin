import React, { useState, useEffect } from 'react';
import expect from 'expect';
import { render, cleanup, wait } from '@testing-library/react';

import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import AuthContext from './AuthContext';
import useLogout from './useLogout';
import useNotify from '../sideEffect/useNotify';

jest.mock('./useLogout');
jest.mock('../sideEffect/useNotify');

const logout = jest.fn();
useLogout.mockImplementation(() => logout);
const notify = jest.fn();
useNotify.mockImplementation(() => notify);

const TestComponent = ({ error }: { error?: any }) => {
    const [loggedOut, setLoggedOut] = useState(false);
    const logoutIfAccessDenied = useLogoutIfAccessDenied();
    useEffect(() => {
        logoutIfAccessDenied(error).then(setLoggedOut);
    }, [error, logoutIfAccessDenied]);
    return <div>{loggedOut ? '' : 'logged in'}</div>;
};

const authProvider = (type, params) =>
    new Promise((resolve, reject) => {
        if (type !== 'AUTH_ERROR') reject('bad method');
        if (params instanceof Error && params.message == 'denied') {
            reject(new Error('logout'));
        }
        resolve();
    });

describe('useLogoutIfAccessDenied', () => {
    afterEach(cleanup);

    it('should not logout if passed no error', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(0);
        expect(notify).toHaveBeenCalledTimes(0);
        expect(queryByText('logged in')).not.toBeNull();
    });

    it('should not log out if passed an error that does not make the authProvider throw', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error()} />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(0);
        expect(notify).toHaveBeenCalledTimes(0);
        expect(queryByText('logged in')).not.toBeNull();
    });

    it('should logout if passed an error that makes the authProvider throw', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error('denied')} />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledTimes(1);
        expect(queryByText('logged in')).toBeNull();
    });
});
