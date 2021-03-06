import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from '@patternfly/react-core';

import { baselinesTableActions } from '../../BaselinesTable/redux/index';

export class DeleteBaselinesModal extends Component {
    constructor(props) {
        super(props);
        this.deleteBaselines = this.deleteBaselines.bind(this);

        this.state = {
            modalOpened: this.props.modalOpened
        };

        this.toggleModal = () => {
            const { modalOpened } = this.state;

            this.setState({ modalOpened: !modalOpened });
        };
    }

    async deleteBaselines() {
        const {
            clearSelectedBaselines,
            deleteSelectedBaselines,
            selectedBaselineIds,
            fetchBaselines,
            baselineId,
            tableId
        } = this.props;
        let apiBody;

        /*eslint-disable camelcase*/
        if (baselineId) {
            apiBody = { baseline_ids: [ baselineId ]};
        } else {
            apiBody = { baseline_ids: selectedBaselineIds };
        }
        /*eslint-enable camelcase*/

        this.toggleModal();
        let results = await deleteSelectedBaselines(apiBody, tableId);

        if (results.value.data === 'OK') {
            clearSelectedBaselines(tableId);
            fetchBaselines(tableId);
        }
    }

    render() {
        const { modalOpened } = this.state;

        return (
            <Modal
                title="Delete baselines"
                className="small-modal-body"
                isOpen={ modalOpened }
                onClose={ this.toggleModal }
                width="auto"
                isFooterLeftAligned
                actions = { [
                    <Button
                        key="confirm"
                        variant="danger"
                        onClick={ this.deleteBaselines }
                    >
                    Delete Baselines
                    </Button>,
                    <Button
                        key="cancel"
                        variant="secondary"
                        onClick={ this.toggleModal }
                    >
                    Cancel
                    </Button>
                ] }
            >
                Deleting a baseline is permanent and cannot be undone.
            </Modal>
        );
    }
}

DeleteBaselinesModal.propTypes = {
    modalOpened: PropTypes.bool,
    clearSelectedBaselines: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    deleteSelectedBaselines: PropTypes.func,
    fetchBaselines: PropTypes.func,
    baselineId: PropTypes.string,
    tableId: PropTypes.string
};

function mapStateToProps(state) {
    return {
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteSelectedBaselines: (apiBody, tableId) => dispatch(baselinesTableActions.deleteSelectedBaselines(apiBody, tableId)),
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId)),
        fetchBaselines: (tableId) => dispatch(baselinesTableActions.fetchBaselines(tableId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteBaselinesModal);
