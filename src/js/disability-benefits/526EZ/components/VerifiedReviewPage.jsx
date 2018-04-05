import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { focusElement } from '../../../common/utils/helpers';
import ProgressButton from '../../../common/components/form-elements/ProgressButton';
import { setData, setPrivacyAgreement, setEditMode, setSubmission, submitForm, uploadFile } from '../../../common/schemaform/actions';
import { saveAndRedirectToReturnUrl, autoSaveForm } from '../../../common/schemaform/save-in-progress/actions';
import { toggleLoginModal } from '../../../login/actions';
import { getNextPagePath, getPreviousPagePath } from '../../../common/schemaform/routing';

import formConfig from '../config/form';
import ReviewCollapsiblePage from './ReviewCollapsiblePage';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class VerifiedReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedAutoSave = _.debounce(1000, this.autoSave);
  }

  componentDidMount() {
    if (!this.props.blockScrollOnMount) {
      scrollToTop();
      focusElement('h4');
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey ||
      _.get('params.index', prevProps) !== _.get('params.index', this.props)) {
      scrollToTop();
      focusElement('h4');
    }
  }

  setData = (...args) => {
    this.props.setData(...args);
    this.debouncedAutoSave();
  }

  autoSave = () => {
    const { form, user } = this.props;
    if (user.login.currentlyLoggedIn) {
      const data = form.data;
      const { formId, version } = form;
      const returnUrl = this.props.location.pathname;

      this.props.autoSaveForm(formId, data, version, returnUrl);
    }
  }

  goBack = () => {
    const { form, route: { pageList }, location } = this.props;
    const path = getPreviousPagePath(pageList, form.data, location.pathname);
    this.props.router.push(path);
  }

  goForward = () => {
    const { form, route, location } = this.props;
    const path = getNextPagePath(route.pageList, form.data, location.pathname);

    this.props.router.push(path);
  }

  handleEdit = (pageKey, editing, index = null) => {
    this.props.setEditMode(pageKey, editing, index);
  }

  render() {
    const { form, contentAfterButtons, formContext, route } = this.props;
    const { chapterReviewTitle, chapterKey, description, pageKey } = route.pageConfig;
    const page = formConfig.chapters[chapterKey].pages[pageKey];

    return (
      <div>
        {description && <p>{description}</p>}
        <div className="input-section">
          <div>
            <ReviewCollapsiblePage
              key={chapterReviewTitle}
              onEdit={this.handleEdit}
              page={page}
              chapterKey={chapterKey}
              fullPageKey={pageKey}
              setData={this.props.setData}
              setValid={this.props.setValid}
              uploadFile={this.props.uploadFile}
              chapter={formConfig.chapters[chapterKey]}
              formContext={formContext}
              form={form}/>
          </div>
        </div>
        <div className="row form-progress-buttons schemaform-buttons">
          <div className="small-6 medium-5 columns">
            <ProgressButton
              onButtonClick={this.goBack}
              buttonText="Back"
              buttonClass="usa-button-secondary"
              beforeText="«"/>
          </div>
          <div className="small-6 medium-5 end columns">
            <ProgressButton
              submitButton
              onButtonClick={this.goForward}
              buttonText="Continue"
              buttonClass="usa-button-primary"
              afterText="»"/>
          </div>
        </div>
        {contentAfterButtons}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

const mapDispatchToProps = {
  setEditMode,
  setSubmission,
  submitForm,
  setPrivacyAgreement,
  setData,
  uploadFile,
  saveAndRedirectToReturnUrl,
  autoSaveForm,
  toggleLoginModal
};

VerifiedReviewPage.propTypes = {
  form: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  setEditMode: PropTypes.func.isRequired,
  setSubmission: PropTypes.func.isRequired,
  setPrivacyAgreement: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.element,
  renderErrorMessage: PropTypes.func,
  formContext: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifiedReviewPage));

export { VerifiedReviewPage };