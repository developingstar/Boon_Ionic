import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app.module'
import './purescript-bridge'

platformBrowserDynamic().bootstrapModule(AppModule)
