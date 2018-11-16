import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import * as Sentry from '@sentry/browser';

@Injectable()
class SentryErrorHandler implements ErrorHandler {
    constructor() {
        Sentry.init({
            dsn: 'https://9e9fd4523d784609a5fc0ebb1080592f@sentry.io/50622',
            beforeSend(event, hint) {
                if (
                    event.message.startsWith('Non-Error exception captured') &&
                    hint.originalException['error']
                ) {
                    Sentry.withScope(scope => {
                        Sentry.setExtra('nonErrorException', true);
                        Sentry.captureException(hint.originalException.error);
                    });
                    return null;
                }
                return event;
            }
        });
    }

    public handleError(error) {
        Sentry.captureException(error);
        throw error;
    }
}

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
    bootstrap: [AppComponent]
})
export class AppModule {}
