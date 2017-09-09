import { mount } from 'avoriaz';
import ColumnChooser from '../../../src/components/ColumnChooser';

function createWrapper({ userColumns, columns }) {
  const wrapper = mount(ColumnChooser, { propsData: { userColumns, columns } });
  wrapper.update();
  return wrapper;
}

function validate(wrapper) {
  wrapper.find('#validate-columns')[0].trigger('click');
}

function select(wrapper, columnNumber, optionNumber) {
  // Skip Simplert child to test only vue select
  wrapper.vm.$children[columnNumber + 1].activate();
  wrapper.vm.$children[columnNumber + 1].select(wrapper.vm.$props.columns[optionNumber]);
}

describe('ColumnChooser component', () => {
  it('should set right data when all columns have been selected', () => {
    const wrapper = createWrapper({
      userColumns: [
        { name: 'login', data: ['row1'] },
      ],
      columns: [
        { name: 'Login', value: 'login' },
      ],
    });
    select(wrapper, 0, 0);
    validate(wrapper);
    expect(wrapper.data().results).to.have.lengthOf(1);
    expect(wrapper.data().results).to.deep.equals([{ column: 'login', data: ['row1'] }]);
  });
  it('should show an error if user does not select anything', (done) => { // eslint-disable-line
    const wrapper = createWrapper({
      userColumns: [
        { name: 'column1', data: ['row1'] },
      ],
      columns: [
        { name: 'column1', value: 'column1' },
      ],
    });
    wrapper.vm.showError = (message) => {
      expect(message).to.equals('You need to select all columns');
      done();
    };
    validate(wrapper);
  });
  it('should show an error if user has conflict', (done) => {
    const wrapper = createWrapper({
      userColumns: [
        { name: 'Login', data: ['row1'] },
        { name: 'Firstname', data: ['row2'] },
      ],
      columns: [
        { name: 'Login', value: 'login' },
        { name: 'lastname', value: 'lastname' },
      ],
    });
    wrapper.vm.showError = (message) => {
      expect(message).to.equals('You need to select all columns');
      done();
    };
    select(wrapper, 0, 0);
    select(wrapper, 1, 0);
    validate(wrapper);
  });
  it('should show an error if all columns selected but missing required columns', (done) => {
    const wrapper = createWrapper({
      userColumns: [
        { name: 'Login', data: ['row1'] },
        { name: 'Firstname', data: ['row2'] },
      ],
      columns: [
        { name: 'Login', value: 'login' },
        { name: 'lastname', value: 'lastname', isOptional: true },
        { name: 'Firstname', value: 'firstname', isOptional: true },
      ],
    });
    wrapper.vm.showError = (message) => {
      expect(message).to.equals('Missing required columns: login');
      done();
    };
    select(wrapper, 0, 1);
    select(wrapper, 1, 2);
    validate(wrapper);
  });
});
