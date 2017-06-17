import 'reflect-metadata';
import { Container } from 'inversify';

import models from 'models';
import classes from 'classes';
import controllers from 'controllers';

let container = new Container();
container.load(models, controllers, classes)

export default container;
