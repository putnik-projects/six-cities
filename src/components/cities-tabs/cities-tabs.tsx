import { SyntheticEvent } from 'react';
import classNames from 'classnames';

import { CityName } from '../../helpers/enum';
import { useTypedDispatch, useTypedSelector } from '../../hooks';
import { activeCityChanged, activeCitySelector } from '../../store/slices/offers';

function CitiesTabs() {
  const activeCity = useTypedSelector(activeCitySelector);
  const dispatch = useTypedDispatch();

  const handleLinkClick = (city: CityName) => (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(activeCityChanged(city));
  };

  return (
    <>
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <section className="locations container">
          <ul className="locations__list tabs__list">
            {Object.values(CityName).map((city) => (
              <li key={city} className="locations__item">
                <a
                  onClick={handleLinkClick(city)}
                  className={classNames('locations__item-link', 'tabs__item', {
                    'tabs__item--active': activeCity === city,
                  })}
                  href="/"
                >
                  <span>{city}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default CitiesTabs;
