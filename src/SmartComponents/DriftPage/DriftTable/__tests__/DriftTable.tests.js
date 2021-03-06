import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import { EmptyState } from '@patternfly/react-core';
import { Skeleton } from '@redhat-cloud-services/frontend-components';

import ConnectedDriftTable, { DriftTable } from '../DriftTable';
import { compareReducerPayload, baselinesPayload, historicalProfilesPayload } from '../../../modules/__tests__/reducer.fixtures';

global.insights = {
    chrome: {
        auth: {
            getUser: () => new Promise((resolve) => {
                setTimeout(resolve, 1);
            }),
            logout: jest.fn()
        },
        isBeta: jest.fn()
    }
};

describe('DriftTable', () => {
    let props;

    beforeEach(() => {
        props = {
            location: {},
            history: {},
            fetchCompare: jest.fn(),
            fullCompareData: [],
            filteredCompareData: [],
            systems: [],
            baselines: [],
            historicalProfiles: [],
            factSort: '',
            stateSort: '',
            loading: false,
            toggleFactSort: jest.fn(),
            toggleStateSort: jest.fn(),
            expandRow: jest.fn(),
            expandedRows: [],
            setSelectedBaselines: jest.fn(),
            setSelectedHistoricProfiles: jest.fn(),
            selectHistoricProfiles: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () =>{
        const wrapper = shallow(
            <DriftTable { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedDriftTable', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            compareState: {
                error: {},
                loading: false,
                systems: [],
                baselines: [],
                historicalProfiles: [],
                fullCompareData: [],
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
                emptyState: true
            },
            addSystemModalState: { addSystemModalOpened: false },
            baselinesTableState: { checkboxTable: {}},
            historicProfilesState: {}
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find(EmptyState)).toHaveLength(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render systems, baselines and historicalProfiles', () => {
        initialState.compareState.fullCompareData = compareReducerPayload.facts;
        initialState.compareState.systems = compareReducerPayload.systems;
        initialState.compareState.baselines = baselinesPayload;
        initialState.compareState.historicalProfiles = historicalProfilesPayload;
        initialState.compareState.emptyState = false;
        initialState.compareState.loading = false;

        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('table')).toHaveLength(1);
        expect(wrapper.find('tr')).toHaveLength(1);
        expect(wrapper.find(EmptyState)).toHaveLength(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading rows', () => {
        initialState.compareState.loading = true;
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('tr')).toHaveLength(11);
        expect(wrapper.find(Skeleton)).toHaveLength(30);
        expect(wrapper.find(EmptyState)).toHaveLength(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
