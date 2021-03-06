import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody } from '@patternfly/react-core';
import { AddCircleOIcon, ExclamationCircleIcon, UndoIcon } from '@patternfly/react-icons';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaselineModal from './CreateBaselineModal/CreateBaselineModal';
import { baselinesTableActions } from '../BaselinesTable/redux';

export class BaselinesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable ]},
                { title: '' }
            ]
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    fetchBaseline = (baselineId) => {
        const { history } = this.props;

        history.push('baselines/' + baselineId);
    }

    onSelect = (event, isSelected, rowId) => {
        const { baselineTableData, selectBaseline } = this.props;
        let ids;

        if (rowId === -1) {
            ids = baselineTableData.map(function(item) {
                return item[0];
            });
        } else {
            ids = [ baselineTableData[rowId][0] ];
        }

        selectBaseline(ids, isSelected, 'CHECKBOX');
    }

    renderDisplayError() {
        const { revertBaselineFetch, baselineError } = this.props;

        return (
            <center>
                <EmptyState>
                    <EmptyStateIcon icon={ ExclamationCircleIcon } />
                    <br></br>
                    <Title size="lg">Baselines cannot be displayed</Title>
                    <EmptyStateBody>
                        The list of baselines cannot be displayed at this time. Please retry and if
                        <br/>
                        the problem persists contact your system administrator.
                        <br></br>
                        <br></br>
                        <p><small>Error { baselineError.status }: { baselineError.detail }</small></p>
                    </EmptyStateBody>
                    <a onClick={ () => revertBaselineFetch('CHECKBOX') }>
                        <UndoIcon />
                        Retry
                    </a>
                </EmptyState>
            </center>
        );
    }

    renderEmptyState() {
        return (
            <center>
                <EmptyState>
                    <EmptyStateIcon icon={ AddCircleOIcon } />
                    <br></br>
                    <Title size="lg">No baselines</Title>
                    <EmptyStateBody>
                        You currently have no baselines displayed.
                        <br/>
                        Create a baseline to use in your Comparison analysis.
                    </EmptyStateBody>
                    <CreateBaselineButton />
                </EmptyState>
            </center>
        );
    }

    renderTable() {
        const { baselineTableData, loading, createBaselineModalOpened } = this.props;
        const { columns } = this.state;

        return (
            <CardBody>
                <div>
                    <BaselinesTable
                        kebab={ true }
                        createButton={ true }
                        exportButton={ true }
                        onClick={ this.fetchBaseline }
                        hasMultiSelect={ true }
                        tableId='CHECKBOX'
                        onSelect={ this.onSelect }
                        tableData={ baselineTableData }
                        loading={ loading }
                        createBaselineModalOpened={ createBaselineModalOpened }
                        columns={ columns }
                    />
                </div>
            </CardBody>
        );
    }

    renderCardBody = () => {
        const { emptyState, loading, baselineError } = this.props;

        if (emptyState && !loading) {
            return this.renderEmptyState();
        } else if (loading && baselineError.status !== 200 && baselineError.status !== undefined) {
            return this.renderDisplayError();
        } else {
            return this.renderTable();
        }
    }

    render() {
        return (
            <React.Fragment>
                <CreateBaselineModal />
                <PageHeader>
                    <PageHeaderTitle title='Baselines'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        {
                            this.renderCardBody()
                        }
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

BaselinesPage.propTypes = {
    loading: PropTypes.bool,
    baselineTableData: PropTypes.array,
    emptyState: PropTypes.bool,
    createBaselineModalOpened: PropTypes.bool,
    selectBaseline: PropTypes.func,
    history: PropTypes.object,
    baselineError: PropTypes.object,
    revertBaselineFetch: PropTypes.func
};

function mapStateToProps(state) {
    return {
        loading: state.baselinesTableState.checkboxTable.loading,
        emptyState: state.baselinesTableState.checkboxTable.emptyState,
        baselineTableData: state.baselinesTableState.checkboxTable.baselineTableData,
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened,
        baselineError: state.baselinesTableState.checkboxTable.baselineError
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId)),
        revertBaselineFetch: (tableId) => dispatch(baselinesTableActions.revertBaselineFetch(tableId))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesPage));
