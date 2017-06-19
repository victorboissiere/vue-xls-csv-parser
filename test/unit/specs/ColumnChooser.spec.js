import { mount } from 'avoriaz';
import ColumnChooser from '../../../src/components/ColumnChooser';

function expectAlertToShow(message, callback) {
  window.alert = (text) => {
    expect(text).to.equals(message);
    callback();
  };
}

function createWrapper({ userColumns, columns }) {
  const wrapper = mount(ColumnChooser, { propsData: { userColumns, columns } });
  wrapper.update();
  return wrapper;
}

function validate(wrapper) {
  wrapper.find('#validate-columns')[0].trigger('click');
}

function select(wrapper, columnNumber, optionNumber) {
  wrapper.vm.$children[columnNumber].activate();
  wrapper.vm.$children[columnNumber].select(wrapper.vm.$props.columns[optionNumber]);
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
  it('should show an error if user do not select all columns', (done) => { // eslint-disable-line
    const wrapper = createWrapper({
      userColumns: [
        { name: 'column1', data: ['row1'] },
      ],
      columns: [
        { name: 'column1', value: 'column1' },
      ],
    });
    expectAlertToShow('You need to select all columns', () => done());
    validate(wrapper);
  });
});
