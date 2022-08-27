import $ from 'jquery';
global.$ = global.jQuery = $;
global.$.fn.modal = jest.fn(() => $()); //mock the module modal of jquery

