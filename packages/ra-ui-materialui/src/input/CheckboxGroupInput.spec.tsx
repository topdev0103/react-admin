import React from 'react';
import expect from 'expect';
import CheckboxGroupInput from './CheckboxGroupInput';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { renderWithRedux, TranslationProvider } from 'ra-core';

describe('<CheckboxGroupInput />', () => {
    const defaultProps = {
        source: 'tags',
        resource: 'posts',
        choices: [{ id: 'ang', name: 'Angular' }, { id: 'rct', name: 'React' }],
    };

    afterEach(cleanup);

    it('should render choices as checkbox components', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <CheckboxGroupInput {...defaultProps} />}
            />
        );
        const input1 = getByLabelText('Angular');
        expect(input1.type).toBe('checkbox');
        expect(input1.value).toBe('ang');
        expect(input1.checked).toBe(false);
        const input2 = getByLabelText('React');
        expect(input2.type).toBe('checkbox');
        expect(input2.value).toBe('rct');
        expect(input2.checked).toBe(false);
    });

    it('should use the input parameter value as the initial input value', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    tags: ['ang'],
                }}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        choices={[
                            { id: 'ang', name: 'Angular' },
                            { id: 'rct', name: 'React' },
                        ]}
                    />
                )}
            />
        );
        const input1 = getByLabelText('Angular');
        expect(input1.checked).toEqual(true);
        const input2 = getByLabelText('React');
        expect(input2.checked).toEqual(false);
    });

    it('should use optionValue as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[{ foobar: 'foo', name: 'Bar' }]}
                    />
                )}
            />
        );
        expect(getByLabelText('Bar').value).toBe('foo');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[{ foobar: { id: 'foo' }, name: 'Bar' }]}
                    />
                )}
            />
        );
        expect(getByLabelText('Bar').value).toBe('foo');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[{ id: 'foo', foobar: { name: 'Bar' } }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => (
            <span data-testid="label">{record.foobar}</span>
        );
        const { queryByLabelText, queryByTestId } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText={<Foobar />}
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
        expect(queryByTestId('label')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        const { queryByLabelText } = render(
            <TranslationProvider
                i18nProvider={() => ({
                    Angular: 'Angular **',
                    React: 'React **',
                })}
            >
                <Form
                    onSubmit={jest.fn}
                    render={() => <CheckboxGroupInput {...defaultProps} />}
                />
            </TranslationProvider>
        );
        expect(queryByLabelText('Angular **')).not.toBeNull();
        expect(queryByLabelText('React **')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { queryByLabelText } = render(
            <TranslationProvider
                i18nProvider={() => ({
                    Angular: 'Angular **',
                    React: 'React **',
                })}
            >
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <CheckboxGroupInput
                            {...defaultProps}
                            translateChoice={false}
                        />
                    )}
                />
            </TranslationProvider>
        );
        expect(queryByLabelText('Angular **')).toBeNull();
        expect(queryByLabelText('React **')).toBeNull();
        expect(queryByLabelText('Angular')).not.toBeNull();
        expect(queryByLabelText('React')).not.toBeNull();
    });

    it('should display helperText', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                )}
            />
        );
        expect(queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { container } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => <CheckboxGroupInput {...defaultProps} />}
                />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { container } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => <CheckboxGroupInput {...defaultProps} />}
                />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            const { queryByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={validate}
                        />
                    )}
                />
            );
            const input = queryByLabelText('Angular');
            fireEvent.click(input);
            expect(input.checked).toBe(true);

            fireEvent.blur(input);
            expect(queryByText('ra.validation.error')).not.toBeNull();
        });
    });
});
