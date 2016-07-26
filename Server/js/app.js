import _ from 'underscore';
import ATV from 'atvjs';

import './helpers';
import css from '../css/app.css';

// Templates
import _loader from '../templates/loader.hbs';
import _error from '../templates/error.hbs';

import '../pages';
import BrowsePage from '../pages/browse';
//import SubscriptionsPage from '../pages/subscriptions';
import SearchPage from '../pages/search';

ATV.start({
  style: css,

  menu: {
    items: [{
      id: 'browse',
      name: 'Browse',
      page: BrowsePage,
      attributes: {
        autoHighlight: true
      }
    }, {
      id: 'subscriptions',
      name: 'Subscriptions',
      //page: SubscriptionsPage
    }, {
      id: 'search',
      name: 'Search',
      page: SearchPage
    }]
  },

  templates: {
    loader: _loader,
    error: _error,
    status: {
      '404': () => _error({
        title: '404',
        message: 'Page cannot be found!'
      }),

      '500': () => _error({
        title: '500',
        message: 'An unknown error occurred in the application. Please try again later.'
      }),

      '503': () => _error({
        title: '500',
        message: 'An unknown error occurred in the application. Please try again later.'
      })
    }
  },

  handlers: {
    select: {
      showMore(e) {
        let element = e.target;
        let showDescription = element.getAttribute('allowsZooming');

        if(showDescription) {
          ATV.Navigation.presentModal(
            `<document>
              <alertTemplate>
                <description class="text-justified">${element.textContent}</description>
              </alertTemplate>
            </document>`
          );
        }
      }
    }
  },

  onLaunch(options) {
    ATV.Navigation.navigateToMenuPage();
  }
});
