import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ExportIcon } from '@patternfly/react-icons';
import { exportCSVButtonActions } from './redux/index';

class ExportCSVButton extends Component {
    constructor(props) {
        super(props);
    }

    exportSelect = () => {
        const { exportType, baselineTableData, baselineData, baselineRowData } = this.props;
        if (exportType === 'baseline list') {
            this.props.exportToCSV(exportType, baselineTableData);
        } else if (exportType === 'baselines data') {
            this.props.exportToCSV(exportType, baselineData, baselineRowData);
        }
    }

    render() {
        return (
            <ExportIcon className='pointer not-active export-button-margin' onClick={ this.exportSelect } />
        );
    }
}

ExportCSVButton.propTypes = {
    exportToCSV: PropTypes.func,
    baselineTableData: PropTypes.array,
    exportType: PropTypes.string,
    baselineData: PropTypes.array,
    baselineRowData: PropTypes.array
};

function mapStateToProps(state) {
    return {
        baselineTableData: state.baselinesTableState.baselineTableData,
        baselineData: state.baselinesTableState.baselineData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        exportToCSV: (exportType, exportData, baselineRowData) => {
            dispatch(exportCSVButtonActions.exportToCSV(exportType, exportData, baselineRowData));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportCSVButton);
