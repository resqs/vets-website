import React from 'react';
import moment from '../../../../platform/startup/moment-setup';
import LoadFail from './LoadFail';
import LoadingSection from './LoadingSection';

class MilitaryInformation extends React.Component {
  componentDidMount() {
    this.props.fetchMilitaryInformation();
  }
  renderContent = () => {
    const {
      serviceHistory: {
        serviceHistory,
        error
      }
    } = this.props.militaryInformation;

    if (error || serviceHistory.length === 0) return <LoadFail information="military"/>;

    return (
      <div>
        {serviceHistory.map((service, index) => {
          return (
            <div key={index}>
              <h3>{service.branchOfService}</h3>
              <div>{moment(service.beginDate).format('MMM D, YYYY')} &ndash; {moment(service.endDate).format('MMM D, YYYY')}</div>
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    return (
      <div>
        <p>If you need to make any updates or corrections, call the Vets.gov Help Desk at  <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008778339">1-800-877-8339</a>). We're here Monday-Friday, 8 a.m. - 8 p.m. (ET).</p>
        <LoadingSection
          isLoading={!this.props.militaryInformation}
          message="Loading military information..."
          render={this.renderContent}/>
      </div>
    );
  }
}

export default MilitaryInformation;