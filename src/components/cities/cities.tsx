import { useTypedSelector } from '../../hooks/useTypedSelector';
import { city } from '../../mocks/city';
import { CityName } from '../../helpers/enum';
import { Offer } from '../../types';
import { offerToPoint } from '../../helpers/util';

import CitiesPlaceList from '../cities-place-list';
import Map from '../map';
import Spinner from '../spinner';

type CitiesProps = {
  offers: Offer[];
  activeCity: CityName;
};

function Cities({ offers, activeCity }: CitiesProps) {
  const areOffersLoaded = useTypedSelector((state) => state.areOffersLoaded);

  if (!areOffersLoaded) {
    return (
      <div
        className="cities"
        style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '50px' }}
      >
        <Spinner />
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="cities">
        <div className="cities__places-container cities__places-container--empty container">
          <section className="cities__no-places">
            <div className="cities__status-wrapper tabs__content">
              <b className="cities__status">No places to stay available</b>
              <p className="cities__status-description">
                We could not find any property available at the moment in {activeCity}
              </p>
            </div>
          </section>
          <div className="cities__right-section"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cities">
      <div className="cities__places-container container">
        {/* left section */}
        <CitiesPlaceList offers={offers} activeCity={activeCity} />

        {/* right section */}
        <div className="cities__right-section">
          <section className="cities__map map">
            <Map city={city} points={offers.map((offer) => offerToPoint(offer))} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Cities;
