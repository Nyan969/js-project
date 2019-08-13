import "./style.css";
import {User} from "./user";
import {CardList} from './cardList.js';

/*************************************************************************************/
export const user = new User();
export const cardList = new CardList(document.querySelector('.places-list'));
/*************************************************************************************/