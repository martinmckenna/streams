import React, { Component } from 'react';
import 'whatwg-fetch';

import { fromPoll, fromPromise } from 'kefir';

import { getEvents } from './services/events';

class App extends Component {
  eventsSub;
  /**
   * this is what a consumer might look like
   */
  componentDidMount() {
    this.eventsSub = events$
      /**
       * convert our promise into a stream of data
       */
      .flatMapLatest((promise) => fromPromise(promise))
      /** subscribe to success and errors */
      .observe({
        value(value) {
          console.log(value);
        },
        error(error) {
          console.log('error:', error);
        },
      })
  }

  componentWillUnmount() {
    this.eventsSub.unsubscribe();
  }

  render() {
    return (
      <div className="App">
        Hello world
      </div>
    );
  }
}

/** start the events poll interval at 2 seconds */
const initialPollInterval = 2000;

/** variable that will be set to when the last time the call to getEvents() was run */
let eventRequestDeadline = Date.now();

/** multiplier to make sure that we're polling at increasing intervals */
let currentPollIntervalMultiplier = 1;

const events$ = fromPoll((initialPollInterval / 2 - 1), () => {
  /** getEvents() will run sometime in the future. We need to make sure we're past that future time */
  if (Date.now() > eventRequestDeadline) {

    /** queue getEvents() to run 2 seconds in the future multiplied by an interval */
    eventRequestDeadline = Date.now() + initialPollInterval * currentPollIntervalMultiplier;
    /* double the polling interval with each poll up to 16x */
    currentPollIntervalMultiplier = Math.min(currentPollIntervalMultiplier * 2, 16);

    /** get events and log them */
    return getEvents().then(response => response.data)
  }
  /** if we are not past the next scheduled event time, just return a resolved promise */
  return Promise.resolve()
});

export default App;
