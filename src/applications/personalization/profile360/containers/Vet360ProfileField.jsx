import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import recordEvent from '../../../../platform/monitoring/record-event';

import {
  selectVet360Field,
  selectVet360Transaction,
  selectCurrentlyOpenEditModal,
  selectEditedFormField
} from '../selectors';

import HeadingWithEdit from '../components/HeadingWithEdit';
import Transaction from '../components/Transaction';
import * as VET360 from '../constants/vet360';

import {
  clearErrors,
  getTransactionStatus,
  updateFormField,
  openModal,
  saveField
} from '../actions';

class Vet360ProfileField extends React.Component {

  isEmpty() {
    return this.props.isEmpty ? this.props.isEmpty(this.props) : !this.props.data;
  }

  isEditLinKVisible() {
    return !this.isEmpty() && !this.props.transaction;
  }

  renderEmptyState() {
    return (
      <button
        type="button"
        onClick={this.props.onAdd}
        className="va-button-link va-profile-btn">
        Please add your {this.props.title.toLowerCase()}
      </button>
    );
  }

  renderTransaction() {
    return (
      <Transaction
        transaction={this.props.transaction}
        getTransactionStatus={this.props.getTransactionStatus}
        fieldType={this.props.title.toLowerCase()}/>
    );
  }

  renderRequestProcessing() {
    return <span>Processing your request...</span>;
  }

  renderRequestFailed() {
    return <span>Request failed!</span>;
  }

  render() {
    const {
      isEditing,
      onEdit,
      renderContent,
      renderEditModal,
      title,
      transaction,
      transactionRequest
    } = this.props;

    let content = null;

    if (transaction) {
      content = this.renderTransaction();
    } else if (transactionRequest) {
      if (transactionRequest.isPending) {
        content = this.renderRequestProcessing();
      } else if (transactionRequest.isFailed) {
        content = this.renderRequestFailed();
      }
    } else if (this.isEmpty()) {
      content = this.renderEmptyState();
    } else {
      content = renderContent(this.props);
    }

    return (
      <div className="vet360-profile-field">
        <HeadingWithEdit onEditClick={this.isEditLinKVisible() && onEdit}>{title}</HeadingWithEdit>
        {isEditing && renderEditModal(this.props)}
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { fieldName } = ownProps;
  const { transaction, transactionRequest } = selectVet360Transaction(state, fieldName);

  return {
    data: selectVet360Field(state, fieldName),
    field: selectEditedFormField(state, fieldName),
    isEditing: selectCurrentlyOpenEditModal(state) === fieldName,
    transaction,
    transactionRequest
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // TODO turn analytics back on later
  /* eslint-disable no-unused-vars */

  const {
    fieldName,
    analyticsSectionName: sectionName
  } = ownProps;

  const captureEvent = (actionName) => {
    // if (sectionName && actionName) {
    //   recordEvent({
    //     event: 'profile-navigation',
    //     'profile-action': actionName,
    //     'profile-section': sectionName,
    //   });
    // }
  };

  const closeEditModal = () => dispatch(openModal(null));
  const openEditModal = () => dispatch(openModal(fieldName));

  return {
    clearErrors() {
      dispatch(clearErrors);
    },

    getTransactionStatus(transaction) {
      dispatch(getTransactionStatus(transaction, fieldName));
    },

    onAdd() {
      captureEvent('add-link');
      openEditModal();
    },

    onCancel() {
      captureEvent('cancel-button');
      closeEditModal();
    },

    onChange(...args) {
      dispatch(updateFormField[fieldName](...args));
    },

    onEdit() {
      captureEvent('edit-link');
      openEditModal();
    },

    onSubmit(...args) {
      captureEvent('update-button');
      dispatch(saveField[fieldName](...args));
    }
  };
};

const Vet360ProfileFieldContainer = connect(mapStateToProps, mapDispatchToProps)(Vet360ProfileField);

Vet360ProfileFieldContainer.propTypes = {
  analyticsSectionName: PropTypes.string.isRequired,
  fieldName: PropTypes.oneOf(Object.values(VET360.FIELD_NAMES)).isRequired,
  renderContent: PropTypes.func.isRequired,
  renderEditModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Vet360ProfileFieldContainer;
export { Vet360ProfileField };
