import React from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import moment from "moment";

const Week = ({number, start, end, assignments, assignmentToggle, title, subtitle }) => {

  if(!assignments || assignments.length <= 0) return null;

  title = title || (() => `Week ${number}`);

  let formattedStart = moment(start).format('MMMM Do');
  let formattedEnd = moment(end).format('MMMM Do');

  subtitle = subtitle || `${formattedStart} to ${formattedEnd}`;

  assignments = assignments.map(a => (
    <li key={a.name}>
      <label className="checkbox">
        <input type="checkbox" onChange={assignmentToggle(a)} checked={!a.selected} />
        <span className={`margin-left-s margin-top-s ${a.selected ? "" : "strike has-text-grey-light"}` }>
          <strong>{a.sectionModule}</strong>: {a.name}
        </span>
      </label>
    </li>));

  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">
            {title()}
          </h1>
          <h2 className="subtitle">
            {subtitle}
          </h2>
        </div>
        <hr />
        <ul>
          {assignments}
        </ul>
      </div>
    </section>);
};

Week.propTypes = {
  number: PropTypes.number,
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  assignmentToggle: PropTypes.func.isRequired,
  title: PropTypes.func,
  subtitle: PropTypes.func
};

export default Week;
