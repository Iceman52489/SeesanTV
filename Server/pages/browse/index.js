import ATV from 'atvjs';
import template from './template.hbs';
import request from '../../js/request';

let Page = ATV.Page.create({
	name: 'browse',
	template: template,
  url: 'http://api.mochadevelopment.com/api/categories',
  data(response) {
    let sections = response,
        intSection;

    for(intSection = 0; intSection < sections.length; intSection++) {
      sections[intSection].programs = [];
    }

    return sections;
  },

  events: {
    select: 'select',
    highlight: 'highlight'
  },

  select(e) {
    console.log('Select!');
  },

  highlight(e) {
    console.log('Highlight!');
  }
});

export default Page;
