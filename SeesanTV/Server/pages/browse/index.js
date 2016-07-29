import ATV from 'atvjs';
import template from './template.hbs';

let Page = ATV.Page.create({
	name: 'browse',
	template: template,
	events: {
		select: 'onSelect'
	},

	onSelect(e) {
		let element = e.target;
		let menuNavigation = element.getAttribute('data-href-menu');

		if(menuNavigation) {
			ATV.Navigation.navigateToMenuPage();
		}
	}
});

export default Page;
