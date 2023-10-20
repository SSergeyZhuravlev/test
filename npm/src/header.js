import { el } from 'redom';
import logo from './assets/images/logo.svg';
import './header.scss';

export default el('header.page-header', [
    el('div.page-header-text', 'Welcome'),
    el('img.page-header-logo', { src: logo }),
]);