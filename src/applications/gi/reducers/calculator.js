import { isFinite } from 'lodash';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  CALCULATOR_INPUTS_CHANGED,
  FETCH_PROFILE_SUCCEEDED
} from '../actions';

const INITIAL_STATE = {
  inState: 'yes',
  tuitionInState: 0,
  tuitionOutOfState: 0,
  tuitionFees: 0,
  inStateTuitionFees: 0,
  books: 0,
  yellowRibbonRecipient: 'no',
  yellowRibbonAmount: 0,
  scholarships: 0,
  tuitionAssist: 0,
  enrolled: 'full',
  enrolledOld: 'full',
  calendar: 'semesters',
  working: '30',
  numberNontradTerms: '2',
  lengthNontradTerms: '3',
  kickerEligible: 'no',
  kickerAmount: 200,
  buyUp: 'no',
  buyUpAmount: 600,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CALCULATOR_INPUTS_CHANGED: {
      const { field, value } = action;
      let convertedValue = value;

      const isDollarAmount = [
        'tuitionFees',
        'inStateTuitionFees',
        'books',
        'yellowRibbonAmount',
        'scholarships',
        'tuitionAssist',
        'kickerAmount',
        'buyUpAmount'
      ].includes(field);

      if (isDollarAmount && !isFinite(value)) {
        // Strip all non-numeric characters.
        convertedValue = +value.replace(/[^0-9.]+/g, '');
      }

      let newState = {
        [field]: convertedValue,
      };

      if (field === 'yellowRibbonDegreeLevel') {
        const {
          yellowRibbonPrograms
        } = state;

        const yellowRibbonDivisionOptions = yellowRibbonPrograms.length > 0 ?
          [...new Set(yellowRibbonPrograms
            .filter(program => program.degreeLevel === value)
            .map(program => program.divisionProfessionalSchool))] :
          [];

        const yellowRibbonAmount = yellowRibbonPrograms
          .find(program =>
            program.degreeLevel === value &&
            program.divisionProfessionalSchool === yellowRibbonDivisionOptions[0])
          .contributionAmount;

        newState = {
          ...newState,
          yellowRibbonDivisionOptions,
          yellowRibbonDivision: { value: yellowRibbonDivisionOptions, label: yellowRibbonDivisionOptions },
          yellowRibbonAmount
        };
      }

      if (field === 'yellowRibbonDivision') {
        const {
          yellowRibbonDegreeLevel,
          yellowRibbonPrograms
        } = state;

        const yellowRibbonAmount = yellowRibbonPrograms
          .find(program =>
            program.degreeLevel === yellowRibbonDegreeLevel &&
            program.divisionProfessionalSchool === value)
          .contributionAmount;

        newState = {
          ...newState,
          yellowRibbonAmount
        };
      }

      if (field === 'inState') {
        newState.tuitionFees =
          value === 'yes' ?
            state.tuitionInState :
            state.tuitionOutOfState;

        newState.inStateTuitionFees = state.tuitionInState;
      }

      return {
        ...state,
        ...newState
      };
    }

    case FETCH_PROFILE_SUCCEEDED: {
      const camelPayload = camelCaseKeysRecursive(action.payload);
      const yellowRibbonPrograms = [
        {
          divisionProfessionalSchool: 'division1',
          numberOfStudents: 5,
          degreeLevel: 'graduate',
          contributionAmount: 5000
        },
        {
          divisionProfessionalSchool: 'division2',
          numberOfStudents: 3000,
          degreeLevel: 'undergraduate',
          contributionAmount: 5
        },
        {
          divisionProfessionalSchool: 'division3',
          numberOfStudents: 20,
          degreeLevel: 'undergraduate',
          contributionAmount: 25
        }
      ];

      const yellowRibbonDegreeLevelOptions = yellowRibbonPrograms.length > 0 ?
        [...new Set(yellowRibbonPrograms.map(program => program.degreeLevel))] :
        [];
      // first value of degree level is selected by default; only display division options associated with this degree level
      const yellowRibbonDivisionOptions = yellowRibbonPrograms.length > 0 ?
        [...new Set(yellowRibbonPrograms
          .filter(program => program.degreeLevel === yellowRibbonDegreeLevelOptions[0])
          .map(program => program.divisionProfessionalSchool))] :
        [];

      const {
        tuitionInState,
        tuitionOutOfState,
        books,
        calendar,
        type,
      } = camelPayload.data.attributes;

      return {
        ...INITIAL_STATE,
        type,
        tuitionInState: tuitionInState || 0,
        tuitionOutOfState: tuitionOutOfState || 0,
        tuitionFees: tuitionInState || 0,
        inStateTuitionFees: tuitionInState || 0,
        books: books || 0,
        calendar: calendar || 'semesters',
        yellowRibbonDegreeLevel: yellowRibbonPrograms[0].degreeLevel,
        yellowRibbonDivision: yellowRibbonPrograms[0].divisionProfessionalSchool,
        yellowRibbonDegreeLevelOptions,
        yellowRibbonDivisionOptions,
        yellowRibbonPrograms
      };
    }

    default:
      return state;
  }
}
