import React, { Component } from 'react';
import { initValues } from './initValue';
import { validateEmail } from '../utils';

export default function Wrapper(WrappedComponent) {
    return class Wrapper extends Component {
        state = {
            isFetching: false,
            data: initValues,
            errors: {}
        };

        handleInput = e => {
            const { name, value } = e.currentTarget;
            this.setState(({ data, errors }) => ({
                data: {
                    ...data,
                    [name]: value
                },
                errors: {
                    ...errors,
                    [name]: false
                }
            }));
        };

        handleSubmit = e => {
            e.preventDefault();
            const { data } = this.state;
        };

        handleBlur = e => {
            const { value, name } = e.currentTarget;
            this.validateForm(name, value);
        };

        validateForm = (name, value) => {
            switch (true) {
                case name === 'email' && this.isNotEmptyValue(name, value):
                    if (!validateEmail(value)) {
                        this.setState(({ errors }) => ({
                            errors: {
                                ...errors,
                                [name]: 'введите валидный email'
                            }
                        }));
                        return false;
                    }
                    return true;
                case name === 'confirmPassword' && this.isNotEmptyValue(name, value):
                    const {
                        data: { password, confirmPassword }
                    } = this.state;
                    if (password !== confirmPassword) {
                        this.setState(({ errors }) => ({
                            errors: {
                                ...errors,
                                [name]: 'введённые пароли не совпадают'
                            }
                        }));
                        return false;
                    }
                    return true;
                default:
                    return this.isNotEmptyValue(name, value);
            }
        };

        isNotEmptyValue = (name, value) => {
            if (!value.trim()) {
                this.setState(({ errors }) => ({
                    errors: {
                        ...errors,
                        [name]: 'поле не должно быть пустым'
                    }
                }));
                return false;
            }
            return true;
        };

        render() {
            return (
                <WrappedComponent
                    {...this.state}
                    {...this.props}
                    handleSubmit={this.handleSubmit}
                    handleBlur={this.handleBlur}
                    handleInput={this.handleInput}
                />
            );
        }
    };
}
