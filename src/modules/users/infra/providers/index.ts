import {container} from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

import JsonWebTokenProvider from './JsonwebtokenProvider/implementations/JsonWebTokenProvider';
import IJsonWebTokenProvider from './JsonwebtokenProvider/models/IJsonWebTokenProvider';


container.registerSingleton<IJsonWebTokenProvider>('JsonWebTokenProvider',JsonWebTokenProvider)

container.registerSingleton<IHashProvider>('BCryptHashProvider',BCryptHashProvider)