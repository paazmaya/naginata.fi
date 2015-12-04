/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
'use strict';

module.exports = {
  config: {
    app_name: ['Naginata Finland'],
    license_key: 'b0808427e37387d757273fdd740d5a90b9ed2074',
    capture_params: true,
    logging: {
      /**
       * Level at which to log. 'trace' is most useful to New Relic when diagnosing
       * issues with the agent, 'info' and higher will impose the least overhead on
       * production applications.
       */
      level: 'info'
    }
  }
};
