import React, { useState } from 'react';
import _ from "lodash";
import Moment from 'moment';
import AllSegments from './segments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPrint } from '@fortawesome/free-solid-svg-icons';

import Week from './week';

const PacePlanner = () => {

  const MINIMUM_SEGMENT_DAYS = 14;
  const Segments = {
    both: 0,
    one: 1,
    two: 2
  };

  let calculateWeeks = (start, end) => {
    if(!start || !end) return 0;

    if(typeof start === 'string') start = Moment(start).toDate();
    if(typeof end === 'string') end = Moment(end).toDate();

    let diff = end.getTime() - start.getTime();
    let msPerDay = 1000 * 60 * 60 * 24;
    let days = diff / msPerDay;

    return Math.round(days / 7);
  };

  let toggleAssignment = (a) => () => {
    a.selected = !a.selected;
    generatePacePlan()
  };

  let validate = () => {

    if(!Moment(startDate).isValid()) {
      setErrorMessage("The start date must be a valid date in the form of mm/dd/yyyy.");
      return false;
    }

    if(!Moment(completionDate).isValid()) {
      setErrorMessage("The completion date must be a valid date in the form of mm/dd/yyyy.");
      return false;
    }

    let start = Moment(startDate);
    let end = Moment(completionDate);

    if(end.toDate() <= start.toDate()) {
      setErrorMessage("The completion date must be after the start date.");
      return false;
    }

    let daysDiff = start.diff(end, 'days');

    //Set the highlight for the minimum days message.
    setHighlightMinimumSegment(Math.abs(daysDiff) <= MINIMUM_SEGMENT_DAYS);

    //Clear any pre-existing errors
    setErrorMessage(null);

    return true;
  }

  let generatePacePlan = () => {

    if(!validate()) return;

    let index = 0;
    let week = 0;
    let weeks = calculateWeeks(startDate, completionDate);
    let allSegments = isAdvanced ? AllSegments.advanced : AllSegments.standard;
    let allAssignments = _.chain(allSegments.segments)
                       .filter(s => segmentNeeded === Segments.both || s.id === segmentNeeded)
                       .map(s => s.modules)
                       .flatten()
                       .map(m => m.assignments)
                       .flatten()
                       .value();


    let assignments = allAssignments.filter(a => a.selected);
    let completed = allAssignments.filter(a => !a.selected);
    let msPerWeek = 1000 * 60 * 60 * 24 * 7;
    let assignmentsPerWeek = assignments.length / weeks;
    let weeklyAssignments = _.chain(assignments)
                             .groupBy(a => Math.floor(index++ / assignmentsPerWeek))
                             .map(a => {

                               let currentStartDate = Moment(startDate).toDate();

                               currentStartDate.setDate(currentStartDate.getDate() + week * 7);

                               let currentEndDate = new Date(currentStartDate.getTime() + msPerWeek - 1);

                               return <Week key={week}
                                            number={++week}
                                            start={currentStartDate}
                                            end={currentEndDate}
                                            assignments={a}
                                            assignmentToggle={toggleAssignment} />
                             })
                             .value();

    setPacePlanWeeks(weeklyAssignments);
    setCompletedAssignments(completed);
  };

  let defaultStartDate = new Date();
  let defaultCompletionDate = new Date();
  let defaultCompletionMonths = 3;

  defaultCompletionDate.setMonth(new Date().getMonth() + defaultCompletionMonths);

  let [ isAdvanced, setIsAdvanced ] = useState(false);
  let [ segmentNeeded, setSegmentNeeded ] = useState(Segments.both);
  let [ startDate, setStartDate ] = useState(defaultStartDate.toLocaleDateString());
  let [ completionDate, setCompletionDate ] = useState(defaultCompletionDate.toLocaleDateString());
  let [ pacePlanWeeks, setPacePlanWeeks ] = useState();
  let [ completedAssignments, setCompletedAssignments ] = useState([]);
  let [ errorMessage, setErrorMessage ] = useState();
  let [ highlightMinimumSegmentError, setHighlightMinimumSegment ] = useState(false);
  let enrollmentTypeChange = (e) => setIsAdvanced(e.target.value === 'true');

  return (
    <div className="margin-l margin-top-xl">
      <div className="columns">
        <div className="column is-one-third">
          <article className="panel is-info">
            <p className="panel-heading">
              Pace Plan Details
            </p>
            { !!errorMessage && (
              <div className="panel-block">
                <article className="message is-danger">
                  <div className="message-body">
                    {errorMessage}
                  </div>
                </article>
              </div>
            )}
            <div className="panel-block">
              <div className="control has-text-centered">
                <label className="radio margin-right-xs">
                  <input type="radio"
                         name="enrollmenttype"
                         className="margin-right-xs"
                         value="false"
                         checked={!isAdvanced}
                         onChange={enrollmentTypeChange} />
                  Standard
                </label>
                <label className="radio margin-right-xs">
                  <input type="radio"
                         name="enrollmenttype"
                         className="margin-right-xs"
                         value="true"
                         checked={isAdvanced}
                         onChange={enrollmentTypeChange} />
                  Advanced
                </label>
              </div>
            </div>
            <div className="panel-block">
              <div className="control has-text-centered">
                <label className="radio margin-right-xs">
                  <input type="radio"
                         name="segment"
                         className="margin-right-xs"
                         checked={segmentNeeded === Segments.one}
                         onChange={() => setSegmentNeeded(Segments.one)} />
                  Segment One
                </label>
                <label className="radio margin-right-xs">
                  <input type="radio"
                         name="segment"
                         className="margin-right-xs"
                         checked={segmentNeeded === Segments.two}
                         onChange={() => setSegmentNeeded(Segments.two)} />
                  Segment Two
                </label>
                <label className="radio margin-right-xs">
                  <input type="radio"
                         name="segment"
                         className="margin-right-xs"
                         checked={segmentNeeded === Segments.both}
                         onChange={() => setSegmentNeeded(Segments.both)} />
                  Both
                </label>
              </div>
            </div>
            <div className="panel-block">
              <div className="field has-addons">
                <p className="control">
                  <span className="button is-static">
                    <FontAwesomeIcon icon={faCalendar} className="margin-right-xs" />
                    Start Date:
                  </span>
                </p>
                <p className="control">
                  <input className="input" type="date" placeholder="" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </p>
              </div>
            </div>
            <div className="panel-block">
              <div className="field has-addons">
                <p className="control">
                  <span className="button is-static">
                    <FontAwesomeIcon icon={faCalendar} className="margin-right-xs" />
                    Completion Date:
                  </span>
                </p>
                <p className="control">
                  <input className="input" type="date" placeholder="" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
                </p>
              </div>
            </div>
            <div className="panel-block">
              <button className="button is-success is-fullwidth" onClick={generatePacePlan}>
                Generate Pace Plan
              </button>
            </div>
          </article>
          <article className="message">
            <div className="message-body">
              After generating your pace plan, click the check box next to each assignment you have completed to fine tune your pace plan. Completed assignments appear at the end of the pace plan.
            </div>
          </article>
          <article className={highlightMinimumSegmentError ? "message is-danger" : "message is-info"}>
            <div className="message-body">
              Florida Virtual School requires students to be actively working in a segment for a minimum of {MINIMUM_SEGMENT_DAYS} calendar days in order to receive credit.
            </div>
          </article>
        </div>
        <div className="column">
          {pacePlanWeeks}
          <a id="#/pace/completed">
            <Week title={() => "Completed Assignments"}
                  subtitle={() => "Assignments that you have already done"}
                  start={Moment(startDate, "MM/DD/YYYY").toDate()}
                  end={Moment(completionDate, "MM/DD/YYYY").toDate()}
                  assignments={completedAssignments}
                  assignmentToggle={toggleAssignment} />
          </a>
        </div>
      </div>
    </div>);

};

export default PacePlanner;
