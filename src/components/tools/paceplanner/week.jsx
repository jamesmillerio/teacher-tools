import React from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";

const Week = ({number, start, end, assignments, assignmentToggle, title, subtitle}) => {

  if(!assignments || assignments.length <= 0) return null;

  title = title || (() => `Week ${number}`);
  subtitle = subtitle || (() => ( <React.Fragment>
                                    <Moment format='MMMM Do'>{start}</Moment> to <Moment format='MMMM Do'>{end}</Moment>
                                  </React.Fragment>));

  assignments = assignments.map(a => (
    <li key={a.name}>
      <label className="checkbox">
        <input type="checkbox" onChange={assignmentToggle(a)} checked={!a.selected} />
        <span className={`margin-left-s margin-top-s ${a.selected ? "" : "strike has-text-grey-light"}` }>
          {a.name}
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
            {subtitle()}
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
