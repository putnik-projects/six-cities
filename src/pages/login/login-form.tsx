import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { useTypedDispatch, useTypedSelector } from '../../hooks';
import { authStatusSelector, login } from '../../store/slices/user';
import { AuthStatus } from '../../helpers/enum';

const passwordRegex = /(?=.*?[0-9])(?=.*?[A-Za-z]).+/;
const PASSWORD_REGEX_ERROR_TEXT = 'Password must at least one digit and one number';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const EMAIL_REGEX_ERROR_TEXT = 'Email must be correct';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authLoadingStatus = useTypedSelector(authStatusSelector);
  const isLoading = authLoadingStatus === AuthStatus.LOADING;
  const dispatch = useTypedDispatch();

  function handleLoginInputChange({ target }: ChangeEvent<HTMLInputElement>) {
    setEmail(target.value);
  }

  function handlePasswordInputChange({ target }: ChangeEvent<HTMLInputElement>) {
    setPassword(target.value);
  }

  function handleFormSubmit(evt: FormEvent<Element>) {
    evt.preventDefault();

    if (!password.match(passwordRegex)) {
      toast.error(PASSWORD_REGEX_ERROR_TEXT);
      return;
    }

    if (!email.match(emailRegex)) {
      toast.error(EMAIL_REGEX_ERROR_TEXT);
      return;
    }

    dispatch(login({ email, password }));
  }

  return (
    <form className="login__form form" action="#" method="post" onSubmit={handleFormSubmit}>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">E-mail</label>
        <input
          className="login__input form__input"
          value={email}
          onChange={handleLoginInputChange}
          type="email"
          name="email"
          placeholder="Email"
          required
          disabled={isLoading}
        />
      </div>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">Password</label>
        <input
          className="login__input form__input"
          value={password}
          onChange={handlePasswordInputChange}
          type="password"
          name="password"
          placeholder="Password"
          required
          disabled={isLoading}
        />
      </div>
      <button className="login__submit form__submit button" type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign in'}
      </button>
    </form>
  );
}

export default LoginForm;
