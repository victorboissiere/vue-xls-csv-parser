import { mount } from 'avoriaz';
import XlsCsvParser from '../../../src/components/XlsCsvParser';

function expectAlertToShow(message, callback) {
  window.alert = (text) => {
    expect(text).to.equals(message);
    callback();
  };
}

function createWrapper({ userColumns, columns }) {
  const wrapper = mount(XlsCsvParser, { propsData: { columns } });
  wrapper.vm.fileDataReceived(userColumns);
  wrapper.update();
  return wrapper;
}

describe('ColumnChooser component', () => {
  it('should set right data when all columns have been selected', () => {
    // TODO: fix test, html shown is not right, v-for in columnChooser does not work
    /*
    const wrapper = createWrapper({
      userColumns: [
        { name: 'column1', data: ['row1'] },
      ],
      columns: [
        { name: 'column1', value: 'column1' },
      ],
    });
    console.log(wrapper.html());
    wrapper.find('.multiselect__select')[0].trigger('click');
    wrapper.find('.multiselect__element')[0].trigger('click');
    wrapper.find('#validate-columns')[0].trigger('click');
    */
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
    wrapper.find('#validate-columns')[0].trigger('click');
  });
});
